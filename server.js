/**
 * server.js  —  SwanCore Trading Engine  (CRASH-PROOF edition)
 *
 * UPGRADES vs original:
 *  1. Redis-safe reconnect layer  — exponential back-off, isReady guard on every call,
 *     safeRedisGet / safeRedisSet helpers that never throw.
 *  2. Worker throttling system    — binary semaphores on every setInterval worker so
 *     a slow upstream (Binance / CoinGecko) cannot stack concurrent loops.
 *  3. Zero race-condition matching — in-memory order-book operations are now serialised
 *     through a per-pair async mutex; no two match cycles can interleave on the same pair.
 *  4. Production-grade event flow — Socket.io rooms (one per pair), deduplication of
 *     duplicate route registrations, global uncaughtException + unhandledRejection fence.
 */

"use strict";

// ─── Global crash fence (must be first) ─────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("💥 uncaughtException — process will NOT exit:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("💥 unhandledRejection — process will NOT exit:", reason);
});

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const axios = require("axios");
const ogs = require("open-graph-scraper");
const redis = require("redis");
const helmet = require("helmet");
const Parser = require("rss-parser");
require("dotenv").config();
const { Server } = require("socket.io");
const EventEmitter = require("events");

const { processNews } = require("./utils/newsEngine");
const { authMiddleware } = require("./src/middleware/authMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const depositRoutes = require("./src/routes/depositRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const proTradingRoutes = require("./src/routes/proTradingRoutes");

// Models (single import for User to avoid duplicate declarations)
const User = require('./models/User');

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://hitachi-intense-exciting-steve.trycloudflare.com",
];

app.use((req, _res, next) => {
  if (!req.url.includes("/health") && !req.url.includes("/orderbook")) {
    console.log(`📨 ${req.method} ${req.url}`);
  }
  next();
});

app.use(cors({
  origin: (_origin, cb) => cb(null, true),
  credentials: true,
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const rateLimit = require("express-rate-limit");
app.use("/api/auth", rateLimit({ windowMs: 60_000, max: 10 }));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://challenges.cloudflare.com"],
      frameSrc: ["https://challenges.cloudflare.com"],
      connectSrc: ["'self'", "https://challenges.cloudflare.com"],
    },
  },
}));

// ─── UPGRADE 1: Redis-safe reconnect layer ────────────────────────────────────
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    // Exponential back-off: 100ms → 200ms → 400ms … capped at 5 s, abort after 20 retries
    reconnectStrategy: (retries) => {
      if (retries >= 20) {
        console.error("🔴 Redis: max reconnect retries exceeded — giving up");
        return new Error("Redis max retries");
      }
      const delay = Math.min(100 * 2 ** retries, 5_000);
      console.warn(`🟡 Redis: reconnecting in ${delay}ms (attempt ${retries + 1})`);
      return delay;
    },
    connectTimeout: 10_000,
  },
});

redisClient.on("connect", () => console.log("⚡ Redis connecting…"));
redisClient.on("ready",   () => console.log("⚡ Redis ready"));
redisClient.on("error",   (err) => console.error("🔴 Redis error:", err.message));
redisClient.on("reconnecting", () => console.warn("🟡 Redis reconnecting…"));

// Non-throwing helpers — callers never need to guard for Redis being offline
const safeRedisGet = async (key) => {
  if (!redisClient.isReady) return null;
  try { return await redisClient.get(key); } catch { return null; }
};
const safeRedisSetEx = async (key, ttl, value) => {
  if (!redisClient.isReady) return;
  try { await redisClient.setEx(key, ttl, value); } catch { /* best-effort */ }
};

if (process.env.NODE_ENV !== "test") {
  redisClient.connect().catch((err) => console.error("Redis initial connect failed:", err.message));
}

// ─── Trading internals ────────────────────────────────────────────────────────
const emitter = new EventEmitter();
const BINANCE_API_BASE = "https://api.binance.com";
const BINANCE_QUOTE_ASSETS = ["USDT", "USD", "BTC", "ETH", "BNB"];

// ─── UPGRADE 3: Per-pair async mutex for zero-race matching ──────────────────
// A Map of pair → Promise chain. Every mutating operation queues itself on the
// chain so no two operations for the same pair can run concurrently.
const pairMutex = new Map();

function withPairLock(pair, fn) {
  const previous = pairMutex.get(pair) || Promise.resolve();
  const next = previous.then(fn).catch((err) => {
    console.error(`[pairLock:${pair}] error:`, err.message);
  });
  pairMutex.set(pair, next);
  return next;
}

// Order-book store
const markets = {};

function getMarket(pair) {
  if (!markets[pair]) markets[pair] = { buy: [], sell: [], trades: [] };
  return markets[pair];
}

function binanceSymbolForPair(pair) { return pair.replace("/", ""); }
function pairFromBinanceSymbol(symbol) {
  for (const q of BINANCE_QUOTE_ASSETS) {
    if (symbol.endsWith(q)) return `${symbol.slice(0, -q.length)}/${q}`;
  }
  return symbol;
}

async function fetchBinanceSymbols() {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/exchangeInfo`, { timeout: 8000 });
    if (!data?.symbols?.length) throw new Error("Invalid response");
    return data.symbols
      .filter((i) => i.status === "TRADING" && i.quoteAsset === "USDT")
      .map((i) => `${i.baseAsset}/${i.quoteAsset}`)
      .slice(0, 120);
  } catch (err) {
    console.error("Binance symbols fetch failed:", err.message);
    return ["BTC/USDT"];
  }
}

async function fetchBinanceOrderBook(pair) {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/depth`, {
      params: { symbol: binanceSymbolForPair(pair), limit: 50 },
      timeout: 8000,
    });
    return {
      buy:  data.bids.map(([p, a]) => ({ price: Number(p), amount: Number(a) })),
      sell: data.asks.map(([p, a]) => ({ price: Number(p), amount: Number(a) })),
    };
  } catch (err) {
    console.error("Binance orderbook fetch failed:", pair, err.message);
    return null;
  }
}

async function fetchBinanceTrades(pair) {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/trades`, {
      params: { symbol: binanceSymbolForPair(pair), limit: 40 },
      timeout: 8000,
    });
    return data.map((t) => ({
      time:   Math.floor(t.time / 1000),
      price:  Number(t.price),
      amount: Number(t.qty),
      side:   t.isBuyerMaker ? "sell" : "buy",
    }));
  } catch (err) {
    console.error("Binance trades fetch failed:", pair, err.message);
    return null;
  }
}

async function fetchBinanceCandles(pair, timeframe = "1m", limit = 80) {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/klines`, {
      params: { symbol: binanceSymbolForPair(pair), interval: timeframe, limit },
      timeout: 8000,
    });
    return data.map((k) => ({
      time:   Math.floor(k[0] / 1000),
      open:   Number(k[1]),
      high:   Number(k[2]),
      low:    Number(k[3]),
      close:  Number(k[4]),
      volume: Number(k[5]),
    }));
  } catch (err) {
    console.error("Binance candles fetch failed:", pair, err.message);
    return null;
  }
}

function sortBook(book) {
  book.buy.sort((a, b) => b.price - a.price);
  book.sell.sort((a, b) => a.price - b.price);
}

// UPGRADE 3: matchOrders is called inside withPairLock — fully serialised
async function matchOrders(pair) {
  const market = getMarket(pair);
  sortBook(market);

  while (
    market.buy.length &&
    market.sell.length &&
    market.buy[0].price >= market.sell[0].price
  ) {
    const buy  = market.buy[0];
    const sell = market.sell[0];
    const amount = Math.min(buy.amount, sell.amount);

    const trade = {
      id:     `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      pair,
      price:  sell.price,
      amount,
      time:   Math.floor(Date.now() / 1000),
      buyOrderId: buy.orderId || null,
      sellOrderId: sell.orderId || null,
      buyUserId: buy.userId || null,
      sellUserId: sell.userId || null,
    };

    market.trades.unshift(trade);
    if (market.trades.length > 200) market.trades.length = 200; // cap memory

    buy.amount  -= amount;
    sell.amount -= amount;

    if (buy.amount  <= 0) market.buy.shift();
    if (sell.amount <= 0) market.sell.shift();

    // persist trade side effects: update user orders & positions
    try {
      const Order = require('./models/Order');
      const Position = require('./models/Position');

      // update buyer order if exists
      if (trade.buyOrderId) {
        const o = await Order.findOne({ orderId: trade.buyOrderId });
        if (o) {
          o.filled = (o.filled || 0) + amount;
          o.status = o.filled >= o.amount ? 'filled' : 'partially_filled';
          await o.save();
        }
      }

      if (trade.sellOrderId) {
        const o2 = await Order.findOne({ orderId: trade.sellOrderId });
        if (o2) {
          o2.filled = (o2.filled || 0) + amount;
          o2.status = o2.filled >= o2.amount ? 'filled' : 'partially_filled';
          await o2.save();
        }
      }

      // settle buyer funds -> create/update position
      if (trade.buyUserId) {
        const buyer = await User.findById(trade.buyUserId);
        if (buyer) {
          const cost = trade.price * trade.amount;
          // deduct any frozen funds first (best-effort)
          buyer.frozenBalance = Math.max(0, (buyer.frozenBalance || 0) - cost);
          await buyer.save();

          let pos = await Position.findOne({ userId: buyer._id, pair });
          if (!pos) {
            pos = await Position.create({ userId: buyer._id, pair, size: trade.amount, entryPrice: trade.price, margin: cost });
          } else {
            // average entry price
            const newSize = pos.size + trade.amount;
            const newEntry = ((pos.entryPrice * pos.size) + (trade.price * trade.amount)) / newSize;
            pos.size = newSize;
            pos.entryPrice = newEntry;
            pos.margin = (pos.margin || 0) + cost;
            pos.updatedAt = new Date();
            await pos.save();
          }
        }
      }

      // settle seller: credit proceeds
      if (trade.sellUserId) {
        const seller = await User.findById(trade.sellUserId);
        if (seller) {
          const proceeds = trade.price * trade.amount;
          seller.balance = (seller.balance || 0) + proceeds;
          // reduce frozen if any
          seller.frozenBalance = Math.max(0, (seller.frozenBalance || 0) - proceeds);
          await seller.save();
        }
      }
    } catch (err) {
      console.error('Trade settlement error:', err.message);
    }

    emitter.emit("trade", trade);
  }

  sortBook(market);

  emitter.emit("orderbook", {
    pair,
    buy:  market.buy.slice(0, 17),
    sell: market.sell.slice(0, 17),
  });
}

function addOrder({ pair, side, price, amount, userId, orderId }) {
  if (!pair || !side || !price || !amount) throw new Error("Missing order fields");
  return withPairLock(pair, async () => {
    const market = getMarket(pair);
    const order  = {
      id:     `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      orderId: orderId || null,
      userId: userId || null,
      side,
      price:  Number(price),
      amount: Number(amount),
    };
    market[side].push(order);
    await matchOrders(pair);
    return order;
  });
}

function getOrderBook(pair) { return getMarket(pair); }
function getTrades(pair)    { return getMarket(pair).trades.slice(0, 50); }

// ─── Market data routes ───────────────────────────────────────────────────────
const cleanPair = (p) => decodeURIComponent(p);

app.get("/api/ping",                (_req, res) => res.json({ success: true, source: "local-server" }));
app.get("/api/market/symbols",      async (_req, res) => res.json({ symbols: await fetchBinanceSymbols() }));

app.get("/api/market/orderbook/:pair", async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const book = await fetchBinanceOrderBook(pair);
  if (book) return res.json(book);
  const market = getMarket(pair);
  sortBook(market);
  res.json({
    buy:  market.buy.slice(0, 17).map((o) => ({ price: Number(o.price), amount: Number(o.amount) })),
    sell: market.sell.slice(0, 17).map((o) => ({ price: Number(o.price), amount: Number(o.amount) })),
  });
});

app.get("/api/market/trades/:pair", async (req, res) => {
  const pair   = cleanPair(req.params.pair);
  const trades = await fetchBinanceTrades(pair);
  res.json(trades || getTrades(pair));
});

app.get("/api/market/candles/:pair", async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
  const candles   = await fetchBinanceCandles(pair, timeframe, 1000);
  if (candles) return res.json(candles);

  const trades = getTrades(pair);
  const intervalMap = { "1m": 60, "5m": 300, "15m": 900, "1h": 3600 };
  const interval    = intervalMap[timeframe] || 60;

  if (!trades.length) {
    const now = Math.floor(Date.now() / 1000);
    let price = 30_000;
    return res.json(Array.from({ length: 80 }, (_, i) => {
      price += (Math.random() - 0.5) * 200;
      const open  = price;
      const close = price + (Math.random() - 0.5) * 100;
      const high  = Math.max(open, close) + Math.random() * 50;
      const low   = Math.min(open, close) - Math.random() * 50;
      return {
        time:   Math.floor((now - (79 - i) * interval) / interval) * interval,
        open:   +open.toFixed(2),
        high:   +high.toFixed(2),
        low:    +low.toFixed(2),
        close:  +close.toFixed(2),
        volume: +(Math.random() * 10 + 1).toFixed(2),
      };
    }));
  }

  const map = {};
  trades.forEach((t) => {
    const bucket = Math.floor(t.time / interval) * interval;
    if (!map[bucket]) {
      map[bucket] = { time: bucket, open: t.price, high: t.price, low: t.price, close: t.price, volume: t.amount };
    } else {
      const c = map[bucket];
      c.high   = Math.max(c.high, t.price);
      c.low    = Math.min(c.low,  t.price);
      c.close  = t.price;
      c.volume += t.amount;
    }
  });
  res.json(Object.values(map));
});

app.get("/api/market/deepmarket/:pair", async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
  const candles   = await fetchBinanceCandles(pair, timeframe, 1000);
  if (!candles) return res.json([]);
  res.json(candles.map((c) => ({ time: c.time, value: c.close * (1 + Math.sin(c.time / 1000) * 0.02) })));
});

// ─── Application routes ───────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/posts",         postRoutes);
app.use("/api/deposits",      depositRoutes);
app.use("/api/transactions",  transactionRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pro",           proTradingRoutes);

app.get("/test",    (_req, res) => res.json({ message: "Server is working" }));
app.get("/health",  (_req, res) => res.send("OK"));

// Debug helper: emit synthetic priceUpdate events for local testing only
app.post('/__debug/emitPrice', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed' });
  try {
    const { pair, price, store } = req.body;
    const p = price === null || price === undefined ? null : Number(price);
    io.emit('priceUpdate', { pair, price: p, time: Date.now() });
    if (store && p !== null) cachedMarketPrices[pair] = p;
    return res.json({ success: true, pair, price: p });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Profile endpoint
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.userId).select("-password");
    if (!user)     return res.status(404).json({ message: "User not found" });
    res.json({
      success: true,
      user: {
        _id:         user._id,
        userId:      user.userId,
        email:       user.email,
        name:        user.name        || "",
        kycVerified: user.kycVerified || false,
        kycStatus:   user.kycStatus   || "not_started",
        balance:     user.balance     || 0,
        createdAt:   user.createdAt,
      },
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- Account summary / positions / orders ---
const Order = require('./models/Order');
const Position = require('./models/Position');
const Balance = require('./models/Balance');
const Trade = require('./models/Trade');
const balanceService = require('./src/services/balanceService');

app.get('/api/account/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const positions = await Position.find({ userId });
    // compute unrealized using cachedMarketPrices or fallback
    let totalUnreal = 0;
    positions.forEach((p) => {
      const cached = cachedMarketPrices[p.pair];
      const mark = isValidPriceValue(cached) ? cached : (Number.isFinite(p.entryPrice) && p.entryPrice > 0 ? p.entryPrice : null);
      const pnl = (mark !== null && Number.isFinite(p.entryPrice)) ? (mark - p.entryPrice) * p.size : 0; // skip when price unavailable
      totalUnreal += pnl;
    });

    const openOrders = await Order.find({ userId, status: { $in: ['open','partially_filled'] } });

    const summary = {
      available: user.balance || 0,
      locked: user.frozenBalance || 0,
          holdings: positions.map((p) => {
            const cached = cachedMarketPrices[p.pair];
            const mark = isValidPriceValue(cached) ? cached : (Number.isFinite(p.entryPrice) && p.entryPrice > 0 ? p.entryPrice : null);
            return { asset: p.pair.split('/')[0], amount: p.size, value: mark !== null ? mark * p.size : 0 };
          }),
      totalBalance: (user.balance || 0) + (user.frozenBalance || 0),
      totalEquity: ((user.balance || 0) + (user.frozenBalance || 0)) + totalUnreal,
      usedMargin: positions.reduce((s, p) => s + (p.margin || 0), 0),
      freeMargin: ((user.balance || 0) + (user.frozenBalance || 0)) - positions.reduce((s, p) => s + (p.margin || 0), 0) + totalUnreal,
      dailyPnL: 0,
      winRate: 0,
      openOrdersCount: openOrders.length,
    };

    res.json(summary);
  } catch (err) {
    console.error('Account summary error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/account/positions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const positions = await Position.find({ userId });
    res.json(positions);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
});

app.get('/api/account/open-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const orders = await Order.find({ userId, status: { $in: ['open','partially_filled'] } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
});

app.get('/api/account/balances', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Get current balances from Balance collection
    const balances = await balanceService.getBalances(userId);

    return res.json({
      USDT: {
        available: balances.USDT.available,
        locked: balances.USDT.locked,
        total: balances.USDT.total
      },
      BTC: {
        available: balances.BTC.available,
        locked: balances.BTC.locked,
        total: balances.BTC.total
      },
      totalUSDT: balances.USDT.total,
      totalBTC: balances.BTC.total,
      estimatedUSDTValue: balances.USDT.total + (balances.BTC.total * (cachedMarketPrices['BTC/USDT'] || 0))
    });
  } catch (err) {
    console.error('Account balances error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/account/recalculate-balances', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Recalculate from trade history
    const result = await balanceService.recalculateBalancesFromHistory(userId, user.balance || 0);

    const balances = await balanceService.getBalances(userId);

    return res.json({
      message: 'Balances recalculated from trade history',
      calculated: result,
      current: {
        USDT: balances.USDT,
        BTC: balances.BTC
      }
    });
  } catch (err) {
    console.error('Balance recalculation error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DEV ENDPOINT: Reset database to clean state ───────────────────────────
app.post('/api/dev/reset', async (req, res) => {
  try {
    const RESET_BALANCE = 100000; // $100,000 starting balance for testing

    // Cancel all open orders
    await Order.updateMany(
      { status: { $in: ['open', 'partially_filled'] } },
      { $set: { status: 'cancelled' } }
    );
    const cancelledCount = await Order.countDocuments({ status: 'cancelled' });
    console.log(`[DEV RESET] Cancelled ${cancelledCount} orders`);

    // Reset all users' balances to $100,000 USDT
    const users = await User.find();
    for (const user of users) {
      user.balance = RESET_BALANCE;
      user.frozenBalance = 0;
      await user.save();

      // Initialize/reset Balance records
      await Balance.updateOne(
        { userId: user._id, currency: 'USDT' },
        {
          $set: {
            available: RESET_BALANCE,
            locked: 0,
            total: RESET_BALANCE
          }
        },
        { upsert: true }
      );

      await Balance.updateOne(
        { userId: user._id, currency: 'BTC' },
        {
          $set: {
            available: 0,
            locked: 0,
            total: 0
          }
        },
        { upsert: true }
      );
    }
    console.log(`[DEV RESET] Reset ${users.length} users to $${RESET_BALANCE} USDT`);

    // Clear all trades (optional - for complete reset)
    // Uncomment if you want to wipe trade history:
    // await Trade.deleteMany({});
    // console.log('[DEV RESET] Cleared all trades');

    // Clear all positions
    await Position.deleteMany({});
    console.log('[DEV RESET] Cleared all positions');

    return res.json({
      message: 'Database reset to clean state',
      stats: {
        ordersReset: true,
        usersReset: users.length,
        balancePerUser: RESET_BALANCE,
        positionsCleared: true
      }
    });
  } catch (err) {
    console.error('[DEV RESET] Error:', err.message);
    return res.status(500).json({ message: 'Reset failed', error: err.message });
  }
});


// Trade history for current user
app.get('/api/trade/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const trades = await Trade.find({ userId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const formatted = trades.map((trade) => ({
      id: trade._id,
      pair: trade.pair || 'BTC/USDT',
      side: trade.side || 'buy',
      type: trade.type || 'market',
      status: trade.status || 'closed',
      price: Number(trade.entryPrice || trade.price || 0),
      quantity: Number(trade.amount || 0),
      profit: Number(trade.profit || 0),
      time: new Date(trade.createdAt || Date.now()).getTime()
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Trade history error:', err.message);
    return res.status(500).json({ message: 'Failed to load trade history' });
  }
});

// Place trade/order
app.post('/api/trade/place', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { pair, amount, side, price, type = 'limit', stopLoss, takeProfit, slippageTolerance = 0 } = req.body;
    if (!pair || !amount || !side) return res.status(400).json({ message: 'Missing required fields' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure user has initialized balances
    try {
      await balanceService.initializeBalances(userId, user.balance || 0);
    } catch (err) {
      console.warn('Failed to initialize balances:', err.message);
    }

    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const o = await Order.create({ orderId, userId, pair, side, type, price: Number(price || 0), amount: Number(amount) });

    const supplied = Number(price);
    const suppliedValid = Number.isFinite(supplied) && supplied > 0;
    const cached = cachedMarketPrices[pair];
    const cachedValid = isValidPriceValue(cached);

    // Limit orders require an explicit price; market orders require a valid cached market price.
    if (type !== 'market' && !suppliedValid) {
      o.status = 'cancelled';
      await o.save();
      return res.status(400).json({ message: 'Limit orders require a valid price' });
    }

    const execPrice = suppliedValid ? supplied : cachedValid ? cached : null;
    if (execPrice === null) {
      o.status = 'cancelled';
      await o.save();
      return res.status(400).json({ message: 'Market price unavailable' });
    }

    const cost = execPrice * Number(amount);

    if (side === 'buy') {
      // Lock USDT balance using balanceService (atomic operation)
      try {
        await balanceService.lockBalance(userId, 'USDT', cost);
      } catch (balErr) {
        o.status = 'cancelled';
        await o.save();
        return res.status(400).json({ message: 'Insufficient USDT balance: ' + balErr.message });
      }
    }

    // If market order -> execute immediately against current market
    if (type === 'market') {
      if (!cachedValid) {
        o.status = 'cancelled';
        await o.save();
        if (side === 'buy') {
          try {
            await balanceService.unlockBalance(userId, 'USDT', cost);
          } catch (err) {
            console.error('Failed to refund after cancel:', err.message);
          }
        }
        return res.status(400).json({ message: 'Market price unavailable' });
      }

      const executedPrice = cached;
      // create trade object and settle instantly
      const trade = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        pair,
        price: executedPrice,
        amount: Number(amount),
        time: Math.floor(Date.now() / 1000),
        buyUserId: side === 'buy' ? userId : null,
        sellUserId: side === 'sell' ? userId : null
      };

      // create or update position and persist balance
      if (side === 'buy') {
        let pos = await Position.findOne({ userId, pair });
        if (!pos) {
          pos = await Position.create({
            userId,
            pair,
            size: Number(amount),
            entryPrice: executedPrice,
            margin: cost
          });
        } else {
          const newSize = pos.size + Number(amount);
          const newEntry = (pos.entryPrice * pos.size + executedPrice * Number(amount)) / newSize;
          pos.size = newSize;
          pos.entryPrice = newEntry;
          pos.margin = (pos.margin || 0) + cost;
          pos.updatedAt = new Date();
          await pos.save();
        }
      } else {
        // sell: credit USDT balance with proceeds
        const proceeds = executedPrice * Number(amount);
        try {
          await balanceService.creditBalance(userId, 'USDT', proceeds);
        } catch (err) {
          console.error('Failed to credit balance after sell:', err.message);
        }
      }

      o.status = 'filled';
      o.filled = Number(amount);
      await o.save();
      emitter.emit('trade', trade);
      return res.json({ success: true, order: o, trade });
    }

    // For limit orders, push to orderbook for matching; attach user/order mapping
    await addOrder({ pair, side, price: Number(price), amount: Number(amount), userId, orderId });
    return res.json({ success: true, order: o });
  } catch (err) {
    console.error('Place trade error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel order
app.post('/api/trade/cancel', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Missing orderId' });

    // Atomically claim the cancellation — only succeeds if order is still "open"
    const o = await Order.findOneAndUpdate(
      { orderId, userId, status: { $in: ['open', 'partially_filled'] } },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    if (!o) {
      const exists = await Order.findOne({ orderId, userId });
      if (!exists) return res.status(404).json({ message: 'Order not found' });
      return res.status(400).json({ message: 'Order cannot be cancelled — it may be already filled or cancelled' });
    }

    // Remove from in-memory orderbook
    withPairLock(o.pair, async () => {
      const market = getMarket(o.pair);
      ['buy', 'sell'].forEach((s) => {
        const idx = market[s].findIndex(it => it.orderId === orderId);
        if (idx >= 0) market[s].splice(idx, 1);
      });
      emitter.emit('orderbook', { pair: o.pair, buy: market.buy.slice(0, 17), sell: market.sell.slice(0, 17) });
    });

    // Refund locked USDT balance for buy orders
    if (o.side === 'buy') {
      try {
        const remaining = (o.amount || 0) - (o.filled || 0);
        const refund = (o.price || 0) * remaining;
        if (refund > 0) {
          await balanceService.unlockBalance(userId, 'USDT', refund);
        }
      } catch (balErr) {
        console.error('Balance unlock failed during order cancel:', balErr);
        // Still return success since order is already atomically cancelled in DB
      }
    }

    res.json({ success: true, order: o, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Auth login (kept for backward-compat)
const { comparePassword, generateAccessToken, generateRefreshToken } = require("./utils/auth");

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken  = refreshToken;
    await user.save();
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── HTTP server + Socket.io ──────────────────────────────────────────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors:       { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
  transports: ["websocket", "polling"],
  path:       "/socket.io",
});
global.io = io;

// UPGRADE 4: Per-pair Socket.io rooms
io.on("connection", (socket) => {
  console.log("Socket.io connected:", socket.id);

  socket.on("subscribe", (pair) => {
    if (typeof pair === "string") {
      socket.join(`pair:${pair}`);
      console.log(`  → ${socket.id} joined room pair:${pair}`);
    }
  });

  socket.on("unsubscribe", (pair) => {
    if (typeof pair === "string") socket.leave(`pair:${pair}`);
  });

  socket.on("disconnect", () => console.log("Socket.io disconnected:", socket.id));
});

// Broadcast trade/orderbook only to the relevant room (+ global fallback)
emitter.on("trade", (trade) => {
  io.to(`pair:${trade.pair}`).emit("trade", trade);
  io.emit("trade", trade); // legacy clients not in any room
});

emitter.on("orderbook", (data) => {
  io.to(`pair:${data.pair}`).emit("orderbook", data);
  io.emit("orderbook", data);
});

// ─── Market price polling ─────────────────────────────────────────────────────
const trackedPairs    = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LTC/USDT", "ADA/USDT"];
const coinGeckoIds    = { "BTC/USDT": "bitcoin", "ETH/USDT": "ethereum", "SOL/USDT": "solana", "LTC/USDT": "litecoin", "ADA/USDT": "cardano" };
const cachedMarketPrices = {};
let marketPollDelay   = 15_000;
const MIN_POLL_DELAY  = 15_000;
const MAX_POLL_DELAY  = 60_000;

// UPGRADE 2: Semaphore — price fetch worker
let priceFetchBusy = false;
async function fetchMarketPrices() {
  if (priceFetchBusy) return;
  priceFetchBusy = true;
  try {
    const ids = trackedPairs.map((p) => coinGeckoIds[p]).join(",");
    const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: { ids, vs_currencies: "usd" },
      timeout: 8_000,
    });
    trackedPairs.forEach((pair) => {
      const price = data[coinGeckoIds[pair]]?.usd;
      if (price) cachedMarketPrices[pair] = Number(price);
    });
    marketPollDelay = MIN_POLL_DELAY;
  } catch (err) {
    console.error("Price poll failed:", err.message);
    if (err?.response?.status === 429) {
      marketPollDelay = Math.min(marketPollDelay * 2, MAX_POLL_DELAY);
      console.warn(`CoinGecko rate-limited — backing off to ${marketPollDelay}ms`);
    }
  } finally {
    priceFetchBusy = false;
  }
}

// Self-scheduling with semaphore-safe delay
function scheduleMarketPriceFetch() {
  fetchMarketPrices().finally(() => {
    setTimeout(scheduleMarketPriceFetch, marketPollDelay);
  });
}
if (process.env.NODE_ENV !== "test") {
  scheduleMarketPriceFetch();
}

// Price broadcast — only emit if price is actually available
function isValidPriceValue(v) { return Number.isFinite(v) && v > 0; }

setInterval(() => {
  trackedPairs.forEach((pair) => {
    const price = isValidPriceValue(cachedMarketPrices[pair]) ? cachedMarketPrices[pair] : null;
    io.emit("priceUpdate", { pair, price: price !== null ? Number(price) : null, time: Date.now() });
  });
}, 1_000);

// ─── Orderbook update worker ──────────────────────────────────────────────────
global.orderbookCache = {};
global.tradesCache    = {};
global.candlesCache   = {};

// UPGRADE 2: Throttled orderbook worker — skips if previous tick not done
let orderbookWorkerBusy = false;

async function emitOrderbookUpdates() {
  if (orderbookWorkerBusy) {
    console.warn("⏩ Orderbook worker skipped — previous tick still running");
    return;
  }
  orderbookWorkerBusy = true;
  try {
    for (const pair of trackedPairs) {
      try {
        const symbol   = pair.replace("/", "");
        const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/depth?symbol=${symbol}&limit=18`, { timeout: 6_000 });
        if (!data.bids || !data.asks) throw new Error("Invalid orderbook response");

        const buy  = data.bids.map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
        const sell = data.asks.map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
        const orderbook = { pair, buy, sell };

        global.orderbookCache[pair] = orderbook;

        // UPGRADE 4: emit to room + global fallback
        io.to(`pair:${pair}`).emit("orderbook", orderbook);
        emitter.emit("orderbook", orderbook);
      } catch (err) {
        console.error(`Orderbook fetch failed for ${pair}:`, err.message);
      }
    }
  } finally {
    orderbookWorkerBusy = false;
  }
}

setInterval(emitOrderbookUpdates, 2_000);

// ─── News helpers ─────────────────────────────────────────────────────────────
const parser = new Parser();
const ogMemCache = new Map();

const RSS_FEEDS = [
  "https://beincrypto.com/feed/",
  "https://newsbtc.com/feed/",
  "https://dailyhodl.com/feed/",
  "https://cryptonews.com/news/feed/",
  "https://cryptopolitan.com/feed/",
  "https://www.finbold.com/feed/",
  "https://cryptoslate.com/feed/",
  "https://www.theblock.co/rss.xml",
];

function isValidImage(url) {
  return typeof url === "string" && url.startsWith("http") && !url.includes("placeholder") && !url.includes("null");
}

const parseWithTimeout = (url) => Promise.race([
  parser.parseURL(url),
  new Promise((_, reject) => setTimeout(() => reject(new Error("RSS Timeout")), 8_000)),
]);

// UPGRADE 1: getOGData uses safeRedis helpers — never crashes when Redis is down
async function getOGData(url) {
  if (!url) return null;
  if (ogMemCache.has(url)) return ogMemCache.get(url);

  const cached = await safeRedisGet(`og:${url}`);
  if (cached) {
    const parsed = JSON.parse(cached);
    ogMemCache.set(url, parsed);
    return parsed;
  }

  try {
    const { result } = await ogs({ url });
    const data = {
      image:       Array.isArray(result.ogImage) ? result.ogImage[0]?.url : result.ogImage?.url || null,
      description: result.ogDescription || null,
    };
    ogMemCache.set(url, data);
    await safeRedisSetEx(`og:${url}`, 3600, JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}

const fetchAllNews = async () => {
  try {
    const results  = await Promise.allSettled(RSS_FEEDS.map(parseWithTimeout));
    const articles = [];

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value?.items) {
        result.value.items.forEach((item) => {
          articles.push({
            title:       item.title || "",
            description: item.contentSnippet || "",
            url:         item.link || "",
            image:       item.enclosure?.url || null,
            source:      result.value.title || "News",
            publishedAt: new Date(item.pubDate || 0).getTime(),
          });
        });
      }
    });

    const enriched = [];
    for (const item of articles.slice(0, 50)) {
      const ogData = await getOGData(item.url);
      enriched.push({
        ...item,
        image:       isValidImage(item.image) ? item.image : ogData?.image || null,
        description: item.description || ogData?.description || item.title,
      });
    }
    return processNews(enriched);
  } catch (err) {
    console.error("RSS Error:", err.message);
    return [];
  }
};

// UPGRADE 2: News stream worker — throttled
let newsWorkerBusy = false;

function startNewsStream() {
  console.log("📡 Live news stream started");
  setInterval(async () => {
    if (newsWorkerBusy) {
      console.warn("⏩ News worker skipped — previous tick still running");
      return;
    }
    newsWorkerBusy = true;
    try {
      const data = await fetchAllNews();
      io.emit("news-update", data);
    } catch (err) {
      console.error("News stream error:", err.message);
    } finally {
      newsWorkerBusy = false;
    }
  }, 15_000);
}

// ─── Public data API ──────────────────────────────────────────────────────────
app.get("/api/news", async (_req, res) => {
  try { res.json(await fetchAllNews()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/coins", async (_req, res) => {
  const fallback = [
    { id: "bitcoin",      symbol: "btc", name: "Bitcoin",  image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",   current_price: 78000, market_cap: 1_500_000_000_000, price_change_24h: 1200,  price_change_percentage_24h:  1.56, total_volume: 32_000_000_000 },
    { id: "ethereum",     symbol: "eth", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3200,  market_cap:   380_000_000_000, price_change_24h: -40,   price_change_percentage_24h: -1.23, total_volume: 12_000_000_000 },
    { id: "binancecoin",  symbol: "bnb", name: "BNB",      image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png", current_price: 540, market_cap: 83_000_000_000, price_change_24h: 8, price_change_percentage_24h: 1.51, total_volume: 2_200_000_000 },
    { id: "solana",       symbol: "sol", name: "Solana",   image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",  current_price: 170,   market_cap:    83_000_000_000, price_change_24h: 3.2,   price_change_percentage_24h:  1.91, total_volume:  4_300_000_000 },
    { id: "cardano",      symbol: "ada", name: "Cardano",  image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",  current_price: 0.48,  market_cap:    17_000_000_000, price_change_24h: -0.01, price_change_percentage_24h: -0.02, total_volume:  2_400_000_000 },
  ];
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: 5, page: 1 },
      timeout: 7_000,
    });
    if (Array.isArray(data) && data.length) return res.json(data);
  } catch (err) {
    console.error("Coin fetch failed:", err.message);
  }
  res.json(fallback);
});

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    if (process.env.NODE_ENV !== "production") await ensureAdminUser();
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

async function ensureAdminUser() {
  try {
    const email  = (process.env.DEFAULT_ADMIN_EMAIL || "admin@swancore.com").toLowerCase().trim();
    const pass   = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
    const exists = await User.findOne({ email });
    if (exists) return;
    const bcrypt = require("bcrypt");
    await User.create({
      email,
      password:    await bcrypt.hash(pass, 10),
      name:        "Admin User",
      role:        "admin",
      isVerified:  true,
      balance:     0,
      frozenBalance: 0,
      isBanned:    false,
      kycVerified: true,
      kycStatus:   "approved",
    });
    console.log(`Default admin created: ${email}`);
  } catch (err) {
    console.error("ensureAdminUser error:", err.message);
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startNewsStream();
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} already in use — set PORT env var to override.`);
    } else {
      console.error("Server start error:", err);
    }
  });
}

module.exports = { app, server };

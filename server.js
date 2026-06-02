/**
 * server.js  ???  SwanCore Trading Engine  (CRASH-PROOF edition)
 *
 * UPGRADES vs original:
 *  1. Redis-safe reconnect layer  ??? exponential back-off, isReady guard on every call,
 *     safeRedisGet / safeRedisSet helpers that never throw.
 *  2. Worker throttling system    ??? binary semaphores on every setInterval worker so
 *     a slow upstream (Binance / CoinGecko) cannot stack concurrent loops.
 *  3. Zero race-condition matching ??? in-memory order-book operations are now serialised
 *     through a per-pair async mutex; no two match cycles can interleave on the same pair.
 *  4. Production-grade event flow ??? Socket.io rooms (one per pair), deduplication of
 *     duplicate route registrations, global uncaughtException + unhandledRejection fence.
 */

"use strict";

// ????????? Global crash fence (must be first) ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
process.on("uncaughtException", (err) => {
  console.error("???? uncaughtException ??? process will NOT exit:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("???? unhandledRejection ??? process will NOT exit:", reason);
});

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const axios = require("axios");
const crypto = require("crypto");
const ogs = require("open-graph-scraper");
const redis = require("redis");
const helmet = require("helmet");
const Parser = require("rss-parser");
require("dotenv").config();
const { Server } = require("socket.io");
const EventEmitter = require("events");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not defined in the environment. Falling back to an insecure default secret.");
}
const marketSimulator = require("./src/services/marketSimulator");
const { clampPnL, calculatePositionPnL, shouldClampPnL } = require("./utils/pnlClamp");
const BinanceWebSocketManager = require("./src/services/binanceWebSocket");

const { processNews } = require("./utils/newsEngine");
const { authMiddleware } = require("./src/middleware/authMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const walletRoutes = require('./routes/walletRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Models (single import for User to avoid duplicate declarations)
const User = require('./models/User');

// ????????? Middleware ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
const allowedOrigins = [
  "http://localhost:3000",
  "https://hitachi-intense-exciting-steve.trycloudflare.com",
];

app.use((req, _res, next) => {
  if (!req.url.includes("/health") && !req.url.includes("/orderbook")) {
    console.log(`???? ${req.method} ${req.url}`);
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

// ????????? UPGRADE 1: Redis-safe reconnect layer ????????????????????????????????????????????????????????????????????????????????????????????????????????????
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    // Exponential back-off: 100ms ??? 200ms ??? 400ms ??? capped at 5 s, abort after 20 retries
    reconnectStrategy: (retries) => {
      if (retries >= 20) {
        console.error("???? Redis: max reconnect retries exceeded ??? giving up");
        return new Error("Redis max retries");
      }
      const delay = Math.min(100 * 2 ** retries, 5_000);
      console.warn(`???? Redis: reconnecting in ${delay}ms (attempt ${retries + 1})`);
      return delay;
    },
    connectTimeout: 10_000,
  },
});

redisClient.on("connect", () => console.log("??? Redis connecting???"));
redisClient.on("ready",   () => console.log("??? Redis ready"));
redisClient.on("error",   (err) => console.error("???? Redis error:", err.message));
redisClient.on("reconnecting", () => console.warn("???? Redis reconnecting???"));

// Non-throwing helpers ??? callers never need to guard for Redis being offline
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

// ????????? Trading internals ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
const emitter = new EventEmitter();
const BINANCE_API_BASE = "https://api.binance.com";
const BINANCE_QUOTE_ASSETS = ["USDT", "USD", "BTC", "ETH", "BNB"];

// ????????? UPGRADE 3: Per-pair async mutex for zero-race matching ??????????????????????????????????????????????????????
// A Map of pair ??? Promise chain. Every mutating operation queues itself on the
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

const CANDLE_TIMEFRAMES = ["1m", "5m", "15m", "1h"];
const CANDLE_INTERVAL_SECONDS = { "1m": 60, "5m": 300, "15m": 900, "1h": 3600 };

function getCandleBucketStart(timestampMs, timeframe = "1m") {
  const interval = CANDLE_INTERVAL_SECONDS[timeframe] || 60;
  return Math.floor(timestampMs / 1000 / interval) * interval;
}

async function getPersistedCandles(pair, timeframe = "1m") {
  if (!redisClient.isReady) return [];
  const key = `candles:${pair}:${timeframe}`;
  try {
    const raw = await redisClient.lRange(key, 0, 999);
    return raw
      .map((item) => {
        try { return JSON.parse(item); } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => a.time - b.time);
  } catch (err) {
    console.error(`Redis load persisted candles failed: ${pair}@${timeframe}`, err.message);
    return [];
  }
}

async function mergeLiveCurrentBucket(pair, timeframe, candles) {
  if (!Array.isArray(candles) || !candles.length) return candles;
  const persisted = await getPersistedCandles(pair, timeframe);
  if (!persisted.length) return candles;

  const latestPersisted = persisted[persisted.length - 1];
  const existingIndex = candles.findIndex((c) => c.time === latestPersisted.time);

  if (existingIndex >= 0) {
    candles[existingIndex] = latestPersisted;
    return candles;
  }

  const lastCandle = candles[candles.length - 1];
  if (latestPersisted.time > lastCandle.time) {
    return [...candles, latestPersisted];
  }

  return candles;
}

async function upsertLiveCandle(pair, price, timestampMs = Date.now(), timeframe = "1m") {
  if (!redisClient.isReady) return null;
  const key = `candles:${pair}:${timeframe}`;
  const bucketTime = getCandleBucketStart(timestampMs, timeframe);
  try {
    const currentRaw = await redisClient.lIndex(key, 0);
    let candle = currentRaw ? JSON.parse(currentRaw) : null;

    if (!candle || candle.time !== bucketTime) {
      candle = {
        time: bucketTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
      };
      await redisClient.lPush(key, JSON.stringify(candle));
      await redisClient.lTrim(key, 0, 999);
      return candle;
    }

    const updated = {
      ...candle,
      high: Math.max(candle.high, price),
      low: Math.min(candle.low, price),
      close: price,
    };

    if (updated.high !== candle.high || updated.low !== candle.low || updated.close !== candle.close) {
      await redisClient.lSet(key, 0, JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.error(`Redis update live candle failed: ${pair}@${timeframe}`, err.message);
    return null;
  }
}

function deterministicValue(seed, index) {
  const hash = crypto.createHash("sha256").update(`${seed}:${index}`).digest("hex").slice(0, 8);
  return parseInt(hash, 16) / 0xffffffff;
}

function sortBook(book) {
  book.buy.sort((a, b) => b.price - a.price);
  book.sell.sort((a, b) => a.price - b.price);
}

// UPGRADE 3: matchOrders is called inside withPairLock ??? fully serialised
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
        const cost = trade.price * trade.amount;
        // balance settlement removed

        let pos = await Position.findOne({ userId: trade.buyUserId, pair });
        if (!pos) {
          pos = await Position.create({ userId: trade.buyUserId, pair, size: trade.amount, entryPrice: trade.price, margin: cost });
        } else {
          const newSize = pos.size + trade.amount;
          const newEntry = ((pos.entryPrice * pos.size) + (trade.price * trade.amount)) / newSize;
          pos.size = newSize;
          pos.entryPrice = newEntry;
          pos.margin = (pos.margin || 0) + cost;
          pos.updatedAt = new Date();
          await pos.save();
        }
        startPositionSimulation(trade.buyUserId, pos);
      }

      // settle seller: credit proceeds
      if (trade.sellUserId) {
        const proceeds = trade.price * trade.amount;
        // balance settlement removed
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

// ????????? Market data routes ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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

  if (candles) {
    const merged = await mergeLiveCurrentBucket(pair, timeframe, candles);
    return res.json(merged);
  }

  const persisted = await getPersistedCandles(pair, timeframe);
  if (persisted.length) return res.json(persisted);

  const trades = getTrades(pair);
  const intervalMap = { "1m": 60, "5m": 300, "15m": 900, "1h": 3600 };
  const interval    = intervalMap[timeframe] || 60;

  if (!trades.length) {
    const now = Math.floor(Date.now() / 1000);
    const seed = `${pair}:${timeframe}:${Math.floor(now / interval)}`;
    let price = 30_000;
    return res.json(Array.from({ length: 80 }, (_, i) => {
      price += (deterministicValue(seed, i * 4) - 0.5) * 200;
      const open  = price;
      const close = price + (deterministicValue(seed, i * 4 + 1) - 0.5) * 100;
      const high  = Math.max(open, close) + deterministicValue(seed, i * 4 + 2) * 50;
      const low   = Math.min(open, close) - deterministicValue(seed, i * 4 + 3) * 50;
      return {
        time:   Math.floor((now - (79 - i) * interval) / interval) * interval,
        open:   +open.toFixed(2),
        high:   +high.toFixed(2),
        low:    +low.toFixed(2),
        close:  +close.toFixed(2),
        volume: +(deterministicValue(seed, i * 4 + 4) * 10 + 1).toFixed(2),
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

// ????????? Application routes ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
app.use("/api/auth",          authRoutes);
app.use("/api/posts",         postRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/orders', orderRoutes);

app.get("/test",    (_req, res) => res.json({ message: "Server is working" }));
app.get("/health",  (_req, res) => res.send("OK"));
app.get("/api/status/price-feed", (_req, res) => {
  const binanceStatus = binanceWS.getStatus();
  const cachedPrices = { ...cachedMarketPrices };
  res.json({
    binanceWebSocket: binanceStatus,
    cachedPrices,
    trackedPairs: trackedPairs.length,
  });
});

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





app.get('/api/account/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const availableBalance = user.balance || 0;
    const lockedBalance = 0;

    const positions = await Position.find({ userId });
    // compute unrealized using user-specific simulated price when available and clamp PnL to allowed range
    let totalUnreal = 0;
    positions.forEach((p) => {
      const mark = getPositionMarkPrice(userId, p);
      if (!isValidPriceValue(mark) || !Number.isFinite(p.entryPrice) || p.entryPrice <= 0) return;
      const pnlView = buildPositionPnL(p, mark);
      totalUnreal += pnlView.unrealizedPnl;
    });

    const openOrders = await Order.find({ userId, status: { $in: ['open','partially_filled'] } });

    const cashBalance = availableBalance + lockedBalance;

    const summary = {
      available: availableBalance,
      locked: lockedBalance,
      totalBalance: cashBalance,
      unrealizedPnl: totalUnreal,
      usedMargin: positions.reduce((s, p) => s + (p.margin || 0), 0),
      freeMargin: availableBalance,
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
    const enriched = positions.map((p) => {
      const markPrice = getPositionMarkPrice(userId, p);
      const pnlView = buildPositionPnL(p, isValidPriceValue(markPrice) ? markPrice : p.entryPrice);
      return {
        ...p.toObject(),
        markPrice: isValidPriceValue(markPrice) ? markPrice : p.entryPrice,
        unrealizedPnl: pnlView.unrealizedPnl,
        unrealizedPnlPercent: pnlView.unrealizedPnlPercent,
        rawUnrealizedPnl: pnlView.rawUnrealizedPnl,
        rawUnrealizedPnlPercent: pnlView.rawUnrealizedPnlPercent,
      };
    });
    res.json(enriched);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
});

app.post('/api/trade/close-position', authMiddleware, async (req, res) => {
  res.redirect(307, '/api/orders/close');
});

app.get('/api/account/open-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const orders = await Order.find({ userId, status: { $in: ['open','partially_filled'] } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
});

app.get('/api/account/balances', authMiddleware, async (req, res) => {
  res.redirect(307, '/api/wallet');
});

app.post('/api/account/recalculate-balances', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(501).json({ message: 'Balance recalculation endpoint removed' });
  } catch (err) {
    console.error('Balance recalculation error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ????????? DEV ENDPOINT: Reset database to clean state ?????????????????????????????????????????????????????????????????????????????????
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


app.get('/api/trade/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId, status: 'closed' }).sort({ closedAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/trade/place', authMiddleware, async (req, res) => {
  res.redirect(307, '/api/orders/open');
});

app.post('/api/trade/cancel', authMiddleware, async (req, res) => {
  res.redirect(307, '/api/orders/close');
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

// ????????? HTTP server + Socket.io ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
const server = http.createServer(app);

const io = new Server(server, {
  cors:       { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
  transports: ["websocket", "polling"],
  path:       "/socket.io",
});
global.io = io;

marketSimulator.initMarketSimulator({
  io,
  getRealPrice: (pair) => cachedMarketPrices[pair],
  onSimulated: async (state) => {
    try {
      const userId    = state.userId;
      const pair      = state.pair;
      const positions = await Position.find({ userId });
      const balances  = { USDT: { total: 0, available: 0, locked: 0 }, BTC: { total: 0, available: 0, locked: 0 } };

      let totalUnreal = 0;
      let totalUnrealRaw = 0;
      const positionsWithMarks = [];

      for (const p of positions) {
        const pid = p._id?.toString();
        const markPrice = getPositionMarkPrice(userId, p) || 0;
        const skipClamp = state.mode === 'drift';
        const pnlView = buildPositionPnL(p, markPrice, { skipClamp });

        if (shouldClampPnL(p)) {
          await Position.updateOne(
            { _id: p._id },
            {
              $set: {
                unrealizedPnL: pnlView.unrealizedPnl,
                rawUnrealizedPnL: pnlView.rawUnrealizedPnl,
                roePct: pnlView.unrealizedPnlPercent,
                rawRoePct: pnlView.rawUnrealizedPnlPercent,
                updatedAt: new Date(),
              },
            }
          ).catch(() => {});
        }

        totalUnreal += pnlView.unrealizedPnl;
        totalUnrealRaw += pnlView.rawUnrealizedPnl;
        positionsWithMarks.push({
          positionId: pid,
          pair: p.pair,
          entryPrice: p.entryPrice,
          size: p.size,
          side: pnlView.side,
          leverage: pnlView.leverage,
          markPrice,
          unrealizedPnl: pnlView.unrealizedPnl,
          unrealizedPnlPercent: pnlView.unrealizedPnlPercent,
          rawUnrealizedPnl: pnlView.rawUnrealizedPnl,
          rawUnrealizedPnlPercent: pnlView.rawUnrealizedPnlPercent,
        });
      }

      const balance = (await User.findById(userId))?.balance || 0;
      const equity  = balance + totalUnreal;

      io.to(`user:${userId}`).emit('market_update', {
        userId,
        pair,
        positionId: state.positionId,
        currentPrice: state.lastPrice,
        positions: positionsWithMarks,
        unrealizedPnl: totalUnreal,
        rawUnrealizedPnl: totalUnrealRaw,
        balance,
        equity,
        driftState: state.activeDrift ? { active: true, ...state.activeDrift } : { active: false },
        mode: state.mode,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('onSimulated handler error:', err?.message ?? err);
    }
  },
});

// UPGRADE 4: Per-pair Socket.io rooms
io.on("connection", (socket) => {
  console.log("Socket.io connected:", socket.id);

  const joinUserRoom = (tokenValue) => {
    if (typeof tokenValue !== 'string') return;
    try {
      const decoded = jwt.verify(tokenValue, JWT_SECRET);
      const socketUserId = decoded.userId || decoded.id;
      socket.role = decoded.role || null;
      if (socketUserId) {
        socket.userId = socketUserId;
        socket.join(`user:${socketUserId}`);
        console.log(`  → ${socket.id} joined private room user:${socketUserId}`);
        const simStates = marketSimulator.getSimulationStatesForUser(socketUserId);
        if (simStates.length) {
          socket.emit('simulationStateSync', { userId: socketUserId, states: simStates });
        }
      }
    } catch (err) {
      console.warn(`Socket auth failed for ${socket.id}:`, err.message);
    }
  };

  const initialToken = socket.handshake.auth?.token;
  if (typeof initialToken === 'string') joinUserRoom(initialToken);

  socket.on('authenticate', (payload) => joinUserRoom(typeof payload === 'string' ? payload : payload?.token));

  socket.on("subscribe", (pair) => {
    if (typeof pair === "string") {
      socket.join(`pair:${pair}`);
      console.log(`  ??? ${socket.id} joined room pair:${pair}`);
    }
  });

  socket.on("unsubscribe", (pair) => {
    if (typeof pair === "string") socket.leave(`pair:${pair}`);
  });

  socket.on('subscribeUser', (userId) => {
    if (typeof userId !== 'string' || socket.role !== 'admin') return;
    socket.join(`user:${userId}`);
  });

  socket.on('unsubscribeUser', (userId) => {
    if (typeof userId !== 'string' || socket.role !== 'admin') return;
    socket.leave(`user:${userId}`);
  });

  socket.on("disconnect", (reason) => console.log("Socket.io disconnected:", socket.id, "reason:", reason));
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

// ????????? Market price feed ????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// UPGRADED: Binance WebSocket (primary) + CoinGecko fallback (secondary)
const trackedPairs        = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LTC/USDT", "ADA/USDT"];
const binancePairs        = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "LTCUSDT", "ADAUSDT"];
const coinGeckoIds        = { "BTC/USDT": "bitcoin", "ETH/USDT": "ethereum", "SOL/USDT": "solana", "LTC/USDT": "litecoin", "ADA/USDT": "cardano" };
const cachedMarketPrices  = {};
let marketPollDelay       = 15_000;
const MIN_POLL_DELAY      = 15_000;
const MAX_POLL_DELAY      = 60_000;

// Initialize Binance WebSocket with auto-reconnect
const binanceWS = new BinanceWebSocketManager(binancePairs);

// Map Binance symbols back to trading pairs
function getBinanceSymbolForPair(pair) {
  return pair.replace("/", "");
}

function getPairFromBinanceSymbol(symbol) {
  const idx = binancePairs.indexOf(symbol);
  return idx >= 0 ? trackedPairs[idx] : null;
}

// Listen to Binance WebSocket price updates
binanceWS.on('price', (data) => {
  const pair = getPairFromBinanceSymbol(data.pair);
  if (pair) {
    cachedMarketPrices[pair] = data.price;
    const timestampMs = Date.now();
    Promise.allSettled(
      CANDLE_TIMEFRAMES.map((timeframe) => upsertLiveCandle(pair, data.price, timestampMs, timeframe))
    ).catch((err) => {
      console.error('Live candle persistence failed:', err?.message || err);
    });
    // console.debug(`📈 Binance price: ${pair} = $${data.price.toFixed(2)}`);
  }
});

// Monitor heartbeat timeouts and log them
binanceWS.on('heartbeat-timeout', () => {
  console.warn('⚠ Binance WebSocket heartbeat timeout detected, auto-reconnecting...');
});

// Start Binance WebSocket
if (process.env.NODE_ENV !== "test") {
  console.log('🚀 Starting Binance WebSocket price feed...');
  binanceWS.connect();
}

// UPGRADE 2: Semaphore ??? CoinGecko fallback price fetch worker
let priceFetchBusy = false;
async function fetchMarketPricesFallback() {
  if (priceFetchBusy) return;
  priceFetchBusy = true;
  try {
    const ids = trackedPairs.map((p) => coinGeckoIds[p]).join(",");
    const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: { ids, vs_currencies: "usd" },
      timeout: 8_000,
    });
    
    // Only use CoinGecko if Binance WS doesn't have the prices
    trackedPairs.forEach((pair) => {
      if (!cachedMarketPrices[pair]) {
        const price = data[coinGeckoIds[pair]]?.usd;
        if (price) cachedMarketPrices[pair] = Number(price);
      }
    });
    marketPollDelay = MIN_POLL_DELAY;
  } catch (err) {
    console.warn("CoinGecko fallback poll failed:", err.message);
    if (err?.response?.status === 429) {
      marketPollDelay = Math.min(marketPollDelay * 2, MAX_POLL_DELAY);
      console.warn(`  ??? CoinGecko rate-limited, backing off to ${marketPollDelay}ms`);
    }
  } finally {
    priceFetchBusy = false;
  }
}

// Self-scheduling CoinGecko fallback with semaphore-safe delay (every 30s as secondary)
function scheduleMarketPriceFallback() {
  fetchMarketPricesFallback().finally(() => {
    setTimeout(scheduleMarketPriceFallback, 30_000); // 30s fallback check
  });
}
if (process.env.NODE_ENV !== "test") {
  scheduleMarketPriceFallback();
}

// Price broadcast ??? only emit if price is actually available
function isValidPriceValue(v) { return Number.isFinite(v) && v > 0; }

function buildPositionPnL(position, markPrice, options = {}) {
  const side = position.side || (Number(position.size) < 0 ? 'short' : 'long');
  const size = Math.abs(Number(position.size || 0));
  const leverage = Number(position.leverage || 1) || 1;
  const pnl = calculatePositionPnL(position.entryPrice, markPrice, size, side, leverage);
  const useClamp = shouldClampPnL(position) && !options.skipClamp;

  return {
    side,
    size,
    leverage,
    markPrice,
    rawUnrealizedPnl: pnl.rawPnl,
    rawUnrealizedPnlPercent: pnl.rawPnlPercent,
    unrealizedPnl: useClamp ? pnl.clampedPnl : pnl.rawPnl,
    unrealizedPnlPercent: useClamp ? pnl.clampedPnlPercent : pnl.rawPnlPercent,
  };
}

function startPositionSimulation(userId, position, orderMeta = {}) {
  if (!position?._id || !userId || !position.pair) return;
  if (orderMeta.isDemo === true || position.isDemo === true) return;
  if (orderMeta.isGenuine === false || position.isGenuine === false) return;
  try {
    marketSimulator.startNaturalSimulation({
      userId,
      pair: position.pair,
      positionId: position._id.toString(),
      entryPrice: position.entryPrice,
      positionSide: position.side || 'long',
      isDemo: false,
    });
  } catch (err) {
    console.error('startPositionSimulation error:', err.message);
  }
}

function getPositionMarkPrice(userId, position) {
  if (!position || !position.pair) return null;
  try {
    const simulated = marketSimulator.getSimulationPrice?.(userId, position.pair, position._id?.toString());
    if (isValidPriceValue(simulated)) return simulated;
  } catch (err) {
    console.error('getPositionMarkPrice simulated lookup failed:', err?.message || err);
  }
  const fallback = cachedMarketPrices[position.pair];
  return isValidPriceValue(fallback) ? fallback : position.entryPrice;
}

setInterval(() => {
  trackedPairs.forEach((pair) => {
    const price = isValidPriceValue(cachedMarketPrices[pair]) ? cachedMarketPrices[pair] : null;
    io.emit("priceUpdate", { pair, price: price !== null ? Number(price) : null, time: Date.now() });
  });
}, 1_000);

// ????????? Orderbook update worker ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
global.orderbookCache = {};
global.tradesCache    = {};
global.candlesCache   = {};

// UPGRADE 2: Throttled orderbook worker ??? skips if previous tick not done
let orderbookWorkerBusy = false;

async function emitOrderbookUpdates() {
  if (orderbookWorkerBusy) {
    console.warn("??? Orderbook worker skipped ??? previous tick still running");
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

// ????????? News helpers ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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

// UPGRADE 1: getOGData uses safeRedis helpers ??? never crashes when Redis is down
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

// UPGRADE 2: News stream worker ??? throttled
let newsWorkerBusy = false;

function startNewsStream() {
  console.log("???? Live news stream started");
  setInterval(async () => {
    if (newsWorkerBusy) {
      console.warn("??? News worker skipped ??? previous tick still running");
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

// ????????? Public data API ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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

// ????????? MongoDB ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("??? MongoDB connected");
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

// ????????? Start ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const serverInstance = server.listen(PORT, "0.0.0.0", () => {
    console.log(`???? Server running on port ${PORT}`);
    startNewsStream();
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} already in use ??? set PORT env var to override.`);
    } else {
      console.error("Server start error:", err);
    }
  });

  // Graceful shutdown: close Binance WebSocket and Redis on signal
  const gracefulShutdown = () => {
    console.log('\n🛑 Graceful shutdown initiated...');
    binanceWS.disconnect();
    if (redisClient.isOpen) {
      redisClient.quit().catch(err => console.error('Redis quit error:', err.message));
    }
    serverInstance.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
    // Force exit after 10 seconds if not already closed
    setTimeout(() => {
      console.error('??? Force exit after 10s');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

module.exports = { app, server };

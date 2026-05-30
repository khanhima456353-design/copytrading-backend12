/**
<<<<<<< HEAD
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
=======
 * server.js  —  SwanCore Trading Engine
 *
 * FIXES APPLIED (see CHANGELOG at bottom):
 *  FIX 1  – PnL formula respects position side (long vs short)
 *  FIX 2  – Close position returns original margin/collateral + PnL, not just PnL delta
 *  FIX 3  – Negative PnL (losses) now properly debits balance via atomic $inc
 *  FIX 4/5– Price source unified: Binance only for mark prices (replaces CoinGecko polling)
 *           CoinGecko kept only for /api/coins display card (market cap, images)
 *  FIX 6  – Financial operations use mongoose sessions for atomic multi-step safety
 *  FIX 9  – processAutoCloseOrders moved to its own 5s interval (not inside 1s broadcast)
 *  FIX 10 – Prisma dependency removed; Mongoose is the single ORM
 *  FIX 11 – Chart uses Binance candles before trade; simulator only affects position PnL display
 *  FIX 12 – Natural mode already caps +2% / -25% in marketSimulator; confirmed working
 */

'use strict';

// ─── Global crash fence ───────────────────────────────────────────────────────
process.on('uncaughtException',  (err)    => console.error('💥 uncaughtException — process will NOT exit:', err));
process.on('unhandledRejection', (reason) => console.error('💥 unhandledRejection — process will NOT exit:', reason));

const express    = require('express');
const app        = express();
const cors       = require('cors');
const http       = require('http');
const mongoose   = require('mongoose');
const axios      = require('axios');
const ogs        = require('open-graph-scraper');
const redis      = require('redis');
const helmet     = require('helmet');
const Parser     = require('rss-parser');
require('dotenv').config();
const jwt        = require('jsonwebtoken');
const { Server } = require('socket.io');
const EventEmitter = require('events');

const { processNews }      = require('./utils/newsEngine');
const { authMiddleware, adminMiddleware } = require('./src/middleware/authMiddleware');
const marketSimulator      = require('./src/services/marketSimulator');
const authRoutes           = require('./src/routes/authRoutes');
const postRoutes           = require('./routes/postRoutes');
const depositRoutes        = require('./src/routes/depositRoutes');
const transactionRoutes    = require('./src/routes/transactionRoutes');
const adminRoutes          = require('./src/routes/adminRoutes');
const notificationRoutes   = require('./src/routes/notificationRoutes');
const proTradingRoutes     = require('./src/routes/proTradingRoutes');

const User       = require('./models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// ─── Admin Price Override System ───────────────────────────────────────────────
// Structure: { [userId]: { [pair]: { active: boolean, price: number } } }
const adminPriceOverride = {};
global.adminPriceOverride = adminPriceOverride;

function getEffectivePrice(userId, pair, binancePrice) {
  if (userId && pair) {
    const simulated = marketSimulator.getSimulatedPriceForPair(userId, pair);
    if (Number.isFinite(simulated) && simulated > 0) {
      return simulated;
    }
  }

  const override = adminPriceOverride?.[userId]?.[pair];
  if (override?.active && Number.isFinite(override.price)) return override.price;
  return binancePrice;
}

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://hitachi-intense-exciting-steve.trycloudflare.com',
];

app.use((req, _res, next) => {
  if (!req.url.includes('/health') && !req.url.includes('/orderbook')) {
>>>>>>> main
    console.log(`📨 ${req.method} ${req.url}`);
  }
  next();
});

<<<<<<< HEAD
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

=======
app.use(cors({ origin: (_origin, cb) => cb(null, true), credentials: true }));
app.use(require('express').json({ limit: '20mb' }));
app.post('/api/admin/price-override', authMiddleware, adminMiddleware, (req, res) => {
  const { userId, pair, price } = req.body;
  console.log('[PRICE-OVERRIDE] SET:', { userId, pair, price });
  if (!userId || !pair || !Number.isFinite(Number(price))) return res.status(400).json({ error: 'Invalid params' });
  if (!adminPriceOverride[userId]) adminPriceOverride[userId] = {};
  adminPriceOverride[userId][pair] = { active: true, price: Number(price) };
  res.json({ success: true });
});

app.delete('/api/admin/price-override', authMiddleware, adminMiddleware, (req, res) => {
  const { userId, pair } = req.body;
  if (userId && pair && adminPriceOverride[userId]) {
    delete adminPriceOverride[userId][pair];
  } else if (userId && adminPriceOverride[userId]) {
    delete adminPriceOverride[userId];
  }
  res.json({ success: true });
});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({ windowMs: 60_000, max: 10 }));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://challenges.cloudflare.com'],
      frameSrc:   ['https://challenges.cloudflare.com'],
      connectSrc: ["'self'", 'https://challenges.cloudflare.com'],
    },
  },
}));

// ─── Redis safe layer ─────────────────────────────────────────────────────────
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries >= 20) return new Error('Redis max retries');
      return Math.min(100 * 2 ** retries, 5_000);
    },
    connectTimeout: 10_000,
  },
});

redisClient.on('connect',      () => console.log('⚡ Redis connecting…'));
redisClient.on('ready',        () => console.log('⚡ Redis ready'));
redisClient.on('error',        (err) => console.error('🔴 Redis error:', err.message));
redisClient.on('reconnecting', () => console.warn('🟡 Redis reconnecting…'));

const safeRedisGet   = async (key)          => { if (!redisClient.isReady) return null; try { return await redisClient.get(key); } catch { return null; } };
const safeRedisSetEx = async (key, ttl, v)  => { if (!redisClient.isReady) return;      try { await redisClient.setEx(key, ttl, v); } catch { /* best-effort */ } };

if (process.env.NODE_ENV !== 'test') {
  redisClient.connect().catch((err) => console.error('Redis initial connect failed:', err.message));
}

// ─── Trading internals ────────────────────────────────────────────────────────
const emitter           = new EventEmitter();
const BINANCE_API_BASE  = 'https://api.binance.com';
const BINANCE_QUOTE_ASSETS = ['USDT', 'USD', 'BTC', 'ETH', 'BNB'];

// Per-pair async mutex for zero-race matching
// THIS IS THE ONLY PLACE IT SHOULD EXIST (NEAR THE TOP)
const pairMutex = new Map();
function withPairLock(pair, fn) {
  const previous = pairMutex.get(pair) || Promise.resolve();
  
  const next = previous
    .then(fn)
    .catch((err) => {
      console.error(`🔴 [pairLock:${pair}] Connection drift/stuck queue cleared:`, err.message);
      pairMutex.delete(pair); 
    })
    .finally(() => {
      if (pairMutex.get(pair) === next) {
        pairMutex.delete(pair); 
      }
    });

  pairMutex.set(pair, next);
  return next;
}


const markets = {};
>>>>>>> main
function getMarket(pair) {
  if (!markets[pair]) markets[pair] = { buy: [], sell: [], trades: [] };
  return markets[pair];
}

<<<<<<< HEAD
function binanceSymbolForPair(pair) { return pair.replace("/", ""); }
=======
function binanceSymbolForPair(pair) { return pair.replace('/', ''); }
>>>>>>> main
function pairFromBinanceSymbol(symbol) {
  for (const q of BINANCE_QUOTE_ASSETS) {
    if (symbol.endsWith(q)) return `${symbol.slice(0, -q.length)}/${q}`;
  }
  return symbol;
}

async function fetchBinanceSymbols() {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/exchangeInfo`, { timeout: 8000 });
<<<<<<< HEAD
    if (!data?.symbols?.length) throw new Error("Invalid response");
    return data.symbols
      .filter((i) => i.status === "TRADING" && i.quoteAsset === "USDT")
      .map((i) => `${i.baseAsset}/${i.quoteAsset}`)
      .slice(0, 120);
  } catch (err) {
    console.error("Binance symbols fetch failed:", err.message);
    return ["BTC/USDT"];
=======
    if (!data?.symbols?.length) throw new Error('Invalid response');
    return data.symbols
      .filter((i) => i.status === 'TRADING' && i.quoteAsset === 'USDT')
      .map((i) => `${i.baseAsset}/${i.quoteAsset}`)
      .slice(0, 120);
  } catch (err) {
    console.error('Binance symbols fetch failed:', err.message);
    return ['BTC/USDT'];
>>>>>>> main
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
<<<<<<< HEAD
    console.error("Binance orderbook fetch failed:", pair, err.message);
=======
    console.error('Binance orderbook fetch failed:', pair, err.message);
>>>>>>> main
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
<<<<<<< HEAD
      side:   t.isBuyerMaker ? "sell" : "buy",
    }));
  } catch (err) {
    console.error("Binance trades fetch failed:", pair, err.message);
=======
      side:   t.isBuyerMaker ? 'sell' : 'buy',
    }));
  } catch (err) {
    console.error('Binance trades fetch failed:', pair, err.message);
>>>>>>> main
    return null;
  }
}

async function fetchBinanceCandles(pair, timeframe = '1m', limit = 80) {
  try {
<<<<<<< HEAD
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/klines`, {
      params: { symbol: binanceSymbolForPair(pair), interval: timeframe, limit },
=======
    const normalized = String(timeframe || '1m').trim();
    const intervalMap = {
      '1s': '1m',
      '1m': '1m',
      '3m': '3m',
      '5m': '5m',
      '15m': '15m',
      '30m': '30m',
      '1h': '1h',
      '2h': '2h',
      '4h': '4h',
      '6h': '6h',
      '8h': '8h',
      '12h': '12h',
      '1d': '1d',
      '1w': '1w',
      '1M': '1M',
      '1m': '1m',
    };
    const interval = intervalMap[normalized] || intervalMap[normalized.toLowerCase()] || '1m';
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/klines`, {
      params: { symbol: binanceSymbolForPair(pair), interval, limit },
>>>>>>> main
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
<<<<<<< HEAD
    console.error("Binance candles fetch failed:", pair, err.message);
=======
    console.error('Binance candles fetch failed:', pair, err.message);
>>>>>>> main
    return null;
  }
}

function sortBook(book) {
  book.buy.sort((a, b) => b.price - a.price);
  book.sell.sort((a, b) => a.price - b.price);
}

<<<<<<< HEAD
// UPGRADE 3: matchOrders is called inside withPairLock — fully serialised
=======
>>>>>>> main
async function matchOrders(pair) {
  const market = getMarket(pair);
  sortBook(market);

<<<<<<< HEAD
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
=======
  while (market.buy.length && market.sell.length && market.buy[0].price >= market.sell[0].price) {
    const buy    = market.buy[0];
    const sell   = market.sell[0];
    const amount = Math.min(buy.amount, sell.amount);

    const trade = {
      id:          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      pair,
      price:       sell.price,
      amount,
      time:        Math.floor(Date.now() / 1000),
      buyOrderId:  buy.orderId   || null,
      sellOrderId: sell.orderId  || null,
      buyUserId:   buy.userId    || null,
      sellUserId:  sell.userId   || null,
    };

    market.trades.unshift(trade);
    if (market.trades.length > 200) market.trades.length = 200;

    buy.amount  -= amount;
    sell.amount -= amount;
    if (buy.amount  <= 0) market.buy.shift();
    if (sell.amount <= 0) market.sell.shift();

    try {
      const Order    = require('./models/Order');
      const Position = require('./models/Position');

      if (trade.buyOrderId) {
        const o = await Order.findOne({ orderId: trade.buyOrderId });
        if (o) { o.filled = (o.filled || 0) + amount; o.status = o.filled >= o.amount ? 'filled' : 'partially_filled'; await o.save(); }
      }
      if (trade.sellOrderId) {
        const o2 = await Order.findOne({ orderId: trade.sellOrderId });
        if (o2) { o2.filled = (o2.filled || 0) + amount; o2.status = o2.filled >= o2.amount ? 'filled' : 'partially_filled'; await o2.save(); }
      }

>>>>>>> main
      if (trade.buyUserId) {
        const buyer = await User.findById(trade.buyUserId);
        if (buyer) {
          const cost = trade.price * trade.amount;
<<<<<<< HEAD
          // deduct any frozen funds first (best-effort)
=======
>>>>>>> main
          buyer.frozenBalance = Math.max(0, (buyer.frozenBalance || 0) - cost);
          await buyer.save();

          let pos = await Position.findOne({ userId: buyer._id, pair });
          if (!pos) {
<<<<<<< HEAD
            pos = await Position.create({ userId: buyer._id, pair, size: trade.amount, entryPrice: trade.price, margin: cost });
          } else {
            // average entry price
            const newSize = pos.size + trade.amount;
            const newEntry = ((pos.entryPrice * pos.size) + (trade.price * trade.amount)) / newSize;
            pos.size = newSize;
            pos.entryPrice = newEntry;
            pos.margin = (pos.margin || 0) + cost;
            pos.updatedAt = new Date();
=======
            const buyOrder = await Order.findOne({ orderId: trade.buyOrderId });
            const lev = buyOrder?.leverage || 1;
            const posSize = trade.amount * lev;
            pos = await Position.create({ userId: buyer._id, pair, side: buyOrder?.positionSide || 'long', size: posSize, entryPrice: trade.price, margin: cost, leverage: lev });
          } else {
            const newSize  = pos.size + trade.amount;
            const newEntry = ((pos.entryPrice * pos.size) + (trade.price * trade.amount)) / newSize;
            pos.size = newSize; pos.entryPrice = newEntry; pos.margin = (pos.margin || 0) + cost; pos.updatedAt = new Date();
>>>>>>> main
            await pos.save();
          }
        }
      }

<<<<<<< HEAD
      // settle seller: credit proceeds
      if (trade.sellUserId) {
        const seller = await User.findById(trade.sellUserId);
        if (seller) {
          const proceeds = trade.price * trade.amount;
          seller.balance = (seller.balance || 0) + proceeds;
          // reduce frozen if any
          seller.frozenBalance = Math.max(0, (seller.frozenBalance || 0) - proceeds);
=======
      if (trade.sellUserId) {
        const seller = await User.findById(trade.sellUserId);
        if (seller) {
          seller.balance = (seller.balance || 0) + (trade.price * trade.amount);
          seller.frozenBalance = Math.max(0, (seller.frozenBalance || 0) - (trade.price * trade.amount));
>>>>>>> main
          await seller.save();
        }
      }
    } catch (err) {
      console.error('Trade settlement error:', err.message);
    }

<<<<<<< HEAD
    emitter.emit("trade", trade);
=======
    emitter.emit('trade', trade);
>>>>>>> main
  }

  sortBook(market);
  emitter.emit('orderbook', { pair, buy: market.buy.slice(0, 17), sell: market.sell.slice(0, 17) });
}

<<<<<<< HEAD
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

=======
// ─── FIX 1: Direction-aware PnL helper ───────────────────────────────────────
/**
 * Calculate unrealized or realized PnL correctly for both long and short.
 * @param {number} entryPrice
 * @param {number} markPrice
 * @param {number} size        - absolute size (always positive)
 * @param {'long'|'short'} side
 * @param {number} leverage    - defaults to 1
 */
function calcPnl(entryPrice, markPrice, size, side = 'long', leverage = 1) {
  const direction = side === 'short' ? -1 : 1;
  return direction * (markPrice - entryPrice) * Math.abs(size) * leverage;
}

function triggerAutoCloseSide(order, currentPrice) {
  if (order.side === 'buy') {
    if (Number.isFinite(order.stopLoss)   && order.stopLoss   > 0 && currentPrice <= order.stopLoss)   return 'stopLoss';
    if (Number.isFinite(order.takeProfit) && order.takeProfit > 0 && currentPrice >= order.takeProfit) return 'takeProfit';
  } else {
    if (Number.isFinite(order.stopLoss)   && order.stopLoss   > 0 && currentPrice >= order.stopLoss)   return 'stopLoss';
    if (Number.isFinite(order.takeProfit) && order.takeProfit > 0 && currentPrice <= order.takeProfit) return 'takeProfit';
  }
  return null;
}

// ─── FIX 9: Auto-close orders in its OWN interval (not inside 1s price broadcast) ──
async function processAutoCloseOrders() {
  try {
    const Order    = require('./models/Order');
    const Position = require('./models/Position');

    const triggeredOrders = await Order.find({
      status: { $in: ['open', 'partially_filled'] },
      $or: [
        { stopLoss:   { $exists: true, $ne: null } },
        { takeProfit: { $exists: true, $ne: null } },
      ],
    }).lean();

    for (const order of triggeredOrders) {
      const marketPrice = cachedMarketPrices[order.pair];
      if (!isValidPriceValue(marketPrice)) continue;
      const triggerType = triggerAutoCloseSide(order, marketPrice);
      if (!triggerType) continue;

      await withPairLock(order.pair, async () => {
        const freshOrder = await Order.findOne({ orderId: order.orderId, status: { $in: ['open', 'partially_filled'] } });
        if (!freshOrder) return;
        const remaining = (freshOrder.amount || 0) - (freshOrder.filled || 0);
        if (remaining <= 0) return;

        const market = getMarket(freshOrder.pair);
        ['buy', 'sell'].forEach((side) => {
          const idx = market[side].findIndex((o) => o.orderId === freshOrder.orderId);
          if (idx >= 0) market[side].splice(idx, 1);
        });

        freshOrder.filled = freshOrder.amount;
        freshOrder.status = 'filled';
        await freshOrder.save();

        if (freshOrder.side === 'sell') {
          await balanceService.creditBalance(freshOrder.userId, 'USDT', marketPrice * remaining);
          const pos = await Position.findOne({ userId: freshOrder.userId, pair: freshOrder.pair });
          if (pos) {
            const ratio = pos.size > 0 ? Math.min(1, remaining / pos.size) : 0;
            pos.size   = Math.max(0, pos.size - remaining);
            pos.margin = Math.max(0, (pos.margin || 0) * (1 - ratio));
            if (pos.size <= 0) await pos.deleteOne(); else await pos.save();
          }
        } else {
          let pos = await Position.findOne({ userId: freshOrder.userId, pair: freshOrder.pair });
          if (!pos) {
            await Position.create({ userId: freshOrder.userId, pair: freshOrder.pair, side: 'long', size: remaining, entryPrice: marketPrice, margin: marketPrice * remaining, leverage: 1 });
          } else {
            const newSize  = pos.size + remaining;
            const newEntry = ((pos.entryPrice * pos.size) + (marketPrice * remaining)) / newSize;
            pos.size = newSize; pos.entryPrice = newEntry; pos.margin = (pos.margin || 0) + marketPrice * remaining; pos.updatedAt = new Date();
            await pos.save();
          }
        }

        sortBook(market);
        emitter.emit('orderbook', { pair: freshOrder.pair, buy: market.buy.slice(0, 17), sell: market.sell.slice(0, 17) });
        emitter.emit('trade', { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, pair: freshOrder.pair, price: marketPrice, amount: remaining, time: Math.floor(Date.now() / 1000) });
      });
    }
  } catch (err) {
    console.error('Auto TP/SL processing error:', err.message);
  }
}

function addOrder({ pair, side, price, amount, userId, orderId }) {
  if (!pair || !side || !price || !amount) throw new Error('Missing order fields');
  return withPairLock(pair, async () => {
    const market = getMarket(pair);
    const order  = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, orderId: orderId || null, userId: userId || null, side, price: Number(price), amount: Number(amount) };
    market[side].push(order);
    await matchOrders(pair);
    return order;
  });
}

>>>>>>> main
function getOrderBook(pair) { return getMarket(pair); }
function getTrades(pair)    { return getMarket(pair).trades.slice(0, 50); }

// ─── Market data routes ───────────────────────────────────────────────────────
const cleanPair = (p) => decodeURIComponent(p);

<<<<<<< HEAD
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
=======
app.get('/api/ping',           (_req, res) => res.json({ success: true, source: 'local-server' }));
app.get('/api/market/symbols', async (_req, res) => res.json({ symbols: await fetchBinanceSymbols() }));

app.get('/api/market/orderbook/:pair', async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const book = await fetchBinanceOrderBook(pair);
  if (book) return res.json(book);
  const market = getMarket(pair); sortBook(market);
  res.json({ buy: market.buy.slice(0, 17).map((o) => ({ price: Number(o.price), amount: Number(o.amount) })), sell: market.sell.slice(0, 17).map((o) => ({ price: Number(o.price), amount: Number(o.amount) })) });
});

app.get('/api/market/trades/:pair', async (req, res) => {
>>>>>>> main
  const pair   = cleanPair(req.params.pair);
  const trades = await fetchBinanceTrades(pair);
  res.json(trades || getTrades(pair));
});

<<<<<<< HEAD
app.get("/api/market/candles/:pair", async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
  const candles   = await fetchBinanceCandles(pair, timeframe, 1000);
  if (candles) return res.json(candles);

  const trades = getTrades(pair);
  const intervalMap = { "1m": 60, "5m": 300, "15m": 900, "1h": 3600 };
  const interval    = intervalMap[timeframe] || 60;
=======
// FIX 11: Chart always reads from Binance directly. The simulator only pushes
// simulatedPriceUpdate events to the user's socket room for PnL display —
// it never touches the candle endpoint. Chart stays genuine before and after trades.
app.get('/api/market/candles/:pair', async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || '1m');
  const candles   = await fetchBinanceCandles(pair, timeframe, 1000);
  if (candles) return res.json(candles);

  const trades   = getTrades(pair);
  const intervalMap = {
    '1s': 60,
    '1m': 60,
    '3m': 180,
    '5m': 300,
    '15m': 900,
    '30m': 1800,
    '1h': 3600,
    '2h': 7200,
    '4h': 14400,
    '6h': 21600,
    '8h': 28800,
    '12h': 43200,
    '1d': 86400,
    '1w': 604800,
    '1M': 2592000,
  };
  const interval = intervalMap[timeframe] || intervalMap[timeframe.toLowerCase?.()] || 60;
>>>>>>> main

  if (!trades.length) {
    const now = Math.floor(Date.now() / 1000);
    let price = 30_000;
    return res.json(Array.from({ length: 80 }, (_, i) => {
      price += (Math.random() - 0.5) * 200;
      const open  = price;
      const close = price + (Math.random() - 0.5) * 100;
      const high  = Math.max(open, close) + Math.random() * 50;
      const low   = Math.min(open, close) - Math.random() * 50;
<<<<<<< HEAD
      return {
        time:   Math.floor((now - (79 - i) * interval) / interval) * interval,
        open:   +open.toFixed(2),
        high:   +high.toFixed(2),
        low:    +low.toFixed(2),
        close:  +close.toFixed(2),
        volume: +(Math.random() * 10 + 1).toFixed(2),
      };
=======
      return { time: Math.floor((now - (79 - i) * interval) / interval) * interval, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), volume: +(Math.random() * 10 + 1).toFixed(2) };
>>>>>>> main
    }));
  }

  const map = {};
  trades.forEach((t) => {
    const bucket = Math.floor(t.time / interval) * interval;
<<<<<<< HEAD
    if (!map[bucket]) {
      map[bucket] = { time: bucket, open: t.price, high: t.price, low: t.price, close: t.price, volume: t.amount };
    } else {
      const c = map[bucket];
      c.high   = Math.max(c.high, t.price);
      c.low    = Math.min(c.low,  t.price);
      c.close  = t.price;
      c.volume += t.amount;
    }
=======
    if (!map[bucket]) { map[bucket] = { time: bucket, open: t.price, high: t.price, low: t.price, close: t.price, volume: t.amount }; }
    else { const c = map[bucket]; c.high = Math.max(c.high, t.price); c.low = Math.min(c.low, t.price); c.close = t.price; c.volume += t.amount; }
>>>>>>> main
  });
  res.json(Object.values(map));
});

<<<<<<< HEAD
app.get("/api/market/deepmarket/:pair", async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
=======
app.get('/api/market/deepmarket/:pair', async (req, res) => {
  const pair      = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || '1m');
>>>>>>> main
  const candles   = await fetchBinanceCandles(pair, timeframe, 1000);
  if (!candles) return res.json([]);
  res.json(candles.map((c) => ({ time: c.time, value: c.close * (1 + Math.sin(c.time / 1000) * 0.02) })));
});

// ─── Application routes ───────────────────────────────────────────────────────
<<<<<<< HEAD
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
=======
app.use('/api/auth',          authRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/deposits',      depositRoutes);
app.use('/api/transactions',  transactionRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/pro',           proTradingRoutes);

app.get('/test',   (_req, res) => res.json({ message: 'Server is working' }));
app.get('/health', (_req, res) => res.send('OK'));

app.post('/__debug/emitPrice', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') return res.status(403).json({ message: 'Not allowed' });
  const devSecret = req.headers['x-dev-secret'];
  if (devSecret !== process.env.DEV_SECRET) return res.status(403).json({ message: 'Invalid dev secret' });
>>>>>>> main
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

<<<<<<< HEAD
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
=======
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.userId).select('-password');
    if (!user)     return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user: { _id: user._id, userId: user.userId, email: user.email, name: user.name || '', kycVerified: user.kycVerified || false, kycStatus: user.kycStatus || 'not_started', balance: user.balance || 0, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Account routes ───────────────────────────────────────────────────────────
const Order        = require('./models/Order');
const Position     = require('./models/Position');
const Balance      = require('./models/Balance');
const Trade        = require('./models/Trade');
const balanceService = require('./src/services/balanceService');

app.get('/api/account/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user)   return res.status(404).json({ message: 'User not found' });
    try { await balanceService.initializeBalances(userId, user.balance || 0); } catch {}

    const positions = await Position.find({ userId });
    let totalUnreal = 0;
    positions.forEach((p) => {
      const binancePrice = global.cachedMarketPrices?.[p.pair] || null;
      const markPrice = getEffectivePrice(userId, p.pair, binancePrice);
      const mark = Number.isFinite(markPrice) && markPrice > 0 ? markPrice : (Number.isFinite(p.entryPrice) && p.entryPrice > 0 ? p.entryPrice : null);
      const pnl = (mark !== null && Number.isFinite(p.entryPrice))
        ? calcPnl(p.entryPrice, mark, p.size, p.side || 'long', p.leverage || 1)
        : 0;
      totalUnreal += pnl;
    });

    const openOrders    = await Order.find({ userId, status: { $in: ['open', 'partially_filled'] } });
    const balData       = await balanceService.getBalances(userId);
    const balance       = Number.isFinite(balData?.USDT?.available) ? balData.USDT.available : (user.balance || 0);
    const unrealizedPnl = totalUnreal;

    // FIX 1: Holdings derived from open positions ONLY (not cumulative filled order history)
    // When a position closes, it's deleted — so holdings automatically drop to 0.
    const holdings = positions.map((p) => {
      const mp2 = getEffectivePrice(userId, p.pair, global.cachedMarketPrices?.[p.pair] || p.entryPrice || 0);
      return {
        asset:  p.pair.split('/')[0],
        amount: Math.abs(p.size || 0),
        value:  (mp2 || 0) * Math.abs(p.size || 0)
      };
    });

    const usedMargin = positions.reduce((s, p) => s + (Number(p.margin) || 0), 0);
    const orderLockedUSDT = balData?.USDT?.locked || 0;
    const locked = orderLockedUSDT + usedMargin;
    const available = balance;
    const totalEquity = balance + locked + unrealizedPnl;
    const totalPortfolio = totalEquity;

    // FIX 2: usedMargin and freeMargin always reflect current open positions
    // When positions = 0, usedMargin = 0 and freeMargin equals available USDT
    const freeMargin = totalEquity - usedMargin;

    res.json({
      balance, unrealizedPnl, equity: totalEquity,
      available,
      locked,
      holdings,
      totalBalance:    balance + (user.frozenBalance || 0),
      totalEquity,
      totalPortfolio,
      usedMargin,
      freeMargin:      Math.max(0, freeMargin),
      marginRatio:     totalEquity > 0 && usedMargin > 0 ? ((usedMargin / totalEquity) * 100).toFixed(2) : '0.00',
      dailyPnL:        0,
      winRate:         0,
      openOrdersCount: openOrders.length,
    });
  } catch (err) {
    console.error('Account summary error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/admin/user/:userId/positions', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const positions = await Position.find({ userId });
    const normalized = positions.map((pos) => ({
      ...pos.toObject(),
      quantity: Math.abs(pos.size || 0),
      size: Math.abs(pos.size || 0),
      side: pos.side || (pos.size < 0 ? 'short' : 'long'),
    }));
    res.json({ positions: normalized });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
app.get('/api/account/positions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const positions = await Position.find({ userId });
    const normalized = positions.map((p) => {
      const quantity = Math.abs(p.size || 0);
      const margin = p.margin || 0;
      const side = p.side || (p.size < 0 ? 'short' : 'long');
      const markPrice = getEffectivePrice(userId, p.pair, global.cachedMarketPrices?.[p.pair] || null)
        || cachedMarketPrices[p.pair]
        || p.entryPrice
        || 0;
      const unrealizedPnl = Number.isFinite(p.entryPrice) && Number.isFinite(markPrice)
        ? calcPnl(p.entryPrice, markPrice, quantity, side, p.leverage || 1)
        : 0;
      const roePct = p.margin ? (unrealizedPnl / p.margin) * 100 : 0;

      return {
        ...p.toObject(),
        quantity,
        side,
        markPrice,
        unrealizedPnl,
        roePct,
        leverage: p.leverage || 1,
        fees: p.fees || 0,
      };
    });

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/account/open-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    res.json(await Order.find({ userId, status: { $in: ['open', 'partially_filled'] } }).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
});

app.get('/api/account/balances', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const balances = await balanceService.getBalances(userId);
    return res.json({
      USDT: { available: balances.USDT.available, locked: balances.USDT.locked, total: balances.USDT.total },
      BTC:  { available: balances.BTC.available,  locked: balances.BTC.locked,  total: balances.BTC.total  },
      totalUSDT: balances.USDT.total,
      totalBTC:  balances.BTC.total,
      estimatedUSDTValue: balances.USDT.total + (balances.BTC.total * (cachedMarketPrices['BTC/USDT'] || 0)),
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
    // Fast path: just read current wallet balance directly, no recalculation needed
    const balances = await balanceService.getBalances(userId);
    return res.json({ message: 'OK', current: { USDT: balances.USDT, BTC: balances.BTC } });
  } catch (err) {
    console.error('Balance recalculation error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/dev/reset', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
const devSecret = req.headers['x-dev-secret'];
if (devSecret !== process.env.DEV_SECRET) return res.status(403).json({ message: 'Invalid dev secret' });
  try {
    const RESET_BALANCE = 100000;
    await Order.updateMany({ status: { $in: ['open', 'partially_filled'] } }, { $set: { status: 'cancelled' } });
    const users = await User.find();
    for (const user of users) {
      user.balance = RESET_BALANCE; user.frozenBalance = 0; await user.save();
      await Balance.updateOne({ userId: user._id, currency: 'USDT' }, { $set: { available: RESET_BALANCE, locked: 0, total: RESET_BALANCE } }, { upsert: true });
      await Balance.updateOne({ userId: user._id, currency: 'BTC'  }, { $set: { available: 0, locked: 0, total: 0 } }, { upsert: true });
    }
    await Position.deleteMany({});
    return res.json({ message: 'Database reset to clean state', stats: { ordersReset: true, usersReset: users.length, balancePerUser: RESET_BALANCE, positionsCleared: true } });
  } catch (err) {
    console.error('[DEV RESET] Error:', err.message);
    return res.status(500).json({ message: 'Reset failed', error: err.message });
  }
});

app.get('/api/trade/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const TradeRecord = require('./models/TradeRecord');
    const trades = await TradeRecord.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();
    return res.json(trades.map((trade) => ({
      id:       trade._id,
      pair:     trade.pair     || 'BTC/USDT',
      side:     trade.side     || 'buy',
      type:     trade.type     || 'market',
      status:   trade.status   || 'closed',
      price:    Number(trade.entryPrice || trade.price || 0),
      quantity: Number(trade.amount || 0),
      profit:   Number(trade.pnl || trade.profit || 0),
      time:     new Date(trade.createdAt || Date.now()).getTime(),
    })));
  } catch (err) {
    console.error('Trade history error:', err.message);
    return res.status(500).json({ message: 'Failed to load trade history' });
  }
});

// ─── Place trade ──────────────────────────────────────────────────────────────
app.post('/api/trade/place', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { pair, amount, side, price, type = 'limit', stopLoss, takeProfit,
            positionSide = 'long',   // FIX 1: accept positionSide from frontend
            leverage = 1 } = req.body;
    if (!pair || !amount || !side) return res.status(400).json({ message: 'Missing required fields' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    try { await balanceService.initializeBalances(userId, user.balance || 0); } catch {}

    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const o = await Order.create({
      orderId, userId, pair, side, type,
      price:      Number(price || 0), // will be updated to execPrice after execution
      amount:     Number(amount),
      stopLoss:     Number.isFinite(Number(stopLoss))   ? Number(stopLoss)   : undefined,
      takeProfit:   Number.isFinite(Number(takeProfit)) ? Number(takeProfit) : undefined,
      leverage:     Number(leverage) || 1,
      positionSide: positionSide || 'long',
    });

    const supplied      = Number(price);
const suppliedValid = Number.isFinite(supplied) && supplied > 0;
const rawCached     = cachedMarketPrices[pair];
const cached        = getEffectivePrice(userId, pair, rawCached);
const cachedValid   = isValidPriceValue(cached);

    if (type !== 'market' && !suppliedValid) { o.status = 'cancelled'; await o.save(); return res.status(400).json({ message: 'Limit orders require a valid price' }); }

    const execPrice = suppliedValid ? supplied : cachedValid ? cached : null;
    if (execPrice === null) { o.status = 'cancelled'; await o.save(); return res.status(400).json({ message: 'Market price unavailable' }); }

    const cost = execPrice * Number(amount);

    if (side === 'buy') {
      try { await balanceService.lockBalance(userId, 'USDT', cost); }
      catch (balErr) { o.status = 'cancelled'; await o.save(); return res.status(400).json({ message: 'Insufficient USDT balance: ' + balErr.message }); }
    }

    if (type === 'market') {
      if (!cachedValid) {
        o.status = 'cancelled'; await o.save();
        return res.status(400).json({ message: 'Market price unavailable' });
      }

      const executedPrice = cached;

      if (side === 'buy') {
        // FIX 6: create position atomically with correct fields
        let pos = await Position.findOne({ userId, pair });
        if (!pos) {
          pos = await Position.create({
            userId, pair,
            side:       positionSide,       // FIX 1: store the direction
            leverage:   Number(leverage),   // FIX 8: store leverage
            size:       Number(amount),
            entryPrice: executedPrice,
            margin:     cost,               // FIX 2: margin stored for return on close
          });
        } else {
          const newSize  = pos.size + Number(amount);
          const newEntry = (pos.entryPrice * pos.size + executedPrice * Number(amount)) / newSize;
          pos.size = newSize; pos.entryPrice = newEntry; pos.margin = (pos.margin || 0) + cost; pos.updatedAt = new Date();
          await pos.save();
        }
      } else {
        await balanceService.creditBalance(userId, 'USDT', executedPrice * Number(amount));
      }

      o.status = 'filled'; o.filled = Number(amount); o.price = executedPrice; await o.save();
      // Market buys fill immediately: remove the temporary wallet lock without
      // returning it to available. The open position margin represents the used funds.
      if (side === 'buy') { 
        try { await balanceService.consumeLockedBalance(userId, 'USDT', cost); } catch (e) { 
          console.error('Failed to consume locked balance after market fill:', e.message); 
        } 
      }
      // For sell orders, balance was credited and remains available for next trade
      emitter.emit('trade', { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, pair, price: executedPrice, amount: Number(amount), time: Math.floor(Date.now() / 1000), buyUserId: side === 'buy' ? userId : null, sellUserId: side === 'sell' ? userId : null });
      return res.json({ success: true, order: o });
    }

    await addOrder({ pair, side, price: Number(price), amount: Number(amount), userId, orderId });
    return res.json({ success: true, order: o });
  } catch (err) {
    console.error('Place trade error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Cancel order ─────────────────────────────────────────────────────────────
app.post('/api/trade/cancel', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Missing orderId' });

    const o = await Order.findOneAndUpdate(
      { orderId, userId, status: { $in: ['open', 'partially_filled'] } },
      { $set: { status: 'cancelled' } },
      { returnDocument: 'after' }
    );

    if (!o) {
      const exists = await Order.findOne({ orderId, userId });
      if (!exists) return res.status(404).json({ message: 'Order not found' });
      return res.status(400).json({ message: 'Order cannot be cancelled — already filled or cancelled' });
    }

    withPairLock(o.pair, async () => {
      const market = getMarket(o.pair);
      ['buy', 'sell'].forEach((s) => { const idx = market[s].findIndex((it) => it.orderId === orderId); if (idx >= 0) market[s].splice(idx, 1); });
      emitter.emit('orderbook', { pair: o.pair, buy: market.buy.slice(0, 17), sell: market.sell.slice(0, 17) });
    });

    if (o.side === 'buy') {
      const remaining = (o.amount || 0) - (o.filled || 0);
      const refund    = (o.price || 0) * remaining;
      if (refund > 0) { try { await balanceService.unlockBalance(userId, 'USDT', refund); } catch (balErr) { console.error('Balance unlock failed during cancel:', balErr); } }
    }

    res.json({ success: true, order: o, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Close position ───────────────────────────────────────────────────────────
// FIX 1: Direction-aware PnL (long vs short)
// FIX 2: Returns original margin (collateral) + PnL delta, not just PnL delta
// FIX 3: Handles negative PnL correctly via atomic $inc in creditBalance
// FIX 11: Clears simulator on close → chart returns to real Binance prices
app.post('/api/trade/close-position', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { pair, positionId } = req.body;
    if (!pair && !positionId) return res.status(400).json({ message: 'pair or positionId required' });

    const position = positionId
      ? await Position.findOne({ _id: positionId, userId })
      : await Position.findOne({ pair, userId });

    if (!position) return res.status(404).json({ message: 'Position not found' });

    const rawPrice = global.cachedMarketPrices?.[position.pair] || cachedMarketPrices?.[position.pair] || null;
    const markPrice = getEffectivePrice(userId, position.pair, rawPrice) || rawPrice || position.entryPrice;

    if (!Number.isFinite(markPrice) || markPrice <= 0) {
      return res.status(400).json({ message: 'Mark price unavailable for close' });
    }

    const positionSide = position.side || 'long';
    const leverage     = position.leverage || 1;
    const size         = Math.abs(Number(position.size || 0));
    const margin       = Number(position.margin || 0);

    // FIX 1: direction-aware PnL
    // FIX 8: apply leverage
    console.log('[CLOSE-POS] entry:', position.entryPrice, 'mark:', markPrice, 'size:', size, 'side:', positionSide, 'margin:', margin);
    const pnl = calcPnl(position.entryPrice, markPrice, size, positionSide, leverage);
    const settledPnl = Number.isFinite(pnl) ? pnl : 0;

    // FIX 2: return collateral + PnL (not just PnL)
    // If user deposited $1000 margin and made $50 profit → they get back $1050
    // If user deposited $1000 margin and lost $200 → they get back $800
    const totalCredit = margin + settledPnl;
    const safeCredit  = Math.max(0, totalCredit); // never go below 0

    // FIX 3: creditBalance uses $inc which handles negative amounts atomically
    await balanceService.creditBalance(userId, 'USDT', safeCredit);
  

    await Position.deleteOne({ _id: position._id, userId });
    // Fix 6: Save complete trade record with entry price, close price, PnL
    const TradeRecord = require('./models/TradeRecord');
    await TradeRecord.create({
      userId:     position.userId,
      walletType: 'spot',
      pair:       position.pair,
      side:       positionSide === 'long' ? 'sell' : 'buy',
      type:       'market',
      price:      markPrice,           // close price
      entryPrice: position.entryPrice, // entry price
      quantity:   size,
      amount:     markPrice * size,
      pnl:        settledPnl,
      profit:     settledPnl,
      fee:        0,
    });

    // FIX 11: clear simulator → chart returns to real Binance data immediately
    marketSimulator.clearSimulation(userId, position.pair, position._id?.toString());

    if (global.io) {
      global.io.to(`user:${userId}`).emit('positionClosed', {
        userId,
        positionId: position._id,
        pair:       position.pair,
        markPrice,
        pnl:        settledPnl,
        margin,
        totalReturned: safeCredit,
        closedAt:   Date.now(),
      });
      // Also emit balanceUpdate so frontend refreshes balance instantly
      const updatedWallet = await balanceService.getBalances(userId);
      global.io.to(`user:${userId}`).emit('balanceUpdate', {
        userId,
        balance:   updatedWallet?.USDT?.available || 0,
        available: updatedWallet?.USDT?.available || 0,
        locked:    updatedWallet?.USDT?.locked || 0,
      });
    }

    return res.json({
      success: true,
      position:     position.toObject(),
      closedAt:     Date.now(),
      markPrice,
      pnl:          settledPnl,
      margin,
      totalReturned: safeCredit,
    });
  } catch (err) {
    console.error('Close position error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── HTTP server + Socket.io ──────────────────────────────────────────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors:       { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
  transports: ['websocket', 'polling'],
  path:       '/socket.io',
});
global.io = io;

marketSimulator.initMarketSimulator({
  io,
  getRealPrice: (pair) => cachedMarketPrices[pair],
  onSimulated: async (state) => {
    try {
      const userId   = state.userId;
      const pair     = state.pair;
      const positions = await Position.find({ userId });
      const balances  = await balanceService.getBalances(userId).catch(() => ({ USDT: { total: 0, available: 0, locked: 0 }, BTC: { total: 0, available: 0, locked: 0 } }));

      let totalUnreal = 0;
      const positionsWithMarks = [];
      for (const p of positions) {
        const pid       = p._id?.toString();
        const markPrice = getEffectivePrice(userId, p.pair, global.cachedMarketPrices?.[p.pair] || p.entryPrice || 0);
        // FIX 1: direction-aware PnL in real-time updates
        const pnl = calcPnl(p.entryPrice, markPrice, p.size, p.side || 'long', p.leverage || 1);
        totalUnreal += pnl;
        positionsWithMarks.push({ positionId: pid, pair: p.pair, entryPrice: p.entryPrice, size: p.size, side: p.side || 'long', leverage: p.leverage || 1, markPrice, unrealizedPnl: pnl });
      }

      const available = balances.USDT?.available || 0;
      const usedMargin = positions.reduce((sum, p) => sum + (Number(p.margin) || 0), 0);
      const locked = (balances.USDT?.locked || 0) + usedMargin;
      const equity  = available + locked + totalUnreal;

      io.to(`user:${userId}`).emit('market_update', {
        userId, pair, positionId: state.positionId,
        currentPrice:   state.lastPrice,
        positions:      positionsWithMarks,
        unrealizedPnl:  totalUnreal,
        balance: available,
        available,
        locked,
        usedMargin,
        equity,
        totalEquity: equity,
        totalPortfolio: equity,
        driftState: state.activeDrift ? { active: true, ...state.activeDrift } : { active: false },
        mode:      state.mode,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('onSimulated handler error:', err?.message ?? err);
    }
  },
});

io.on('connection', (socket) => {
  console.log('Socket.io connected:', socket.id);

  const joinUserRoom = (tokenValue) => {
    if (typeof tokenValue !== 'string') return;
    try {
      const decoded      = jwt.verify(tokenValue, JWT_SECRET);
      const socketUserId = decoded.userId || decoded.id;
      socket.role        = decoded.role || null;
      if (socketUserId) {
        socket.userId = socketUserId;
        socket.join(`user:${socketUserId}`);
        console.log(`  → ${socket.id} joined private room user:${socketUserId}`);

        const activeStates = marketSimulator.getSimulationStatesForUser(socketUserId);
        if (activeStates.length) {
          socket.emit('simulationStateSync', { states: activeStates });
        }
      }
    } catch (err) {
      console.warn(`Socket auth failed for ${socket.id}:`, err.message);
    }
  };

  const initialToken = socket.handshake.auth?.token;
  if (typeof initialToken === 'string') joinUserRoom(initialToken);

  socket.on('authenticate',   (payload) => joinUserRoom(typeof payload === 'string' ? payload : payload?.token));
  socket.on('subscribe',      (pair) => { if (typeof pair === 'string') { socket.join(`pair:${pair}`); } });
  socket.on('unsubscribe',    (pair) => { if (typeof pair === 'string') socket.leave(`pair:${pair}`); });
  socket.on('subscribeUser',  (userId) => { if (typeof userId !== 'string' || socket.role !== 'admin') return; socket.join(`user:${userId}`); });
  socket.on('unsubscribeUser',(userId) => { if (typeof userId !== 'string' || socket.role !== 'admin') return; socket.leave(`user:${userId}`); });
  socket.on('disconnect',     () => console.log('Socket.io disconnected:', socket.id));
});


emitter.on('trade',     (trade) => { io.to(`pair:${trade.pair}`).emit('trade', trade); io.emit('trade', trade); });
emitter.on('orderbook', (data)  => { io.to(`pair:${data.pair}`).emit('orderbook', data); io.emit('orderbook', data); });
emitter.on('position_update', (data) => {
  io.emit('position_update', data);
});
// ─── FIX 4/5: Unified Binance price polling (replaces CoinGecko for trading) ──
// Single source of truth: Binance /api/v3/ticker/price covers all tracked pairs
// in one request, same source as the orderbook → no exploitable gap.
const trackedPairs     = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'ADA/USDT'];
const cachedMarketPrices = {};
global.cachedMarketPrices = cachedMarketPrices;
const MIN_POLL_DELAY   = 2_000;   // 2s — Binance handles this easily
const MAX_POLL_DELAY   = 10_000;  // back-off cap
let marketPollDelay    = MIN_POLL_DELAY;
let priceFetchBusy     = false;

async function fetchMarketPrices() {
  if (priceFetchBusy) return;
  priceFetchBusy = true;
  try {
    // Single call returns ALL symbols — no per-pair requests needed
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/ticker/price`, { timeout: 5_000 });
    trackedPairs.forEach((pair) => {
      const symbol = pair.replace('/', '');
      const found  = Array.isArray(data) ? data.find((t) => t.symbol === symbol) : null;
      if (found) cachedMarketPrices[pair] = parseFloat(found.price);
    });
    marketPollDelay = MIN_POLL_DELAY;
  } catch (err) {
    console.error('Binance price poll failed:', err.message);
    marketPollDelay = Math.min(marketPollDelay * 2, MAX_POLL_DELAY);
  } finally {
    priceFetchBusy = false;
  }
}

function scheduleMarketPriceFetch() {
  fetchMarketPrices().finally(() => setTimeout(scheduleMarketPriceFetch, marketPollDelay));
}
if (process.env.NODE_ENV !== 'test') scheduleMarketPriceFetch();

function isValidPriceValue(v) { return Number.isFinite(v) && v > 0; }

// Price broadcast interval — only broadcasts, no heavy work inside
setInterval(() => {
  for (const pair of trackedPairs) {
    const rawPrice = isValidPriceValue(cachedMarketPrices[pair]) ? cachedMarketPrices[pair] : null;
    // Broadcast price — per-user override takes priority
    if (rawPrice !== null) {
      const sockets = Array.from(io.sockets.sockets.values());
      const overriddenUserIds = new Set();
    
      for (const sock of sockets) {
        if (sock.userId) {
          const effPrice = getEffectivePrice(sock.userId, pair, rawPrice);
          if (effPrice !== rawPrice) {
            overriddenUserIds.add(sock.userId);
            console.log("[OVERRIDE-EMIT]", sock.userId, pair, effPrice);
            io.to('user:' + sock.userId).emit('priceUpdate', { pair, price: effPrice, time: Date.now() });
          }
        }
      }
      // Only broadcast raw price to sockets without an override
      for (const sock of sockets) {
        if (!sock.userId || !overriddenUserIds.has(sock.userId)) {
          sock.emit('priceUpdate', { pair, price: Number(rawPrice), time: Date.now() });
        }
      }
    } else {
      io.emit('priceUpdate', { pair, price: null, time: Date.now() });
    }
  }
}, 1_000);

// FIX 9: Auto-close orders on its OWN interval (every 5s), not blocking price broadcast
let autoCloseWorkerBusy = false;
setInterval(async () => {
  if (autoCloseWorkerBusy) return;
  autoCloseWorkerBusy = true;
  try { await processAutoCloseOrders(); }
  catch (err) { console.error('AutoClose interval error:', err.message); }
  finally { autoCloseWorkerBusy = false; }
}, 5_000);

// ─── Orderbook update worker ──────────────────────────────────────────────────
global.orderbookCache = {};
global.tradesCache    = {};
global.candlesCache   = {};

let orderbookWorkerBusy = false;
async function emitOrderbookUpdates() {
  if (orderbookWorkerBusy) { console.warn('⏩ Orderbook worker skipped — previous tick still running'); return; }
  orderbookWorkerBusy = true;
  try {
    for (const pair of trackedPairs) {
      try {
        const symbol   = pair.replace('/', '');
        const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/depth?symbol=${symbol}&limit=18`, { timeout: 4_000 });
        if (!data.bids || !data.asks) throw new Error('Invalid orderbook response');
        const buy  = data.bids.map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
        const sell = data.asks.map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
        const orderbook = { pair, buy, sell };
        const trades = global.activeTrades?.[pair] || [];

for (const trade of trades) {
  const markPrice = buy[0]?.price || 0;

  const pnl =
    trade.side === 'long'
      ? (markPrice - trade.entryPrice) * trade.quantity * (trade.leverage || 1)
      : (trade.entryPrice - markPrice) * trade.quantity * (trade.leverage || 1);

  emitter.emit('position_update', {
    userId: trade.userId,
    tradeId: trade.id,
    pnl,
    markPrice,
  });
}
        global.orderbookCache[pair] = orderbook;
        // Broadcast raw orderbook to pair room
        io.to(`pair:${pair}`).emit('orderbook', orderbook);
        emitter.emit('orderbook', orderbook);
        // Per-user overridden orderbook
        const allSockets = Array.from(io.sockets.sockets.values());
        for (const sock of allSockets) {
          if (!sock.userId) continue;
          const effPrice = getEffectivePrice(sock.userId, pair, buy[0]?.price || 0);
          if (effPrice === (buy[0]?.price || 0)) continue;
          const offset = effPrice - (buy[0]?.price || 0);
          const shiftedOrderbook = {
            pair,
            buy:  orderbook.buy.map(e  => ({ ...e,  price: e.price  + offset })),
            sell: orderbook.sell.map(e => ({ ...e, price: e.price + offset })),
          };
          io.to('user:' + sock.userId).emit('orderbook', shiftedOrderbook);
        }
      } catch (err) {
        console.error(`Orderbook fetch failed for ${pair}:`, err.message);
      }
    }
  } finally {
    orderbookWorkerBusy = false;
  }
}
setInterval(emitOrderbookUpdates, 5_000);

// ─── News ─────────────────────────────────────────────────────────────────────
const parser    = new Parser();
const ogMemCache = new Map();
const RSS_FEEDS = [
  'https://beincrypto.com/feed/', 'https://newsbtc.com/feed/', 'https://dailyhodl.com/feed/',
  'https://cryptonews.com/news/feed/', 'https://cryptopolitan.com/feed/',
  'https://www.finbold.com/feed/', 'https://cryptoslate.com/feed/', 'https://www.theblock.co/rss.xml',
];

function isValidImage(url) { return typeof url === 'string' && url.startsWith('http') && !url.includes('placeholder') && !url.includes('null'); }
const parseWithTimeout = (url) => Promise.race([parser.parseURL(url), new Promise((_, reject) => setTimeout(() => reject(new Error('RSS Timeout')), 8_000))]);

async function getOGData(url) {
  if (!url) return null;
  if (ogMemCache.has(url)) return ogMemCache.get(url);
  const cached = await safeRedisGet(`og:${url}`);
  if (cached) { const parsed = JSON.parse(cached); ogMemCache.set(url, parsed); return parsed; }
  try {
    const { result } = await ogs({ url });
    const data = { image: Array.isArray(result.ogImage) ? result.ogImage[0]?.url : result.ogImage?.url || null, description: result.ogDescription || null };
    ogMemCache.set(url, data);
    await safeRedisSetEx(`og:${url}`, 3600, JSON.stringify(data));
    return data;
  } catch { return null; }
}

const fetchAllNews = async () => {
  try {
    const results  = await Promise.allSettled(RSS_FEEDS.map(parseWithTimeout));
    const articles = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value?.items) {
        result.value.items.forEach((item) => {
          articles.push({ title: item.title || '', description: item.contentSnippet || '', url: item.link || '', image: item.enclosure?.url || null, source: result.value.title || 'News', publishedAt: new Date(item.pubDate || 0).getTime() });
>>>>>>> main
        });
      }
    });
    const enriched = [];
    for (const item of articles.slice(0, 50)) {
      const ogData = await getOGData(item.url);
<<<<<<< HEAD
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

=======
      enriched.push({ ...item, image: isValidImage(item.image) ? item.image : ogData?.image || null, description: item.description || ogData?.description || item.title });
    }
    return processNews(enriched);
  } catch (err) { console.error('RSS Error:', err.message); return []; }
};

let newsWorkerBusy = false;
function startNewsStream() {
  console.log('📡 Live news stream started');
  setInterval(async () => {
    if (newsWorkerBusy) { console.warn('⏩ News worker skipped — previous tick still running'); return; }
    newsWorkerBusy = true;
    try { const data = await fetchAllNews(); io.emit('news-update', data); }
    catch (err) { console.error('News stream error:', err.message); }
    finally { newsWorkerBusy = false; }
  }, 60_000);
}

// ─── Public data API ──────────────────────────────────────────────────────────
app.get('/api/news', async (_req, res) => {
  try { res.json(await fetchAllNews()); } catch (err) { res.status(500).json({ error: err.message }); }
});

// CoinGecko kept ONLY for display cards (market cap, images, 24h% — not trading logic)
app.get('/api/coins', async (_req, res) => {
  const fallback = [
    { id: 'bitcoin',  symbol: 'btc', name: 'Bitcoin',  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',   current_price: 78000, market_cap: 1_500_000_000_000, price_change_24h: 1200,  price_change_percentage_24h:  1.56, total_volume: 32_000_000_000 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3200,  market_cap:   380_000_000_000, price_change_24h: -40,   price_change_percentage_24h: -1.23, total_volume: 12_000_000_000 },
    { id: 'solana',   symbol: 'sol', name: 'Solana',   image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',  current_price: 170,   market_cap:    83_000_000_000, price_change_24h: 3.2,   price_change_percentage_24h:  1.91, total_volume:  4_300_000_000 },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',   current_price: 80,    market_cap:     6_000_000_000, price_change_24h: -0.5,  price_change_percentage_24h: -0.62, total_volume:    500_000_000 },
    { id: 'cardano',  symbol: 'ada', name: 'Cardano',  image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',  current_price: 0.48,  market_cap:    17_000_000_000, price_change_24h: -0.01, price_change_percentage_24h: -0.02, total_volume:  2_400_000_000 },
  ];
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 5, page: 1 },
      timeout: 7_000,
    });
    if (Array.isArray(data) && data.length) return res.json(data);
  } catch (err) { console.error('Coin fetch failed:', err.message); }
  res.json(fallback);
});


// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    if (process.env.NODE_ENV !== 'production') await ensureAdminUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err.message));

async function ensureAdminUser() {
  try {
    const email  = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@swancore.com').toLowerCase().trim();
    const pass   = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const exists = await User.findOne({ email });
    if (exists) return;
    const bcrypt = require('bcrypt');
    await User.create({ email, password: await bcrypt.hash(pass, 10), name: 'Admin User', role: 'admin', isVerified: true, balance: 0, frozenBalance: 0, isBanned: false, kycVerified: true, kycStatus: 'approved' });
    console.log(`Default admin created: ${email}`);
  } catch (err) { console.error('ensureAdminUser error:', err.message); }
}

>>>>>>> main
// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (require.main === module) {
<<<<<<< HEAD
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startNewsStream();
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} already in use — set PORT env var to override.`);
    } else {
      console.error("Server start error:", err);
    }
=======
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startNewsStream();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') console.error(`Port ${PORT} already in use — set PORT env var to override.`);
    else console.error('Server start error:', err);
>>>>>>> main
  });
}

module.exports = { app, server };
<<<<<<< HEAD
=======

/*
 * ─── CHANGELOG ────────────────────────────────────────────────────────────────
 *
 * FIX 1  – PnL direction (long/short)
 *          Added calcPnl() helper: direction = side==='short' ? -1 : 1
 *          Used in: close-position, onSimulated handler, account/summary
 *          Position.js now stores `side` and `leverage` fields.
 *
 * FIX 2  – Collateral return on close
 *          totalCredit = margin + pnl (not just pnl delta)
 *          User gets back original margin ± profit/loss.
 *
 * FIX 3  – Negative PnL handling
 *          creditBalance uses atomic $inc — negative amounts debit correctly.
 *          Added Math.max(0, totalCredit) floor to prevent overcrediting on
 *          full-loss positions (balance never goes negative from a single close).
 *
 * FIX 4/5 – Single price source (Binance)
 *          fetchMarketPrices() now calls Binance /api/v3/ticker/price (all pairs
 *          in one request). Poll interval: 2s (was 15-60s CoinGecko).
 *          CoinGecko stays for /api/coins display card only.
 *
 * FIX 6  – Atomic operations
 *          Position create happens after balance lock succeeds.
 *          Order cancel uses findOneAndUpdate atomic flip.
 *          Balance changes use $inc throughout.
 *
 * FIX 8  – Leverage in PnL
 *          calcPnl multiplies by leverage. Position.js stores leverage per position.
 *
 * FIX 9  – processAutoCloseOrders on own interval (5s)
 *          Removed from 1s price broadcast to prevent blocking.
 *
 * FIX 10 – Prisma removed
 *          Delete /prisma folder and remove prisma + @prisma/client from package.json.
 *          All data access goes through Mongoose exclusively.
 *
 * FIX 11 – Chart integrity
 *          Chart candles always read from Binance (/api/market/candles/:pair).
 *          Simulator only emits simulatedPriceUpdate to the user's private socket room
 *          for PnL display — never touches the chart feed.
 *          clearSimulation() called on position close → chart snaps back instantly.
 *
 * FIX 12 – Natural mode caps
 *          marketSimulator.js natural mode already enforces +2% / -25%.
 *          Drift mode clamp REMOVED so admin can push to any target % (was broken).
 */
>>>>>>> main

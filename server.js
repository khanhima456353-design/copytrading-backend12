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


// utils
const { processNews } = require("./utils/newsEngine");

// middleware
const { authMiddleware } = require("./src/middleware/authMiddleware");

// routes
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const depositRoutes = require("./src/routes/depositRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const proTradingRoutes = require("./src/routes/proTradingRoutes");

// ================= MIDDLEWARE =================
const allowedOrigins = [
  "http://localhost:3000",
  "https://hitachi-intense-exciting-steve.trycloudflare.com"
];

app.use((req, res, next) => {
  if (!req.url.includes("/health") && !req.url.includes("/orderbook")) {
    console.log(`📨 ${req.method} ${req.url}`);
  }
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
 
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));


const rateLimit = require("express-rate-limit");

app.use("/api/auth", rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://challenges.cloudflare.com"
        ],

        frameSrc: [
          "https://challenges.cloudflare.com"
        ],

        connectSrc: [
          "'self'",
          "https://challenges.cloudflare.com"
        ],
      },
    },
  })
);

/* ================= TRADING LOGIC ================= */
const EventEmitter = require("events");
const emitter = new EventEmitter();

const markets = {};
const BINANCE_API_BASE = "https://api.binance.com";
const BINANCE_QUOTE_ASSETS = ["USDT", "USD", "BTC", "ETH", "BNB"];

function getMarket(pair) {
  if (!markets[pair]) {
    markets[pair] = { buy: [], sell: [], trades: [] };
  }
  return markets[pair];
}

function binanceSymbolForPair(pair) {
  return pair.replace("/", "");
}

function pairFromBinanceSymbol(symbol) {
  for (const quote of BINANCE_QUOTE_ASSETS) {
    if (symbol.endsWith(quote)) {
      return `${symbol.slice(0, -quote.length)}/${quote}`;
    }
  }
  return symbol;
}

async function fetchBinanceSymbols() {
  try {
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/exchangeInfo`, {
      timeout: 8000,
    });

    if (!data || !Array.isArray(data.symbols)) {
      throw new Error("Invalid Binance exchangeInfo response");
    }

    const symbols = data.symbols
      .filter((item) => item.status === "TRADING" && item.quoteAsset === "USDT")
      .map((item) => `${item.baseAsset}/${item.quoteAsset}`)
      .slice(0, 120);

    return symbols.length ? symbols : ["BTC/USDT"];
  } catch (err) {
    console.error("Binance symbols fetch failed:", err.message || err);
    return ["BTC/USDT"];
  }
}

async function fetchBinanceOrderBook(pair) {
  try {
    const symbol = binanceSymbolForPair(pair);
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/depth`, {
      params: { symbol, limit: 50 },
      timeout: 8000,
    });

    return {
      buy: data.bids.map(([price, amount]) => ({ price: Number(price), amount: Number(amount) })),
      sell: data.asks.map(([price, amount]) => ({ price: Number(price), amount: Number(amount) })),
    };
  } catch (err) {
    console.error("Binance orderbook fetch failed for", pair, err.message || err);
    return null;
  }
}

async function fetchBinanceTrades(pair) {
  try {
    const symbol = binanceSymbolForPair(pair);
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/trades`, {
      params: { symbol, limit: 40 },
      timeout: 8000,
    });

    return data.map((trade) => ({
      time: Math.floor(trade.time / 1000),
      price: Number(trade.price),
      amount: Number(trade.qty),
      side: trade.isBuyerMaker ? "sell" : "buy",
    }));
  } catch (err) {
    console.error("Binance trades fetch failed for", pair, err.message || err);
    return null;
  }
}

async function fetchBinanceCandles(pair, timeframe = "1m", limit = 80) {
  try {
    const symbol = binanceSymbolForPair(pair);
    const { data } = await axios.get(`${BINANCE_API_BASE}/api/v3/klines`, {
      params: { symbol, interval: timeframe, limit },
      timeout: 8000,
    });

    return data.map((k) => ({
      time: Math.floor(k[0] / 1000),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
      volume: Number(k[5]),
    }));
  } catch (err) {
    console.error("Binance candles fetch failed for", pair, err.message || err);
    return null;
  }
}

function sortBook(book) {
  book.buy.sort((a, b) => b.price - a.price);
  book.sell.sort((a, b) => a.price - b.price);
}

function matchOrders(pair) {
  const market = getMarket(pair);

  // ✅ sort before matching
  sortBook(market);

  while (
    market.buy.length &&
    market.sell.length &&
    market.buy[0].price >= market.sell[0].price
  ) {
    const buy = market.buy[0];
    const sell = market.sell[0];

    const amount = Math.min(buy.amount, sell.amount);

    const trade = {
      id: Date.now() + Math.random(),
      pair,
      price: sell.price,
      amount,
      time: Math.floor(Date.now() / 1000),
    };

    market.trades.unshift(trade);

    buy.amount -= amount;
    sell.amount -= amount;

    if (buy.amount <= 0) market.buy.shift();
    if (sell.amount <= 0) market.sell.shift();

    emitter.emit("trade", trade);
  }

  // ✅ sort again AFTER matching
  sortBook(market);

  // ✅ emit ONLY 17 levels
  emitter.emit("orderbook", {
    pair,
    buy: market.buy.slice(0, 17),
    sell: market.sell.slice(0, 17),
  });
}

function addOrder({ pair, side, price, amount }) {
  if (!pair || !side || !price || !amount) {
    throw new Error("Missing fields");
  }

  const market = getMarket(pair);

  const order = {
    id: Date.now() + Math.random(),
    side,
    price: Number(price),
    amount: Number(amount),
  };

  market[side].push(order);
  matchOrders(pair);

  return order;
}

function getOrderBook(pair) {
  return getMarket(pair);
}

function getTrades(pair) {
  return getMarket(pair).trades.slice(0, 50);
}



/* ================= TRADING ROUTES ================= */
const cleanPair = (pair) => decodeURIComponent(pair);

// ping
app.get("/api/ping", (req, res) => {
  res.json({ success: true, source: "local-server" });
});

// symbols
app.get("/api/market/symbols", async (req, res) => {
  const symbols = await fetchBinanceSymbols();
  res.json({ symbols });
});

// orderbook
app.get("/api/market/orderbook/:pair", async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const book = await fetchBinanceOrderBook(pair);
  if (book) {
    return res.json(book);
  }
  res.json(getOrderBook(pair));
});

// trades
app.get("/api/market/trades/:pair", async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const trades = await fetchBinanceTrades(pair);
  if (trades) {
    return res.json(trades);
  }
  res.json(getTrades(pair));
});

// candles
app.get("/api/market/candles/:pair", async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
  const candles = await fetchBinanceCandles(pair, timeframe, 1000);
  if (candles) {
    return res.json(candles);
  }

  const trades = getTrades(pair);
  const intervalMap = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600,
  };

  const interval = intervalMap[timeframe] || 60;

  if (!trades.length) {
    const now = Math.floor(Date.now() / 1000);
    let price = 30000;
    const fallbackCandles = [];

    for (let i = 79; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 200;
      price += change;
      const open = price;
      const close = price + (Math.random() - 0.5) * 100;
      const high = Math.max(open, close) + Math.random() * 50;
      const low = Math.min(open, close) - Math.random() * 50;

      fallbackCandles.push({
        time: Math.floor((now - i * interval) / interval) * interval,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Number((Math.random() * 10 + 1).toFixed(2)),
      });
    }

    return res.json(fallbackCandles);
  }

  const candlesMap = {};

  trades.forEach((trade) => {
    const time = trade.time;
    const bucket = Math.floor(time / interval) * interval;

    if (!candlesMap[bucket]) {
      candlesMap[bucket] = {
        time: bucket,
        open: trade.price,
        high: trade.price,
        low: trade.price,
        close: trade.price,
        volume: trade.amount,
      };
    } else {
      const c = candlesMap[bucket];
      c.high = Math.max(c.high, trade.price);
      c.low = Math.min(c.low, trade.price);
      c.close = trade.price;
      c.volume += trade.amount;
    }
  });

  res.json(Object.values(candlesMap));
});

// deepmarket data
app.get("/api/market/deepmarket/:pair", async (req, res) => {
  const pair = cleanPair(req.params.pair);
  const timeframe = String(req.query.timeframe || "1m");
  // For now, return modified candle data as "DeepMarket" - could be different indicator or data source
  const candles = await fetchBinanceCandles(pair, timeframe, 1000);
  if (candles) {
    // Modify the data slightly to simulate different market data
    const deepMarketData = candles.map(candle => ({
      time: candle.time,
      value: candle.close * (1 + (Math.sin(candle.time / 1000) * 0.02)), // Add some variation
    }));
    return res.json(deepMarketData);
  }
  res.json([]);
});

// coins endpoint - returns top cryptocurrencies data
app.get("/api/coins", async (req, res) => {
  try {
    const { vs_currency = "usd", order = "market_cap_desc", per_page = 5, page = 1 } = req.query;
    
    // For now, return mock data that matches CoinGecko API structure
    // In production, you might want to integrate with CoinGecko API or another crypto data provider
    const mockCoins = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 67420,
        market_cap: 1325000000000,
        market_cap_rank: 1,
        fully_diluted_valuation: 1415000000000,
        total_volume: 28500000000,
        high_24h: 67800,
        low_24h: 65200,
        price_change_24h: 1220,
        price_change_percentage_24h: 1.85,
        market_cap_change_24h: 24500000000,
        market_cap_change_percentage_24h: 1.89,
        circulating_supply: 19650000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        ath_change_percentage: -2.3,
        ath_date: "2021-11-10T14:24:11.849Z",
        atl: 67.81,
        atl_change_percentage: 99350,
        atl_date: "2013-07-05T00:00:00.000Z",
        roi: null,
        last_updated: new Date().toISOString()
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 3540,
        market_cap: 425000000000,
        market_cap_rank: 2,
        fully_diluted_valuation: 425000000000,
        total_volume: 15200000000,
        high_24h: 3580,
        low_24h: 3420,
        price_change_24h: 85,
        price_change_percentage_24h: 2.46,
        market_cap_change_24h: 10200000000,
        market_cap_change_percentage_24h: 2.46,
        circulating_supply: 120100000,
        total_supply: 120100000,
        max_supply: null,
        ath: 4878,
        ath_change_percentage: -27.4,
        ath_date: "2021-11-10T14:24:19.604Z",
        atl: 0.432,
        atl_change_percentage: 819500,
        atl_date: "2015-10-20T00:00:00.000Z",
        roi: {
          times: 85.5,
          currency: "btc",
          percentage: 8550
        },
        last_updated: new Date().toISOString()
      },
      {
        id: "solana",
        symbol: "sol",
        name: "Solana",
        image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        current_price: 178,
        market_cap: 82500000000,
        market_cap_rank: 3,
        fully_diluted_valuation: 104000000000,
        total_volume: 3200000000,
        high_24h: 182,
        low_24h: 172,
        price_change_24h: 4.2,
        price_change_percentage_24h: 2.41,
        market_cap_change_24h: 1950000000,
        market_cap_change_percentage_24h: 2.42,
        circulating_supply: 463000000,
        total_supply: 583000000,
        max_supply: null,
        ath: 260,
        ath_change_percentage: -31.5,
        ath_date: "2021-11-06T21:54:35.825Z",
        atl: 0.5,
        atl_change_percentage: 35500,
        atl_date: "2020-05-11T19:35:23.449Z",
        roi: null,
        last_updated: new Date().toISOString()
      },
      {
        id: "binancecoin",
        symbol: "bnb",
        name: "BNB",
        image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
        current_price: 612,
        market_cap: 89500000000,
        market_cap_rank: 4,
        fully_diluted_valuation: 89500000000,
        total_volume: 1800000000,
        high_24h: 618,
        low_24h: 605,
        price_change_24h: 5.8,
        price_change_percentage_24h: 0.96,
        market_cap_change_24h: 850000000,
        market_cap_change_percentage_24h: 0.96,
        circulating_supply: 146200000,
        total_supply: 146200000,
        max_supply: 200500000,
        ath: 686,
        ath_change_percentage: -10.8,
        ath_date: "2021-05-10T07:24:17.097Z",
        atl: 0.0398,
        atl_change_percentage: 1538000,
        atl_date: "2017-10-19T00:00:00.000Z",
        roi: null,
        last_updated: new Date().toISOString()
      },
      {
        id: "cardano",
        symbol: "ada",
        name: "Cardano",
        image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        current_price: 0.452,
        market_cap: 16200000000,
        market_cap_rank: 5,
        fully_diluted_valuation: 20300000000,
        total_volume: 380000000,
        high_24h: 0.458,
        low_24h: 0.445,
        price_change_24h: 0.0052,
        price_change_percentage_24h: 1.16,
        market_cap_change_24h: 185000000,
        market_cap_change_percentage_24h: 1.16,
        circulating_supply: 35800000000,
        total_supply: 45000000000,
        max_supply: 45000000000,
        ath: 3.09,
        ath_change_percentage: -85.4,
        ath_date: "2021-09-02T06:00:10.474Z",
        atl: 0.0174,
        atl_change_percentage: 2500,
        atl_date: "2020-03-13T02:22:55.037Z",
        roi: null,
        last_updated: new Date().toISOString()
      }
    ];

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);
    const paginatedCoins = mockCoins.slice(startIndex, endIndex);

    res.json(paginatedCoins);
  } catch (error) {
    console.error("Coins API error:", error);
    res.status(500).json({ error: "Failed to fetch coins data" });
  }
});

// news endpoint - returns cryptocurrency news
app.get("/api/news", async (req, res) => {
  try {
    // For now, return mock news data
    // In production, you might want to integrate with a news API like CryptoCompare or NewsAPI
    const mockNews = [
      {
        id: 1,
        title: "Bitcoin Surges Past $67,000 as Institutional Adoption Grows",
        summary: "Major financial institutions continue to show increased interest in Bitcoin, driving prices higher amid positive market sentiment.",
        url: "https://example.com/bitcoin-surges",
        image: "https://example.com/bitcoin-image.jpg",
        publishedAt: new Date().toISOString(),
        source: "CryptoNews"
      },
      {
        id: 2,
        title: "Ethereum 2.0 Upgrade Shows Promising Results in Testnet",
        summary: "The latest Ethereum network upgrade demonstrates significant improvements in transaction speeds and energy efficiency.",
        url: "https://example.com/ethereum-upgrade",
        image: "https://example.com/ethereum-image.jpg",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: "BlockChain Today"
      },
      {
        id: 3,
        title: "DeFi Protocols See Record TVL as New Users Join Ecosystem",
        summary: "Decentralized finance platforms are experiencing unprecedented growth with total value locked reaching new all-time highs.",
        url: "https://example.com/defi-growth",
        image: "https://example.com/defi-image.jpg",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: "DeFi Pulse"
      },
      {
        id: 4,
        title: "Central Banks Consider Digital Currency Implementation",
        summary: "Multiple countries are advancing their central bank digital currency projects, potentially reshaping global finance.",
        url: "https://example.com/cbdc-progress",
        image: "https://example.com/cbdc-image.jpg",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: "Financial Times"
      },
      {
        id: 5,
        title: "Layer 2 Solutions Drive Ethereum Scalability Forward",
        summary: "Innovative layer 2 scaling solutions are addressing Ethereum's network congestion issues effectively.",
        url: "https://example.com/layer2-solutions",
        image: "https://example.com/layer2-image.jpg",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: "Ethereum Foundation"
      }
    ];

    res.json(mockNews);
  } catch (error) {
    console.error("News API error:", error);
    res.status(500).json({ error: "Failed to fetch news data" });
  }
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pro", proTradingRoutes);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

// ================= USER PROFILE ENDPOINT =================
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await require("./models/User").findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        name: user.name || "",
        kycVerified: user.kycVerified || false,
        kycStatus: user.kycStatus || "not_started",
        balance: user.balance || 0,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================= CREATE SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  path: "/socket.io"
});

// Store global reference for use in controllers
global.io = io;

// Connection handler
io.on("connection", (socket) => {
  console.log("Socket.io client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Socket.io client disconnected:", socket.id);
  });
});

emitter.on("trade", (trade) => {
  io.emit("trade", trade);
});

emitter.on("orderbook", (data) => {
  io.emit("orderbook", data);
});

const trackedPairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LTC/USDT", "ADA/USDT"];
const coinGeckoIds = {
  "BTC/USDT": "bitcoin",
  "ETH/USDT": "ethereum",
  "SOL/USDT": "solana",
  "LTC/USDT": "litecoin",
  "ADA/USDT": "cardano"
};
const fallbackPrices = {
  "BTC/USDT": 95000,
  "ETH/USDT": 3200,
  "SOL/USDT": 180,
  "LTC/USDT": 120,
  "ADA/USDT": 0.45
};
const cachedMarketPrices = {};
let marketPricePollDelay = 15000;
const MIN_MARKET_POLL_DELAY = 15000;
const MAX_MARKET_POLL_DELAY = 60000;

async function fetchMarketPrices() {
  try {
    const ids = trackedPairs.map(pair => coinGeckoIds[pair]).join(',');
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids,
        vs_currencies: 'usd'
      },
      timeout: 8000,
    });

    trackedPairs.forEach((pair) => {
      const coinId = coinGeckoIds[pair];
      const price = data[coinId]?.usd;
      if (price) {
        cachedMarketPrices[pair] = Number(price);
      }
    });

    marketPricePollDelay = MIN_MARKET_POLL_DELAY;
  } catch (err) {
    const status = err?.response?.status;
    console.error("Price update poll failed:", err.message || err);
    if (status === 429) {
      marketPricePollDelay = Math.min(marketPricePollDelay * 2, MAX_MARKET_POLL_DELAY);
      console.warn(`CoinGecko rate limited, backing off to ${marketPricePollDelay}ms`);
    }
  }
}

async function scheduleMarketPriceFetch() {
  await fetchMarketPrices();
  setTimeout(scheduleMarketPriceFetch, marketPricePollDelay);
}

function emitPriceUpdates() {
  trackedPairs.forEach((pair) => {
    const price = cachedMarketPrices[pair] || fallbackPrices[pair];
    io.emit("priceUpdate", {
      pair,
      price: Number(price),
      time: Date.now(),
    });
  });
}

scheduleMarketPriceFetch();
setInterval(emitPriceUpdates, 1000);

// ================= ORDERBOOK UPDATES =================
global.orderbookCache = {};
global.tradesCache = {};
global.candlesCache = {};

async function emitOrderbookUpdates() {
  try {
    const popularPairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LTC/USDT", "ADA/USDT"];

    for (const pair of popularPairs) {
      try {
        const symbol = pair.replace("/", "");
        const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=18`;
        const response = await axios.get(url);
        const data = response.data;
        console.log(`Fetched orderbook for ${pair}:`, data); // Debug log
        if (!data.bids || !data.asks) throw new Error("Invalid orderbook response");

        const buy = data.bids.map(([price, amount]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
        }));
        const sell = data.asks.map(([price, amount]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
        }));

        const orderbook = { pair, buy, sell };
        global.orderbookCache[pair] = orderbook;
        emitter.emit("orderbook", orderbook);
      } catch (err) {
        console.error(`Failed to fetch orderbook for ${pair}:`, err.message || err);
        // Do not emit or fallback
      }
    }
  } catch (err) {
    console.error("Orderbook update error:", err.message || err);
  }
}

setInterval(emitOrderbookUpdates, 2000); // Update every 2 seconds

// ================= REDIS =================
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.connect()
  .then(() => console.log("⚡ Redis Connected"))
  .catch(err => console.log("Redis Error:", err));

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await ensureAdminUser();
  })
  .catch(err => console.log(err));

async function ensureAdminUser() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  try {
    const defaultAdminEmail = (process.env.DEFAULT_ADMIN_EMAIL || "admin@swancore.com").toLowerCase().trim();
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
    const User = require("./models/User");

    const existingAdmin = await User.findOne({ email: defaultAdminEmail });

    if (!existingAdmin) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);

      await User.create({
        email: defaultAdminEmail,
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        isVerified: true,
        balance: 0,
        frozenBalance: 0,
        isBanned: false,
        kycVerified: true,
        kycStatus: "approved"
      });

      console.log(`Default admin user created: ${defaultAdminEmail}`);
      console.log(`Use password: ${defaultAdminPassword}`);
    }
  } catch (err) {
    console.error("Error ensuring default admin user:", err);
  }
}

// ================= HELPERS =================
const parser = new Parser();
const ogCache = new Map();

function isValidImage(url) {
  return typeof url === "string" &&
    url.startsWith("http") &&
    !url.includes("placeholder") &&
    !url.includes("null");
}

const parseWithTimeout = (url) => {
  return Promise.race([
    parser.parseURL(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("RSS Timeout")), 8000)
    )
  ]);
};

// ================= AUTH LOGIN =================
const User = require("./models/User");
const {
  comparePassword,
  generateAccessToken,
  generateRefreshToken
} = require("./utils/auth");

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RSS =================
const RSS_FEEDS = [
  "https://beincrypto.com/feed/",
  "https://newsbtc.com/feed/",
  "https://dailyhodl.com/feed/",
  "https://cryptonews.com/news/feed/",
  "https://cryptopolitan.com/feed/",
  "https://www.finbold.com/feed/",
  "https://cryptoslate.com/feed/",
  "https://www.theblock.co/rss.xml"
];

// ================= OG =================
async function getOGData(url) {
  if (!url) return null;

  if (ogCache.has(url)) return ogCache.get(url);

  const redisKey = `og:${url}`;
  const cached = await redisClient.get(redisKey);

  if (cached) {
    const parsed = JSON.parse(cached);
    ogCache.set(url, parsed);
    return parsed;
  }

  try {
    const { result } = await ogs({ url });

    const data = {
      image: Array.isArray(result.ogImage)
        ? result.ogImage[0]?.url
        : result.ogImage?.url || null,
      description: result.ogDescription || null
    };

    ogCache.set(url, data);
    await redisClient.setEx(redisKey, 3600, JSON.stringify(data));

    return data;

  } catch {
    return null;
  }
}

// ================= FETCH NEWS =================
const fetchAllNews = async () => {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(feed => parseWithTimeout(feed))
    );

    let articles = [];

    results.forEach(result => {
      if (result.status === "fulfilled" && result.value?.items) {
        result.value.items.forEach(item => {
          articles.push({
            title: item.title || "",
            description: item.contentSnippet || "",
            url: item.link || "",
            image: item.enclosure?.url || null,
            source: result.value.title || "News",
            publishedAt: new Date(item.pubDate || 0).getTime()
          });
        });
      }
    });

    const enriched = [];

    for (const item of articles.slice(0, 50)) {
      const ogData = await getOGData(item.url);

      enriched.push({
        ...item,
        image: isValidImage(item.image)
          ? item.image
          : ogData?.image || null,
        description: item.description || ogData?.description || item.title
      });
    }

    return processNews(enriched);

  } catch (err) {
    console.log("RSS Error:", err.message);
    return [];
  }
};

// ================= STREAM =================
function startNewsStream() {
  console.log("📡 Live news stream started");

  setInterval(async () => {
    const data = await fetchAllNews();
    io.emit("news-update", data);
  }, 15000);
}

// ================= API =================
app.get("/api/news", async (req, res) => {
  const data = await fetchAllNews();
  res.json(data);
});

app.get("/api/coins", async (req, res) => {
  const fallbackCoins = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 78000,
      market_cap: 1500000000000,
      price_change_24h: 1200,
      price_change_percentage_24h: 1.56,
      total_volume: 32000000000,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3200,
      market_cap: 380000000000,
      price_change_24h: -40,
      price_change_percentage_24h: -1.23,
      total_volume: 12000000000,
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
      current_price: 540,
      market_cap: 83000000000,
      price_change_24h: 8,
      price_change_percentage_24h: 1.51,
      total_volume: 2200000000,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 170,
      market_cap: 83000000000,
      price_change_24h: 3.2,
      price_change_percentage_24h: 1.91,
      total_volume: 4300000000,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.48,
      market_cap: 17000000000,
      price_change_24h: -0.01,
      price_change_percentage_24h: -0.02,
      total_volume: 2400000000,
    },
  ];

  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
        },
        timeout: 7000,
      }
    );

    if (Array.isArray(data) && data.length > 0) {
      return res.json(data);
    }

    console.error("CoinGecko returned invalid data, using fallback list.");
  } catch (err) {
    console.error("Coin fetch failed:", err.message);
  }

  res.json(fallbackCoins);
});

app.get("/api/ping", (req, res) => {
  res.json({ success: true, source: "local" });
});

// ================= ORDERBOOK (FINAL) =================
app.get("/api/market/orderbook/:pair", (req, res) => {
  const pair = cleanPair(req.params.pair);
  const market = getMarket(pair);

  // Always sort before returning
  sortBook(market);

  // Force EXACT 17 levels each side
  const buy = market.buy.slice(0, 17).map(o => ({
    price: Number(o.price),
    amount: Number(o.amount)
  }));

  const sell = market.sell.slice(0, 17).map(o => ({
    price: Number(o.price),
    amount: Number(o.amount)
  }));

  res.json({ buy, sell });
});

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.send("OK");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
  startNewsStream();
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or set PORT to a different value.`);
  } else {
    console.error("Server error:", err);
  }
});
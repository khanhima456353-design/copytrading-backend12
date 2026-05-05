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

// routes
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// ================= MIDDLEWARE =================
const allowedOrigins = [
  "http://localhost:3000",
  "https://knowledge-ltd-annex-brand.trycloudflare.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
 
app.use(express.json());


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

function getMarket(pair) {
  if (!markets[pair]) {
    markets[pair] = { buy: [], sell: [], trades: [] };
  }
  return markets[pair];
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
app.get("/api/market/symbols", (req, res) => {
  res.json({ symbols: ["BTC/USDT"] });
});

// orderbook
app.get("/api/market/orderbook/:pair", (req, res) => {
  const pair = cleanPair(req.params.pair);
  res.json(getOrderBook(pair));
});

// trades
app.get("/api/market/trades/:pair", (req, res) => {
  const pair = cleanPair(req.params.pair);
  res.json(getTrades(pair));
});

// candles
app.get("/api/market/candles/:pair", (req, res) => {
  const pair = cleanPair(req.params.pair);
  const timeframe = req.query.timeframe || "1m";

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
    const time = trade.time; // FIXED

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

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ================= CREATE SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

emitter.on("trade", (trade) => {
  io.emit("trade", trade);
});

emitter.on("orderbook", (data) => {
  io.emit("orderbook", data);
});

// ================= REDIS =================
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.connect()
  .then(() => console.log("⚡ Redis Connected"))
  .catch(err => console.log("Redis Error:", err));

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

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
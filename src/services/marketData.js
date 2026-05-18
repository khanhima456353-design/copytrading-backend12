const axios = require("axios");

let symbols = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT"];
let currentPrice = 30000;

const priceMap = {};

const getValidPrice = (value) => Number.isFinite(value) && value > 0 ? value : 0;

const setCurrentPrice = (price) => {
  currentPrice = price;
};

const getBasePrice = (pair) => {
  return getValidPrice(priceMap[pair]) || getValidPrice(currentPrice);
};

const loadSymbols = async () => {
  try {
    const url = "https://api.kraken.com/0/public/AssetPairs";
    const response = await axios.get(url);
    const pairs = Object.keys(response.data.result).filter((pair) => pair.endsWith("USDT"));
    symbols = pairs.slice(0, 50).map((pair) => pair.replace("USDT", "/USDT"));
  } catch (error) {
    console.error("Error loading symbols:", error);
  }
};

const buildOrderBook = async (pair, levels = 18) => {
  const symbol = pair.replace("/", "");
  const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${levels}`;
  const response = await axios.get(url);
  const data = response.data;
  if (!data.bids || !data.asks) throw new Error("Invalid orderbook response");

  const buy = data.bids.map(([price, amount]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount),
  }));
  const sell = data.asks.map(([price, amount]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount),
  }));

  if (buy.length > 0 && sell.length > 0) {
    const mid = (buy[0].price + sell[0].price) / 2;
    const validMid = getValidPrice(mid);
    if (validMid > 0) priceMap[pair] = validMid;
  }

  return { buy, sell };
};

const buildTrades = async (pair, count = 40) => {
  const symbol = pair.replace("/", "");
  const url = `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${count}`;
  const response = await axios.get(url);
  const data = response.data;
  if (!Array.isArray(data)) throw new Error("Invalid trades response");

  const trades = data.map((trade) => ({
    time: Math.floor(trade.time / 1000),
    price: parseFloat(trade.price),
    amount: parseFloat(trade.qty),
    side: trade.isBuyerMaker ? "buy" : "sell",
  }));

  if (trades.length > 0) {
    const lastPrice = getValidPrice(trades[trades.length - 1].price);
    if (lastPrice > 0) priceMap[pair] = lastPrice;
  }

  return trades;
};

const buildCandles = async (pair, timeframe, limit = 80) => {
  const symbol = pair.replace("/", "");
  const interval = timeframe === "1m" ? "1m" : timeframe === "5m" ? "5m" : timeframe === "15m" ? "15m" : timeframe === "1h" ? "1h" : timeframe === "4h" ? "4h" : "1d";
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await axios.get(url);
  const data = response.data;
  if (!Array.isArray(data)) throw new Error("Invalid candles response");

  const candles = data.map(([time, open, high, low, close, volume]) => ({
    time: Math.floor(parseInt(time) / 1000),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
  }));

  if (candles.length > 0) {
    const lastClose = getValidPrice(candles[candles.length - 1].close);
    if (lastClose > 0) priceMap[pair] = lastClose;
  }

  return candles;
};

module.exports = {
  symbols,
  currentPrice,
  setCurrentPrice,
  getBasePrice,
  loadSymbols,
  buildOrderBook,
  buildTrades,
  buildCandles,
};

import axios from "axios";

const binanceClient = axios.create({ timeout: 2000 });

export let symbols = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT"];

export let currentPrice = 30000;

export const setCurrentPrice = (price: number) => {
  currentPrice = price;
};

const priceMap: Record<string, number> = {};

const timeframeSeconds: Record<string, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
};

const krakenPairs: Record<string, string> = {
  "BTC/USDT": "BTCUSDT",
  "ETH/USDT": "ETHUSDT",
  "BNB/USDT": "BNBUSDT",
  "SOL/USDT": "SOLUSDT",
  "ADA/USDT": "ADAUSDT",
};

const getKrakenPair = (pair: string) => krakenPairs[pair] || "BTCUSDT";
const getValidPrice = (value: number) => Number.isFinite(value) && value > 0 ? value : 0;

export const getBasePrice = (pair: string) => {
  return getValidPrice(priceMap[pair]) || getValidPrice(currentPrice);
};

export const loadSymbols = async () => {
  try {
    const url = "https://api.binance.com/api/v3/exchangeInfo";
    const response = await binanceClient.get(url);
    const pairs = (response.data.symbols || [])
      .filter((item: any) => typeof item.symbol === "string" && item.symbol.endsWith("USDT"))
      .map((item: any) => item.symbol.replace(/USDT$/, "/USDT"));
    symbols = pairs.slice(0, 50);
  } catch (error) {
    console.error("Error loading symbols:", error);
  }
};

// Load symbols on module load
loadSymbols();

export const buildOrderBook = async (pair: string, levels = 18) => {
  const symbol = pair.replace("/", "");
  const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${levels}`;
  const response = await binanceClient.get(url);
  const data = response.data;
  if (!data.bids || !data.asks) throw new Error("Invalid orderbook response");

  const buy = data.bids.map(([price, amount]: [string, string]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount),
  }));
  const sell = data.asks.map(([price, amount]: [string, string]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount),
  }));

  // Update price map with mid price
  if (buy.length > 0 && sell.length > 0) {
    const mid = (buy[0].price + sell[0].price) / 2;
    const validMid = getValidPrice(mid);
    if (validMid > 0) priceMap[pair] = validMid;
  }

  return { buy, sell };
};

export const buildTrades = async (pair: string, count = 40) => {
  const symbol = pair.replace("/", "");
  const url = `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${count}`;
  const response = await binanceClient.get(url);
  const data = response.data;
  if (!Array.isArray(data)) throw new Error("Invalid trades response");

  const trades = data.map((trade: any) => ({
    time: Math.floor(trade.time / 1000),
    price: parseFloat(trade.price),
    amount: parseFloat(trade.qty),
    side: trade.isBuyerMaker ? "buy" : "sell",
  }));

  // Update price map with last trade price
  if (trades.length > 0) {
    const lastPrice = getValidPrice(trades[trades.length - 1].price);
    if (lastPrice > 0) priceMap[pair] = lastPrice;
  }

  return trades;
};

export const buildCandles = async (pair: string, timeframe: string, limit = 80) => {
  const symbol = pair.replace("/", "");
  const interval = timeframe === "1m" ? "1m" : timeframe === "5m" ? "5m" : timeframe === "15m" ? "15m" : timeframe === "1h" ? "1h" : timeframe === "4h" ? "4h" : "1d";
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await binanceClient.get(url);
  const data = response.data;
  if (!Array.isArray(data)) throw new Error("Invalid candles response");

  const candles = data.map(([time, open, high, low, close, volume]: string[]) => ({
    time: Math.floor(parseInt(time) / 1000),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
  }));

  // Update price map with last close
  if (candles.length > 0) {
    const lastClose = getValidPrice(candles[candles.length - 1].close);
    if (lastClose > 0) priceMap[pair] = lastClose;
  }

  return candles;
};

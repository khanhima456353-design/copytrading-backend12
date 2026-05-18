"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCandles = exports.buildTrades = exports.buildOrderBook = exports.setCurrentPrice = exports.currentPrice = exports.symbols = void 0;
exports.symbols = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT"];
exports.currentPrice = 30000;
const setCurrentPrice = (price) => {
    exports.currentPrice = price;
};
exports.setCurrentPrice = setCurrentPrice;
const timeframeSeconds = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600,
    "4h": 14400,
    "1d": 86400,
};
const getBasePrice = (pair) => {
    switch (pair) {
        case "ETH/USDT":
            return exports.currentPrice / 15;
        case "BNB/USDT":
            return exports.currentPrice / 270;
        case "SOL/USDT":
            return exports.currentPrice / 1200;
        case "ADA/USDT":
            return exports.currentPrice / 25000;
        default:
            return exports.currentPrice;
    }
};
const buildOrderBook = (pair, levels = 18) => {
    const mid = getBasePrice(pair);
    const bids = [];
    const asks = [];
    for (let i = 0; i < levels; i++) {
        const delta = mid * (0.0008 + i * 0.0005);
        bids.push({ price: Number((mid - delta).toFixed(2)), amount: Number((Math.random() * 3 + 0.2).toFixed(3)) });
        asks.push({ price: Number((mid + delta).toFixed(2)), amount: Number((Math.random() * 3 + 0.2).toFixed(3)) });
    }
    return {
        buy: bids.sort((a, b) => b.price - a.price),
        sell: asks.sort((a, b) => a.price - b.price),
    };
};
exports.buildOrderBook = buildOrderBook;
const buildTrades = (pair, count = 40) => {
    const mid = getBasePrice(pair);
    const trades = [];
    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < count; i++) {
        const price = Number((mid + (Math.random() - 0.5) * mid * 0.003).toFixed(2));
        const amount = Number((Math.random() * 2 + 0.05).toFixed(4));
        trades.push({
            time: now - i * 15,
            price,
            amount,
            side: Math.random() > 0.5 ? "buy" : "sell",
        });
    }
    return trades;
};
exports.buildTrades = buildTrades;
const buildCandles = (pair, timeframe, limit = 80) => {
    const lastPrice = getBasePrice(pair);
    const step = timeframeSeconds[timeframe] ?? 60;
    const candles = [];
    let close = lastPrice;
    for (let i = limit - 1; i >= 0; i--) {
        const open = Number((close + (Math.random() - 0.5) * close * 0.002).toFixed(2));
        const high = Number(Math.max(open, close) + Math.random() * close * 0.0015).toFixed(2);
        const low = Number(Math.min(open, close) - Math.random() * close * 0.0015).toFixed(2);
        const volume = Number((Math.random() * 20 + 3).toFixed(2));
        const time = Math.floor(Date.now() / 1000) - i * step;
        candles.push({
            time,
            open: Number(open.toFixed(2)),
            high: Number(high),
            low: Number(low),
            close: Number(close.toFixed(2)),
            volume,
        });
        close = open;
    }
    return candles;
};
exports.buildCandles = buildCandles;

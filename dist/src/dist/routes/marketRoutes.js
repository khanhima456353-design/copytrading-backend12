"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketData_1 = require("../services/marketData");
const router = (0, express_1.Router)();
router.get("/symbols", (req, res) => {
    res.json({ symbols: marketData_1.symbols });
});
router.get("/orderbook/:pair", (req, res) => {
    const { pair } = req.params;
    const book = (0, marketData_1.buildOrderBook)(pair);
    res.json(book);
});
router.get("/trades/:pair", (req, res) => {
    const { pair } = req.params;
    const trades = (0, marketData_1.buildTrades)(pair);
    res.json(trades);
});
router.get("/candles/:pair", (req, res) => {
    const { pair } = req.params;
    const timeframe = String(req.query.timeframe || "1m");
    const candles = (0, marketData_1.buildCandles)(pair, timeframe, 80);
    res.json(candles);
});
exports.default = router;

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
    const cache = global.orderbookCache;
    if (!cache[pair]) {
        return res.status(503).json({ error: "No market data available" });
    }
    res.json(cache[pair]);
});
router.get("/trades/:pair", async (req, res) => {
    try {
        const { pair } = req.params;
        const trades = await (0, marketData_1.buildTrades)(pair);
        res.json(trades);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch trades" });
    }
});
router.get("/candles/:pair", async (req, res) => {
    try {
        const { pair } = req.params;
        const timeframe = String(req.query.timeframe || "1m");
        const candles = await (0, marketData_1.buildCandles)(pair, timeframe, 80);
        res.json(candles);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch candles" });
    }
});
exports.default = router;

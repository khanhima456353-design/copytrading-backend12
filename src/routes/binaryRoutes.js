const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const binaryService = require("../../services/binaryService");
const BinaryTrade = require("../../models/BinaryTrade");

router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { pair, direction, amount, duration } = req.body;
    if (!pair || !direction || !amount) {
      return res.status(400).json({ success: false, message: "pair, direction, and amount are required" });
    }
    const trade = await binaryService.placeBinaryTrade(req.userId, pair, direction.toUpperCase(), Number(amount), duration ? Number(duration) : undefined);
    binaryService.copyTradeToFollowers(trade).catch(err => console.error("[BinaryRoutes] copy error:", err.message));
    return res.status(201).json({ success: true, data: { trade } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const status = req.query.status || undefined;
    const trades = await binaryService.getUserBinaryTrades(req.userId, { limit, status });
    return res.json({ success: true, data: trades });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/active", authMiddleware, async (req, res) => {
  try {
    const trades = await binaryService.getActiveBinaryTrades(req.userId);
    return res.json({ success: true, data: trades });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/status/:tradeId", authMiddleware, async (req, res) => {
  try {
    const trade = await BinaryTrade.findOne({ tradeId: req.params.tradeId, userId: req.userId });
    if (!trade) {
      return res.status(404).json({ success: false, message: "Trade not found" });
    }
    return res.json({ success: true, data: { trade } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/config", async (req, res) => {
  try {
    const config = await binaryService.getBinaryConfig();
    return res.json({
      success: true,
      data: {
        ...config,
        validDurations: binaryService.VALID_DURATIONS,
        minAmount: binaryService.MIN_AMOUNT,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

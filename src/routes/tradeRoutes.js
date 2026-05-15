const express = require("express");
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require("../middleware/authMiddleware");
const {
  placeTrade,
  getTradeHistory,
  getTradeStats,
  getAllTrades,
  getActiveTrades,
  updateTradeResult
} = require("../controllers/tradeController");

const router = express.Router();

router.post("/place", authMiddleware, placeTrade);
router.get("/history", authMiddleware, getTradeHistory);
router.get("/stats", authMiddleware, getTradeStats);

router.get("/all", authMiddleware, adminMiddleware, getAllTrades);
router.get("/active", authMiddleware, adminMiddleware, getActiveTrades);
router.post("/update", authMiddleware, superAdminMiddleware, updateTradeResult);

module.exports = router;

import express from "express";
import {
  placeTrade,
  cancelTrade,
  getTradeHistory,
  getTradeStats
} from "../controllers/tradeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/place", authMiddleware, placeTrade);
router.post("/cancel", authMiddleware, cancelTrade);
router.get("/history", authMiddleware, getTradeHistory);
router.get("/stats", authMiddleware, getTradeStats);

export default router;
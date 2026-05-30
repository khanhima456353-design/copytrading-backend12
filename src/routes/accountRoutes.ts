import express from "express";
import type { Request, Response } from "express-serve-static-core";
import { authMiddleware } from "../middleware/authMiddleware";

// Use require for JS Mongoose models (no TypeScript declarations)
const User = require("../../models/User");
const Order = require("../../models/Order");
const Position = require("../../models/Position");
const Trade = require("../../models/Trade");

interface AuthRequest extends Request {
  userId?: string;
}

const router = express.Router();

// ─── GET /api/account/summary ────────────────────────────────────────────────
// Returns { available, locked, holdings }
// holdings are derived from closed buy trades (assets acquired)
router.get("/summary", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId).select("balance frozenBalance");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Locked = frozenBalance stored on user, or sum of open buy order totals
    const openBuyOrders = await Order.find({
      userId: req.userId,
      status: "open",
      side: "buy",
    });
    const lockedFromOrders = openBuyOrders.reduce(
      (sum: number, o: any) => sum + (o.total || (o.price || 0) * (o.amount || 0)),
      0
    );
    const locked = user.frozenBalance > 0 ? user.frozenBalance : lockedFromOrders;
    const available = Math.max(0, (user.balance || 0) - locked);

    // Derive holdings from closed trades grouped by base asset
    const closedTrades = await Trade.find({
      userId: req.userId,
      status: "closed",
    });

    const assetMap: Record<string, { amount: number; value: number }> = {};
    for (const t of closedTrades) {
      const base = t.pair ? t.pair.split("/")[0] : null;
      if (!base) continue;
      if (!assetMap[base]) assetMap[base] = { amount: 0, value: 0 };
      assetMap[base].amount += t.amount || 0;
      assetMap[base].value += (t.amount || 0) + (t.profit || 0);
    }

    const holdings = Object.entries(assetMap).map(([asset, data]) => ({
      asset,
      amount: parseFloat(data.amount.toFixed(6)),
      value: parseFloat(data.value.toFixed(2)),
    }));

    res.json({ available, locked, holdings });
  } catch (error) {
    console.error("Account summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/account/open-orders ────────────────────────────────────────────
// Returns array of open orders shaped for Trading.tsx
router.get("/open-orders", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({
      userId: req.userId,
      status: "open",
    }).sort({ createdAt: -1 });

    const normalized = orders.map((o: any) => ({
      orderId: o._id,
      pair: o.pair,
      type: o.type || "limit",
      side: o.side,
      price: o.price,
      amount: o.amount || o.quantity,
      status: o.status,
      stopLoss: o.stopPrice || null,
      takeProfit: null,
      createdAt: o.createdAt,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Open orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/account/positions ──────────────────────────────────────────────
// Returns open positions
router.get("/positions", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const positions = await Position.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });

    res.json(positions);
  } catch (error) {
    console.error("Positions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/account/balances ───────────────────────────────────────────────
// Returns per-asset balance map
router.get("/balances", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId).select("balance frozenBalance");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Derive crypto balances from closed trade history
    const closedTrades = await Trade.find({
      userId: req.userId,
      status: "closed",
    });

    const balances: Record<string, number> = {
      USDT: parseFloat((user.balance || 0).toFixed(2)),
    };

    for (const t of closedTrades) {
      const base = t.pair ? t.pair.split("/")[0] : null;
      if (!base || base === "USDT") continue;
      balances[base] = parseFloat(
        ((balances[base] || 0) + (t.amount || 0)).toFixed(6)
      );
    }

    res.json(balances);
  } catch (error) {
    console.error("Balances error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/account/recalculate-balances ──────────────────────────────────
// Syncs frozenBalance from open orders and returns fresh balance info
router.post("/recalculate-balances", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId).select("balance frozenBalance");
    if (!user) return res.status(404).json({ message: "User not found" });

    const openBuyOrders = await Order.find({
      userId: req.userId,
      status: "open",
      side: "buy",
    });

    const locked = openBuyOrders.reduce(
      (sum: number, o: any) => sum + (o.total || (o.price || 0) * (o.amount || 0)),
      0
    );

    // Update frozenBalance to reflect current open orders
    await User.findByIdAndUpdate(req.userId, { frozenBalance: locked });

    res.json({
      success: true,
      balance: user.balance || 0,
      locked,
      available: Math.max(0, (user.balance || 0) - locked),
    });
  } catch (error) {
    console.error("Recalculate balances error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

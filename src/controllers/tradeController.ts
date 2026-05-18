import type { Request, Response } from "express-serve-static-core";

// Use require for JS Mongoose models
const User  = require("../../models/User");
const Trade = require("../../models/Trade");

interface AuthRequest extends Request {
  userId?: string;
}

// ─── placeTrade ───────────────────────────────────────────────────────────────
export const placeTrade = async (req: AuthRequest, res: Response) => {
  try {
    const {
      pair,
      symbol,
      side,
      type,
      amount,
      price,
      stopLoss,
      takeProfit,
    } = req.body;

    const tradePair  = pair || symbol;
    const numAmount  = Number(amount);
    const userId     = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!tradePair || !numAmount || numAmount <= 0)
      return res.status(400).json({ message: "Invalid trade data: pair and amount are required" });
    if (!side)
      return res.status(400).json({ message: "Invalid trade data: side (buy/sell) is required" });

    // Atomic balance deduction — only succeeds when balance >= amount
    const user = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    );

    if (!user) {
      const exists = await User.exists({ _id: userId });
      return res.status(400).json({
        message: exists ? "Insufficient balance" : "User not found",
      });
    }

    const trade = await Trade.create({
      userId,
      pair:   String(tradePair),
      amount: numAmount,
      status: "pending",
      notes:  JSON.stringify({ side, type: type || "market", price, stopLoss, takeProfit }),
    });

    return res.json({ message: "Trade placed", trade, balance: user.balance });
  } catch (err: any) {
    console.error("placeTrade error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getTradeHistory ──────────────────────────────────────────────────────────
// Returns array directly so Trading.tsx Array.isArray() check passes
export const getTradeHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Normalise to the shape Trading.tsx expects
    const normalised = trades.map((t: any) => {
      let extra: any = {};
      try { extra = JSON.parse(t.notes || "{}"); } catch {}
      return {
        id:        t._id,
        pair:      t.pair,
        side:      extra.side   || "buy",
        type:      extra.type   || "market",
        price:     extra.price  || 0,
        amount:    t.amount,
        status:    t.status,
        profit:    t.profit     || 0,
        createdAt: t.createdAt,
        time:      Math.floor(new Date(t.createdAt).getTime() / 1000),
      };
    });

    return res.json(normalised);   // array — NOT { trades: [...] }
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── cancelTrade ──────────────────────────────────────────────────────────────
export const cancelTrade = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    if (!orderId)    return res.status(400).json({ message: "Missing orderId" });

    const trade = await Trade.findById(orderId);
    if (!trade) return res.json({ error: "order not found" });

    if (String(trade.userId) !== String(req.userId))
      return res.status(403).json({ message: "Forbidden" });

    if (trade.status === "closed" || trade.status === "cancelled")
      return res.status(400).json({ message: "Order cannot be cancelled" });

    trade.status = "cancelled";
    await trade.save();

    // Refund the balance
    await User.findByIdAndUpdate(req.userId, { $inc: { balance: trade.amount } });

    return res.json({ message: "Order cancelled", trade });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getTradeStats ────────────────────────────────────────────────────────────
export const getTradeStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const trades      = await Trade.find({ userId: req.userId });
    const totalTrades = trades.length;
    const totalProfit = trades.reduce((s: number, t: any) => s + (t.profit || 0), 0);
    const wins        = trades.filter((t: any) => (t.profit || 0) > 0).length;
    const winRate     = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    return res.json({ totalTrades, totalProfit, winRate: winRate.toFixed(2) + "%" });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

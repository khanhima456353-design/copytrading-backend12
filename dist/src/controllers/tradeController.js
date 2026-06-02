"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeStats = exports.cancelTrade = exports.getTradeHistory = exports.placeTrade = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// NOTE: this controller historically used Mongoose models; for place/cancel
// trades we now use Prisma to keep IDs and balances consistent with the
// Prisma data layer. Mongoose models are left unused for now.
const User = require("../../models/User");
const Trade = require("../../models/Trade");
// ─── placeTrade ───────────────────────────────────────────────────────────────
const placeTrade = async (req, res) => {
    try {
        const { pair, symbol, side, type, amount, price, stopLoss, takeProfit, } = req.body;
        const tradePair = pair || symbol;
        const numAmount = Number(amount);
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!tradePair || !numAmount || numAmount <= 0)
            return res.status(400).json({ message: "Invalid trade data: pair and amount are required" });
        if (!side)
            return res.status(400).json({ message: "Invalid trade data: side (buy/sell) is required" });
        // Load user from Prisma and check balance
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        if ((user.balance || 0) < numAmount)
            return res.status(400).json({ message: "Insufficient balance" });
        // Decrement balance then create trade via Prisma
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { balance: { decrement: numAmount } }
        });
        const trade = await prisma_1.default.trade.create({
            data: {
                userId,
                pair: String(tradePair),
                amount: numAmount,
                status: "pending",
                notes: JSON.stringify({ side, type: type || "market", price, stopLoss, takeProfit })
            }
        });
        return res.json({ message: "Trade placed", trade, balance: updatedUser.balance });
    }
    catch (err) {
        console.error("placeTrade error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.placeTrade = placeTrade;
// ─── getTradeHistory ──────────────────────────────────────────────────────────
// Returns array directly so Trading.tsx Array.isArray() check passes
const getTradeHistory = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 });
        // Normalise to the shape Trading.tsx expects
        const normalised = trades.map((t) => {
            let extra = {};
            try {
                extra = JSON.parse(t.notes || "{}");
            }
            catch { }
            return {
                id: t._id,
                pair: t.pair,
                side: extra.side || "buy",
                type: extra.type || "market",
                price: extra.price || 0,
                amount: t.amount,
                status: t.status,
                profit: t.profit || 0,
                createdAt: t.createdAt,
                time: Math.floor(new Date(t.createdAt).getTime() / 1000),
            };
        });
        return res.json(normalised); // array — NOT { trades: [...] }
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getTradeHistory = getTradeHistory;
// ─── cancelTrade ──────────────────────────────────────────────────────────────
const cancelTrade = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!orderId)
            return res.status(400).json({ message: "Missing orderId" });
        const trade = await prisma_1.default.trade.findUnique({ where: { id: orderId } });
        if (!trade)
            return res.status(404).json({ error: "order not found" });
        if (String(trade.userId) !== String(req.userId))
            return res.status(403).json({ message: "Forbidden" });
        if (trade.status === "closed" || trade.status === "cancelled")
            return res.status(400).json({ message: "Order cannot be cancelled" });
        const updatedTrade = await prisma_1.default.trade.update({
            where: { id: orderId },
            data: { status: "cancelled" }
        });
        // Refund the balance via Prisma
        await prisma_1.default.user.update({
            where: { id: req.userId },
            data: { balance: { increment: trade.amount } }
        });
        return res.json({ message: "Order cancelled", trade: updatedTrade });
    }
    catch (err) {
        console.error("cancelTrade error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.cancelTrade = cancelTrade;
// ─── getTradeStats ────────────────────────────────────────────────────────────
const getTradeStats = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        const trades = await Trade.find({ userId: req.userId });
        const totalTrades = trades.length;
        const totalProfit = trades.reduce((s, t) => s + (t.profit || 0), 0);
        const wins = trades.filter((t) => (t.profit || 0) > 0).length;
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        return res.json({ totalTrades, totalProfit, winRate: winRate.toFixed(2) + "%" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getTradeStats = getTradeStats;

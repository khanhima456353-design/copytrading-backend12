"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeStats = exports.cancelTrade = exports.getTradeHistory = exports.placeTrade = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const placeTrade = async (req, res) => {
    try {
        const { pair, amount } = req.body;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId }
        });
        if (!user || user.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const profit = Math.random() * 20 - 10;
        // Main user trade
        const trade = await prisma_1.default.trade.create({
            data: {
                userId: req.userId,
                pair: String(pair),
                amount: Number(amount),
                profit: Number(profit),
                status: "closed"
            }
        });
        // Update main user balance
        await prisma_1.default.user.update({
            where: { id: req.userId },
            data: {
                balance: user.balance - amount + profit
            }
        });
        // 🔥 COPY TRADING LOGIC
        const followers = await prisma_1.default.follow.findMany({
            where: {
                followingId: req.userId
            }
        });
        for (const f of followers) {
            const followerUser = await prisma_1.default.user.findUnique({
                where: { id: f.followerId }
            });
            if (!followerUser || followerUser.balance < amount)
                continue;
            const followerProfit = Math.random() * 20 - 10;
            await prisma_1.default.trade.create({
                data: {
                    userId: f.followerId,
                    pair: String(pair),
                    amount: Number(amount),
                    profit: Number(followerProfit),
                    status: "closed"
                }
            });
            await prisma_1.default.user.update({
                where: { id: f.followerId },
                data: {
                    balance: followerUser.balance - amount + followerProfit
                }
            });
        }
        res.json({
            message: "Trade placed",
            trade
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.placeTrade = placeTrade;
const getTradeHistory = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const trades = await prisma_1.default.trade.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            trades
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.getTradeHistory = getTradeHistory;
const cancelTrade = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!orderId) {
            return res.status(400).json({
                message: "Missing orderId"
            });
        }
        const trade = await prisma_1.default.trade.findUnique({
            where: { id: String(orderId) }
        });
        if (!trade) {
            return res.json({
                error: "order not found"
            });
        }
        if (trade.userId !== req.userId) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        if (trade.status === "closed" || trade.status === "cancelled") {
            return res.status(400).json({
                message: "Order cannot be cancelled"
            });
        }
        const cancelledTrade = await prisma_1.default.trade.update({
            where: { id: String(orderId) },
            data: { status: "cancelled" }
        });
        res.json({
            message: "Order cancelled",
            trade: cancelledTrade
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.cancelTrade = cancelTrade;
const getTradeStats = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const trades = await prisma_1.default.trade.findMany({
            where: { userId: req.userId }
        });
        const totalTrades = trades.length;
        const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
        const wins = trades.filter((t) => t.profit > 0).length;
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        res.json({
            totalTrades,
            totalProfit,
            winRate: winRate.toFixed(2) + "%"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.getTradeStats = getTradeStats;

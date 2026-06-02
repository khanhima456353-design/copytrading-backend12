"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactionHistory = exports.getAllTransactions = exports.getUserTransactions = exports.deductLoss = exports.addProfit = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Admin: Add profit to user account
const addProfit = async (req, res) => {
    try {
        const { userId, amount, description } = req.body;
        const amt = Number(amount);
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!Number.isFinite(amt) || amt <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // Update user balance
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                balance: {
                    increment: amt
                }
            }
        });
        // Create transaction record
        const transaction = await prisma_1.default.transaction.create({
            data: {
                userId,
                type: "profit",
                amount: amt,
                description: description || "Profit added by admin",
                createdBy: req.userId
            }
        });
        res.json({
            message: "Profit added successfully",
            userBalance: updatedUser.balance,
            transaction
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.addProfit = addProfit;
// Admin: Deduct loss from user account
const deductLoss = async (req, res) => {
    try {
        const { userId, amount, description } = req.body;
        const amt = Number(amount);
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!Number.isFinite(amt) || amt <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }
        const updateResult = await prisma_1.default.user.updateMany({
            where: { id: userId, balance: { gte: amt } },
            data: { balance: { decrement: amt } }
        });
        if (updateResult.count === 0) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const updatedUser = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!updatedUser) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        // Create transaction record
        const transaction = await prisma_1.default.transaction.create({
            data: {
                userId,
                type: "loss",
                amount: amt,
                description: description || "Loss deducted by admin",
                createdBy: req.userId
            }
        });
        res.json({
            message: "Loss deducted successfully",
            userBalance: updatedUser.balance,
            transaction
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.deductLoss = deductLoss;
// Get user's transaction history
const getUserTransactions = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const transactions = await prisma_1.default.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            transactions
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getUserTransactions = getUserTransactions;
// Admin: Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const transactions = await prisma_1.default.transaction.findMany({
            include: { user: { select: { id: true, email: true } } },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            transactions
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getAllTransactions = getAllTransactions;
// Admin: Get transactions for a specific user
const getUserTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const transactions = await prisma_1.default.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            transactions
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getUserTransactionHistory = getUserTransactionHistory;

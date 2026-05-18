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
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!amount || amount <= 0) {
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
                    increment: amount
                }
            }
        });
        // Create transaction record
        const transaction = await prisma_1.default.transaction.create({
            data: {
                userId,
                type: "profit",
                amount: Number(amount),
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
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.addProfit = addProfit;
// Admin: Deduct loss from user account
const deductLoss = async (req, res) => {
    try {
        const { userId, amount, description } = req.body;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!amount || amount <= 0) {
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
        if (user.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        // Update user balance
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });
        // Create transaction record
        const transaction = await prisma_1.default.transaction.create({
            data: {
                userId,
                type: "loss",
                amount: Number(amount),
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
        res.status(500).json({
            message: "Server error",
            error
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
        res.status(500).json({
            message: "Server error",
            error
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
        res.status(500).json({
            message: "Server error",
            error
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
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.getUserTransactionHistory = getUserTransactionHistory;

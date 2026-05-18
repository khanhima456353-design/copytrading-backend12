"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectDeposit = exports.approveDeposit = exports.getPendingDeposits = exports.getUserDeposits = exports.requestDeposit = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// User requests a deposit (creates pending deposit request)
const requestDeposit = async (req, res) => {
    try {
        const { amount, paymentMethod = "bank_transfer", notes } = req.body;
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
        const deposit = await prisma_1.default.deposit.create({
            data: {
                userId: req.userId,
                amount: Number(amount),
                paymentMethod,
                notes: notes || `User deposit request - Please send ${amount} to khanhima456353@gmail.com`,
                status: "pending"
            }
        });
        res.json({
            message: "Deposit request created. Please send the amount to khanhima456353@gmail.com",
            deposit
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.requestDeposit = requestDeposit;
// Get user's deposit history
const getUserDeposits = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const deposits = await prisma_1.default.deposit.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            deposits
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.getUserDeposits = getUserDeposits;
// Admin: Get all pending deposits
const getPendingDeposits = async (req, res) => {
    try {
        // TODO: Add admin verification middleware
        const deposits = await prisma_1.default.deposit.findMany({
            where: { status: "pending" },
            include: { user: { select: { id: true, email: true } } },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            deposits
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.getPendingDeposits = getPendingDeposits;
// Admin: Approve deposit and add funds to user account
const approveDeposit = async (req, res) => {
    try {
        const { depositId } = req.params;
        const { transactionRef } = req.body;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const deposit = await prisma_1.default.deposit.findUnique({
            where: { id: depositId },
            include: { user: true }
        });
        if (!deposit) {
            return res.status(404).json({
                message: "Deposit not found"
            });
        }
        if (deposit.status !== "pending") {
            return res.status(400).json({
                message: "Deposit is not pending"
            });
        }
        // Update deposit status
        const updatedDeposit = await prisma_1.default.deposit.update({
            where: { id: depositId },
            data: {
                status: "approved",
                approvedBy: req.userId,
                approvedAt: new Date(),
                transactionRef: transactionRef || undefined
            }
        });
        // Add funds to user's balance
        const updatedUser = await prisma_1.default.user.update({
            where: { id: deposit.userId },
            data: {
                balance: {
                    increment: deposit.amount
                }
            }
        });
        // Create transaction record
        await prisma_1.default.transaction.create({
            data: {
                userId: deposit.userId,
                type: "deposit",
                amount: deposit.amount,
                description: `Deposit approved - ${transactionRef || "Manual verification"}`,
                createdBy: req.userId
            }
        });
        res.json({
            message: "Deposit approved and funds added to user account",
            deposit: updatedDeposit,
            userBalance: updatedUser.balance
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.approveDeposit = approveDeposit;
// Admin: Reject deposit
const rejectDeposit = async (req, res) => {
    try {
        const { depositId } = req.params;
        const { reason } = req.body;
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const deposit = await prisma_1.default.deposit.findUnique({
            where: { id: depositId }
        });
        if (!deposit) {
            return res.status(404).json({
                message: "Deposit not found"
            });
        }
        const updatedDeposit = await prisma_1.default.deposit.update({
            where: { id: depositId },
            data: {
                status: "rejected",
                notes: reason || "Rejected by admin"
            }
        });
        res.json({
            message: "Deposit rejected",
            deposit: updatedDeposit
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.rejectDeposit = rejectDeposit;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.depositFunds = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const depositFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const depositAmount = Number(amount);
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
            return res.status(400).json({
                message: "Invalid deposit amount"
            });
        }
        const [, updatedUser] = await prisma_1.default.$transaction([
            prisma_1.default.deposit.create({
                data: {
                    userId: req.userId,
                    amount: depositAmount
                }
            }),
            prisma_1.default.user.update({
                where: { id: req.userId },
                data: {
                    balance: {
                        increment: depositAmount
                    }
                }
            })
        ]);
        res.json({
            message: "Deposit successful",
            balance: updatedUser.balance
        });
    }
    catch (error) {
        console.error(error);
        if (error?.code === "P2025") {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.depositFunds = depositFunds;
const getBalance = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId }
        });
        res.json({
            balance: user?.balance || 0
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getBalance = getBalance;

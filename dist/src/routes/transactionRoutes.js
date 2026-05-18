"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
// User routes
router.get("/my-transactions", authMiddleware_1.authMiddleware, transactionController_1.getUserTransactions);
// Admin routes
router.post("/add-profit", authMiddleware_1.authMiddleware, transactionController_1.addProfit);
router.post("/deduct-loss", authMiddleware_1.authMiddleware, transactionController_1.deductLoss);
router.get("/all-transactions", authMiddleware_1.authMiddleware, transactionController_1.getAllTransactions);
router.get("/:userId/history", authMiddleware_1.authMiddleware, transactionController_1.getUserTransactionHistory);
exports.default = router;

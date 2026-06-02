import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserTransactions, addProfit, deductLoss, getAllTransactions, getUserTransactionHistory } from "../controllers/transactionController";

const router = Router();

// User routes
router.get("/my-transactions", authMiddleware, getUserTransactions);

// Admin routes
router.post("/add-profit", authMiddleware, addProfit);
router.post("/deduct-loss", authMiddleware, deductLoss);
router.get("/all-transactions", authMiddleware, getAllTransactions);
router.get("/:userId/history", authMiddleware, getUserTransactionHistory);

export default router;

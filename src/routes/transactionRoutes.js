const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const {
  addProfit,
  deductLoss,
  getUserTransactions,
  getAllTransactions,
  getUserTransactionHistory
} = require("../controllers/transactionController");

const router = express.Router();

// User routes
router.get("/my-transactions", authMiddleware, getUserTransactions);

// Admin routes
router.post("/add-profit", authMiddleware, adminMiddleware, addProfit);
router.post("/deduct-loss", authMiddleware, adminMiddleware, deductLoss);
router.get("/all-transactions", authMiddleware, adminMiddleware, getAllTransactions);
router.get("/:userId/history", authMiddleware, adminMiddleware, getUserTransactionHistory);

module.exports = router;

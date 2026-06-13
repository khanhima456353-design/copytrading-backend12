const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const walletService = require("../services/walletService");
const User = require("../models/User");

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const wallet = await walletService.ensureWallet(req.user._id);

    return res.json({
      success: true,
      data: {
        availableBalance: wallet.availableBalance,
        lockedBalance: wallet.lockedBalance,
        totalBalance: wallet.totalBalance,
        balance: wallet.totalBalance,
        frozenBalance: wallet.lockedBalance,
        currency: wallet.currency,
        userId: wallet.userId,
        balances: wallet.balances || {},
      },
    });
  } catch (error) {
    console.error("Wallet GET / error:", error);
    return res.status(400).json({ success: false, message: error.message, stack: error.stack });
  }
});

router.post("/deposit", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const { userId, amount, description } = req.body;
    if (!userId || amount == null || !description) {
      return res.status(400).json({
        success: false,
        message: "userId, amount, and description are required",
      });
    }

    await walletService.ensureWallet(userId);
    const wallet = await walletService.creditBalance(userId, Number(amount), description, "deposit");
    return res.json({
      success: true,
      data: {
        availableBalance: wallet.availableBalance,
        lockedBalance: wallet.lockedBalance,
        totalBalance: wallet.totalBalance,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/transactions", authenticateUser, async (req, res) => {
  try {
    const transactions = await walletService.getUserTransactions(req.user._id);
    return res.json({ success: true, data: { transactions } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

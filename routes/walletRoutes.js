const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const walletService = require("../services/walletService");
const User = require("../models/User");

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("balance frozenBalance");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const availableBalance = Math.max(0, Number(user.balance || 0) - Number(user.frozenBalance || 0));
    const lockedBalance = Math.max(0, Number(user.frozenBalance || 0));
    const totalBalance = Number(user.balance || 0);

    const wallet = await walletService.ensureWallet(req.user._id);
    wallet.availableBalance = availableBalance;
    wallet.lockedBalance = lockedBalance;
    await wallet.save();

    return res.json({
      success: true,
      data: {
        availableBalance,
        lockedBalance,
        totalBalance,
        balance: totalBalance,
        frozenBalance: lockedBalance,
        currency: wallet.currency,
        userId: wallet.userId,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
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

const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const earnService = require("../services/earnService");
const walletService = require("../services/walletService");

const router = express.Router();

router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 0.01) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const wallet = await walletService.ensureWallet(req.userId);
    if ((wallet.availableBalance || 0) < amount) {
      return res.status(400).json({ success: false, message: "Insufficient available balance" });
    }

    await walletService.debitBalance(req.userId, amount, `Stake ${amount} USDT for 45-day Earn`, "trade");
    const stake = await earnService.createStake(req.userId, amount);

    return res.json({ success: true, data: { stake } });
  } catch (error) {
    console.error("Earn create error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/stakes", authenticateUser, async (req, res) => {
  try {
    const stakes = await earnService.getStakes(req.userId);
    return res.json({ success: true, data: { stakes } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/earnings/:stakeId", authenticateUser, async (req, res) => {
  try {
    const earnings = await earnService.getEarnings(req.params.stakeId, req.userId);
    return res.json({ success: true, data: { earnings } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/summary", authenticateUser, async (req, res) => {
  try {
    const summary = await earnService.getSummary(req.userId);
    return res.json({ success: true, data: { summary } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/tiers", async (req, res) => {
  try {
    return res.json({ success: true, data: { tiers: earnService.TIERS, durationDays: earnService.DURATION_DAYS } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

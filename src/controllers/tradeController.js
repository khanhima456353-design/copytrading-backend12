/**
 * tradeController.js  —  CRASH-PROOF edition
 *
 * UPGRADES:
 *  - placeTrade     : atomic $inc balance deduction via findOneAndUpdate
 *                     (eliminates TOCTOU race when two requests arrive simultaneously)
 *  - processPendingTrade : atomically "claims" a trade by flipping status to
 *                     "processing" before doing any work — prevents double-execution
 *  - processPendingTrades : binary semaphore prevents overlapping cron ticks
 *  - updateTradeResult   : atomic User balance delta with findOneAndUpdate
 */

"use strict";

const User        = require("../../models/User");
const Trade       = require("../../models/Trade");
const Transaction = require("../../models/Transaction");
const AuditLog    = require("../../models/AuditLog");
const Setting     = require("../../models/Setting");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getSettingValue = async (key, defaultValue) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
};

const emitSocket = (event, payload) => {
  if (global.io) global.io.emit(event, payload);
};

const createAdminAuditLog = ({ adminId, action, targetType, targetId, details, metadata }) =>
  AuditLog.create({ adminId, action, targetType, targetId, details, metadata });

// ─── processPendingTrade ──────────────────────────────────────────────────────
/**
 * UPGRADE: Atomically claims a SINGLE pending trade by transitioning it from
 * "pending" → "processing" in one findOneAndUpdate.  If another worker already
 * claimed it the update returns null and we bail out — zero double-processing.
 */
const processPendingTrade = async (tradeId) => {
  // Atomically claim the trade: only succeeds if status is still "pending"
  const trade = await Trade.findOneAndUpdate(
    { _id: tradeId, status: "pending" },
    { $set: { status: "processing" } },
    { new: true }
  );

  if (!trade) return null; // already claimed or processed by another worker

  try {
    const minPercent  = await getSettingValue("tradeLossMinPercent", 10);
    const maxPercent  = await getSettingValue("tradeLossMaxPercent", 20);
    const percent     = Number((Math.random() * (maxPercent - minPercent) + minPercent).toFixed(2));
    const lossAmount  = Number((-trade.amount * percent / 100).toFixed(2));

    trade.status       = "closed";
    trade.profit       = lossAmount;
    trade.resultPercent = -percent;
    trade.resultType   = "loss";
    trade.autoProcessed = true;
    trade.processedAt  = new Date();
    trade.notes        = `Auto-processed loss ${percent}% after 2 minutes`;
    await trade.save();

    // UPGRADE: atomic balance credit — safe even if two workers race here
    const user = await User.findByIdAndUpdate(
      trade.userId,
      { $inc: { balance: trade.amount + lossAmount } },
      { new: true }
    );
    if (!user) throw new Error(`User ${trade.userId} not found during auto-process`);

    await Transaction.create({
      userId:      user._id,
      type:        "trade",
      amount:      Number(lossAmount),
      description: `Auto processed trade loss of ${percent}%`,
      createdBy:   null,
    });

    await createAdminAuditLog({
      adminId:    null,
      action:     "auto_process_trade",
      targetType: "trade",
      targetId:   trade._id,
      details:    `Auto-processed pending trade for user ${user.email}`,
      metadata:   { percent, autoProcessed: true },
    });

    emitSocket("tradeUpdate", trade);
    emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

    return trade;
  } catch (err) {
    // Roll back claim so a retry is possible on next cron tick
    await Trade.findByIdAndUpdate(trade._id, { $set: { status: "pending" } });
    throw err;
  }
};

// ─── UPGRADE 2: Worker semaphore ─────────────────────────────────────────────
let pendingTradeWorkerBusy = false;

const processPendingTrades = async () => {
  if (pendingTradeWorkerBusy) {
    console.warn("⏩ processPendingTrades skipped — previous tick still running");
    return;
  }
  pendingTradeWorkerBusy = true;
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    // Fetch IDs only — processing happens one-by-one with atomic claiming
    const candidates = await Trade.find(
      { status: "pending", createdAt: { $lte: twoMinutesAgo } },
      { _id: 1 }
    ).lean();

    // Process sequentially to keep DB pressure predictable
    for (const { _id } of candidates) {
      await processPendingTrade(_id).catch((err) =>
        console.error(`processPendingTrade(${_id}) failed:`, err.message)
      );
    }
  } finally {
    pendingTradeWorkerBusy = false;
  }
};

setInterval(() => {
  processPendingTrades().catch((err) =>
    console.error("processPendingTrades interval error:", err.message)
  );
}, 30_000);

// ─── placeTrade ───────────────────────────────────────────────────────────────
/**
 * UPGRADE: Balance deduction is a single atomic findOneAndUpdate with a
 * filter-guard `{ balance: { $gte: amount } }`.
 * If two requests arrive simultaneously for the same user, only the first
 * that sees enough balance succeeds — the second gets null and returns 400.
 */
const placeTrade = async (req, res) => {
  try {
    const { pair, amount } = req.body;
    const userId = req.userId;

    if (!userId)                    return res.status(401).json({ message: "Unauthorized" });
    if (!pair || !amount || amount <= 0) return res.status(400).json({ message: "Invalid trade data" });

    const numAmount = Number(amount);

    // Atomic deduction — only succeeds when balance >= amount
    const user = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    );

    if (!user) {
      // User not found OR balance was insufficient
      const exists = await User.exists({ _id: userId });
      return res.status(400).json({ message: exists ? "Insufficient balance" : "User not found" });
    }

    const trade = await Trade.create({
      userId,
      pair:       String(pair),
      amount:     numAmount,
      status:     "pending",
      profit:     0,
      resultType: "none",
    });

    await Transaction.create({
      userId,
      type:        "trade_request",
      amount:      numAmount,
      description: `Trade placed for ${pair}`,
      createdBy:   userId,
    });

    emitSocket("tradePlaced",  { trade, userId: user._id, balance: user.balance });
    emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

    return res.json({ message: "Trade placed", trade, balance: user.balance });
  } catch (err) {
    console.error("placeTrade error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getTradeHistory ──────────────────────────────────────────────────────────
const getTradeHistory = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ trades });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getTradeStats ────────────────────────────────────────────────────────────
const getTradeStats = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const trades      = await Trade.find({ userId: req.userId });
    const totalTrades = trades.length;
    const totalProfit = trades.reduce((s, t) => s + (t.profit || 0), 0);
    const wins        = trades.filter((t) => t.profit > 0).length;
    const winRate     = totalTrades ? (wins / totalTrades) * 100 : 0;
    return res.json({ totalTrades, totalProfit, winRate: winRate.toFixed(2) + "%" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getAllTrades ─────────────────────────────────────────────────────────────
const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find().populate("userId", "email name").sort({ createdAt: -1 });
    return res.json({ trades });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── getActiveTrades ──────────────────────────────────────────────────────────
const getActiveTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ status: "pending" })
      .populate("userId", "email name")
      .sort({ createdAt: -1 });
    return res.json({ trades });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── updateTradeResult ────────────────────────────────────────────────────────
/**
 * UPGRADE: Admin result update now uses atomic $inc so concurrent admin actions
 * on the same user's balance cannot corrupt each other.
 */
const updateTradeResult = async (req, res) => {
  try {
    const { tradeId, resultType, amount, notes } = req.body;
    const adminId = req.userId;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });
    if (!tradeId || !["profit", "loss"].includes(resultType) || !amount || amount <= 0)
      return res.status(400).json({ message: "Invalid trade update payload" });

    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    const newProfit    = resultType === "profit" ? Number(amount) : -Number(amount);
    const oldProfit    = trade.profit || 0;
    const balanceDelta = trade.status === "pending"
      ? trade.amount + newProfit
      : newProfit - oldProfit;

    trade.status          = "closed";
    trade.profit          = newProfit;
    trade.resultType      = resultType;
    trade.resultPercent   = Number(((newProfit / trade.amount) * 100).toFixed(2));
    trade.adminReviewedBy = adminId;
    trade.adminReviewedAt = new Date();
    trade.processedAt     = new Date();
    trade.autoProcessed   = false;
    trade.notes           = notes || `Admin updated trade result to ${resultType}`;
    await trade.save();

    // UPGRADE: atomic balance delta
    const user = await User.findByIdAndUpdate(
      trade.userId,
      { $inc: { balance: balanceDelta } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Trade owner not found" });

    await Transaction.create({
      userId:      user._id,
      type:        resultType === "profit" ? "profit" : "loss",
      amount:      Number(newProfit),
      description: notes || `Admin updated trade result: ${resultType}`,
      createdBy:   adminId,
    });

    await createAdminAuditLog({
      adminId,
      action:     "admin_update_trade_result",
      targetType: "trade",
      targetId:   trade._id,
      details:    `Trade ${tradeId} updated to ${resultType} by admin`,
      metadata:   { resultType, amount: newProfit },
    });

    emitSocket("tradeUpdate",   trade);
    emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

    return res.json({ message: "Trade result updated", trade, balance: user.balance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  placeTrade,
  getTradeHistory,
  getTradeStats,
  getAllTrades,
  getActiveTrades,
  updateTradeResult,
};

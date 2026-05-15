const User = require("../../models/User");
const Trade = require("../../models/Trade");
const Transaction = require("../../models/Transaction");
const AuditLog = require("../../models/AuditLog");
const Setting = require("../../models/Setting");

const getSettingValue = async (key, defaultValue) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
};

const emitSocket = (event, payload) => {
  if (global.io) {
    global.io.emit(event, payload);
  }
};

const createAdminAuditLog = async ({ adminId, action, targetType, targetId, details, metadata }) => {
  return AuditLog.create({ adminId, action, targetType, targetId, details, metadata });
};

const processPendingTrade = async (trade) => {
  if (!trade || trade.status !== "pending") return null;

  const minPercent = await getSettingValue("tradeLossMinPercent", 10);
  const maxPercent = await getSettingValue("tradeLossMaxPercent", 20);
  const percent = Number((Math.random() * (maxPercent - minPercent) + minPercent).toFixed(2));
  const lossAmount = Number((-trade.amount * percent / 100).toFixed(2));

  trade.status = "closed";
  trade.profit = lossAmount;
  trade.resultPercent = -percent;
  trade.resultType = "loss";
  trade.autoProcessed = true;
  trade.processedAt = new Date();
  trade.notes = `Auto-processed loss ${percent}% after 2 minutes`;
  await trade.save();

  const user = await User.findById(trade.userId);
  if (!user) return trade;

  user.balance = (user.balance || 0) + trade.amount + lossAmount;
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: "trade",
    amount: Number(lossAmount),
    description: `Auto processed trade loss of ${percent}%`,
    createdBy: null
  });

  await createAdminAuditLog({
    adminId: null,
    action: "auto_process_trade",
    targetType: "trade",
    targetId: trade._id,
    details: `Auto-processed pending trade for user ${user.email}`,
    metadata: { percent, autoProcessed: true }
  });

  emitSocket("tradeUpdate", trade);
  emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

  return trade;
};

const processPendingTrades = async () => {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const pendingTrades = await Trade.find({ status: "pending", createdAt: { $lte: twoMinutesAgo } });
  await Promise.all(pendingTrades.map(processPendingTrade));
};

setInterval(() => {
  processPendingTrades().catch((err) => console.error("Error processing pending trades:", err));
}, 30 * 1000);

const placeTrade = async (req, res) => {
  try {
    const { pair, amount } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!pair || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid trade data" });
    }

    const user = await User.findById(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= Number(amount);
    await user.save();

    const trade = await Trade.create({
      userId,
      pair: String(pair),
      amount: Number(amount),
      status: "pending",
      profit: 0,
      resultType: "none"
    });

    await Transaction.create({
      userId,
      type: "trade_request",
      amount: Number(amount),
      description: `Trade placed for ${pair}`,
      createdBy: userId
    });

    emitSocket("tradePlaced", { trade, userId: user._id, balance: user.balance });
    emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

    res.json({ message: "Trade placed", trade, balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTradeHistory = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const trades = await Trade.find({ userId }).sort({ createdAt: -1 });
    res.json({ trades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTradeStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const trades = await Trade.find({ userId });
    const totalTrades = trades.length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const wins = trades.filter((t) => t.profit > 0).length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    res.json({ totalTrades, totalProfit, winRate: winRate.toFixed(2) + "%" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find()
      .populate("userId", "email name")
      .sort({ createdAt: -1 });
    res.json({ trades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActiveTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ status: "pending" })
      .populate("userId", "email name")
      .sort({ createdAt: -1 });
    res.json({ trades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTradeResult = async (req, res) => {
  try {
    const { tradeId, resultType, amount, notes } = req.body;
    const adminId = req.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!tradeId || !resultType || !["profit", "loss"].includes(resultType) || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid trade update payload" });
    }

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    const user = await User.findById(trade.userId);
    if (!user) {
      return res.status(404).json({ message: "Trade owner not found" });
    }

    const newProfit = resultType === "profit" ? Number(amount) : -Number(amount);
    const oldProfit = trade.profit || 0;
    const balanceDelta = trade.status === "pending"
      ? trade.amount + newProfit
      : newProfit - oldProfit;

    trade.status = "closed";
    trade.profit = newProfit;
    trade.resultType = resultType;
    trade.resultPercent = Number(((newProfit / trade.amount) * 100).toFixed(2));
    trade.adminReviewedBy = adminId;
    trade.adminReviewedAt = new Date();
    trade.processedAt = new Date();
    trade.autoProcessed = false;
    trade.notes = notes || `Admin updated trade result to ${resultType}`;
    await trade.save();

    user.balance = (user.balance || 0) + balanceDelta;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: resultType === "profit" ? "profit" : "loss",
      amount: Number(newProfit),
      description: notes || `Admin updated trade result: ${resultType}`,
      createdBy: adminId
    });

    await createAdminAuditLog({
      adminId,
      action: "admin_update_trade_result",
      targetType: "trade",
      targetId: trade._id,
      details: `Trade ${tradeId} updated to ${resultType} by admin`,
      metadata: { resultType, amount: newProfit }
    });

    emitSocket("tradeUpdate", trade);
    emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });

    res.json({ message: "Trade result updated", trade, balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  placeTrade,
  getTradeHistory,
  getTradeStats,
  getAllTrades,
  getActiveTrades,
  updateTradeResult
};

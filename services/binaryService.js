const mongoose = require("mongoose");
const BinaryTrade = require("../models/BinaryTrade");
const Wallet = require("../models/Wallet");
const Setting = require("../models/Setting");
const walletService = require("./walletService");

const VALID_DURATIONS = [30, 60, 120, 300];
const MIN_AMOUNT = 500;

const NO_ADMIN_TIERS = [
  { max: 9999, duration: 30 },
  { max: 49999, duration: 120 },
  { max: 99999, duration: 160 },
  { max: Infinity, duration: 180 },
];

const ADMIN_TIERS = [
  { max: 9999, profitPercent: 10 },
  { max: 99999, profitPercent: 30 },
  { max: 149999, profitPercent: 50 },
  { max: 199999, profitPercent: 70 },
  { max: 249999, profitPercent: 80 },
  { max: Infinity, profitPercent: 100 },
];

let getPrice = () => null;
let io = null;
let isMonitorRunning = false;

function startMonitor(opts) {
  getPrice = opts.getPrice || getPrice;
  io = opts.io || null;
  if (isMonitorRunning) return;
  isMonitorRunning = true;
  setInterval(tick, 2000);
}

async function getBinaryConfig() {
  try {
    const adminModeSetting = await Setting.findOne({ key: "binary_admin_mode" });
    const winRateSetting = await Setting.findOne({ key: "binary_win_rate" });
    return {
      adminModeEnabled: adminModeSetting ? !!adminModeSetting.value : false,
      winRate: winRateSetting ? Number(winRateSetting.value) : 0,
    };
  } catch {
    return { adminModeEnabled: false, winRate: 0 };
  }
}

function getNoAdminDuration(amount) {
  for (const tier of NO_ADMIN_TIERS) {
    if (amount <= tier.max) return tier.duration;
  }
  return 180;
}

function getAdminProfitPercent(amount) {
  for (const tier of ADMIN_TIERS) {
    if (amount <= tier.max) return tier.profitPercent;
  }
  return 100;
}

function determineOutcome(config) {
  if (!config.adminModeEnabled) return "lost";
  if (config.winRate <= 0) return "lost";
  if (config.winRate >= 100) return "won";
  return Math.random() * 100 < config.winRate ? "won" : "lost";
}

function computeExpiryPrice(entryPrice, direction, outcome) {
  const movement = entryPrice * (0.001 + Math.random() * 0.004);
  if (outcome === "won") {
    return direction === "HIGHER" ? entryPrice + movement : entryPrice - movement;
  }
  return direction === "HIGHER" ? entryPrice - movement : entryPrice + movement;
}

async function settleBinaryTrade(trade) {
  try {
    if (trade.status !== "pending") return;

    const expiryPrice = computeExpiryPrice(trade.entryPrice, trade.direction, trade.isWinDetermined ? "won" : "lost");

    let status = trade.isWinDetermined ? "won" : "lost";
    let profit = 0;
    let payoutAmount = 0;

    if (status === "won") {
      profit = Math.round(trade.amount * trade.profitPercent / 100);
      payoutAmount = trade.amount + profit;
    }

    try {
      await walletService.unlockBalance(trade.userId, trade.amount, payoutAmount > 0 ? payoutAmount - trade.amount : -trade.amount, trade._id.toString());
    } catch (err) {
      console.error(`[BinaryService] unlock error for trade ${trade._id}:`, err.message);
      return;
    }

    trade.expiryPrice = expiryPrice;
    trade.status = status;
    trade.profit = status === "won" ? profit : -trade.amount;
    trade.payoutAmount = payoutAmount;
    trade.settledAt = new Date();
    await trade.save();

    if (io) {
      io.to(`user:${trade.userId}`).emit("binarySettled", {
        tradeId: trade.tradeId,
        pair: trade.pair,
        direction: trade.direction,
        amount: trade.amount,
        entryPrice: trade.entryPrice,
        expiryPrice,
        status,
        profit: trade.profit,
        payoutAmount,
        isCopyTrade: trade.isCopyTrade,
      });
    }
  } catch (err) {
    console.error(`[BinaryService] settle error for trade ${trade._id}:`, err.message);
  }
}

async function placeBinaryTrade(userId, pair, direction, amount, duration) {
  if (!userId || !pair || !direction || !amount) {
    throw new Error("userId, pair, direction, and amount are required");
  }
  if (!["HIGHER", "LOWER"].includes(direction)) {
    throw new Error("direction must be HIGHER or LOWER");
  }
  if (amount < MIN_AMOUNT) {
    throw new Error(`Minimum amount is ${MIN_AMOUNT} USDT`);
  }

  const entryPrice = typeof getPrice === "function" ? getPrice(pair) : null;
  if (!entryPrice || entryPrice <= 0) {
    throw new Error("No price available for this pair");
  }

  const wallet = await walletService.ensureWallet(userId);
  if (wallet.availableBalance < amount) {
    throw new Error("Insufficient available balance");
  }

  const config = await getBinaryConfig();
  const adminMode = config.adminModeEnabled;

  let expiryDuration;
  if (adminMode) {
    if (!duration || !VALID_DURATIONS.includes(duration)) {
      throw new Error(`Duration must be one of: ${VALID_DURATIONS.join(", ")}`);
    }
    expiryDuration = duration;
  } else {
    expiryDuration = getNoAdminDuration(amount);
  }

  const outcome = determineOutcome(config);
  const profitPercent = adminMode && outcome === "won" ? getAdminProfitPercent(amount) : 0;
  const isWinDetermined = outcome === "won";

  const expiresAt = new Date(Date.now() + expiryDuration * 1000);
  const tradeDoc = {
    userId,
    pair,
    direction,
    amount,
    profitPercent,
    entryPrice,
    expiryDuration,
    expiresAt,
    isAdminMode: adminMode,
    isWinDetermined,
  };

  await walletService.lockBalance(userId, amount, null);

  const trade = await BinaryTrade.create(tradeDoc);
  if (!trade.tradeId) {
    trade.tradeId = trade._id.toString();
    await trade.save();
  }

  if (io) {
    io.to(`user:${userId}`).emit("binaryPlaced", {
      tradeId: trade.tradeId,
      pair,
      direction,
      amount,
      entryPrice,
      expiryDuration,
      expiresAt,
      status: "pending",
      profitPercent,
      isAdminMode: adminMode,
    });
  }

  return trade;
}

async function copyTradeToFollowers(trade) {
  try {
    const Follow = mongoose.models.Follow || mongoose.model("Follow", new mongoose.Schema({
      followerId: { type: String, required: true },
      followingId: { type: String, required: true },
    }, { collection: "follows" }));
    const follows = await Follow.find({ followingId: trade.userId.toString() });
    if (!follows.length) return;
    for (const follow of follows) {
      try {
        const followerId = follow.followerId;
        const wallet = await Wallet.findOne({ userId: followerId });
        if (!wallet || wallet.availableBalance < trade.amount) continue;
        const copyDuration = trade.expiryDuration;
        const copyExpiresAt = new Date(Date.now() + copyDuration * 1000);
        await walletService.lockBalance(followerId, trade.amount, null);
        const copyTrade = await BinaryTrade.create({
          userId: followerId,
          parentTradeId: trade.tradeId,
          pair: trade.pair,
          direction: trade.direction,
          amount: trade.amount,
          profitPercent: trade.profitPercent,
          entryPrice: trade.entryPrice,
          expiryDuration: copyDuration,
          expiresAt: copyExpiresAt,
          isAdminMode: trade.isAdminMode,
          isWinDetermined: trade.isWinDetermined,
          isCopyTrade: true,
        });
        if (!copyTrade.tradeId) {
          copyTrade.tradeId = copyTrade._id.toString();
          await copyTrade.save();
        }
        if (io) {
          io.to(`user:${followerId}`).emit("binaryPlaced", {
            tradeId: copyTrade.tradeId,
            pair: trade.pair,
            direction: trade.direction,
            amount: trade.amount,
            entryPrice: trade.entryPrice,
            expiryDuration: copyDuration,
            expiresAt: copyExpiresAt,
            status: "pending",
            profitPercent: trade.profitPercent,
            isCopyTrade: true,
            isAdminMode: trade.isAdminMode,
          });
        }
      } catch (err) {
        console.error(`[BinaryService] copy trade error for follower ${follow.followerId}:`, err.message);
      }
    }
  } catch (err) {
    console.error("[BinaryService] copyTradeToFollowers error:", err.message);
  }
}

async function tick() {
  try {
    const expired = await BinaryTrade.find({
      status: "pending",
      expiresAt: { $lte: new Date() },
    });
    for (const trade of expired) {
      await settleBinaryTrade(trade);
    }
  } catch (err) {
    console.error("[BinaryService] tick error:", err.message);
  }
}

async function getUserBinaryTrades(userId, opts = {}) {
  const query = { userId };
  if (opts.status) query.status = opts.status;
  if (opts.limit) {
    return BinaryTrade.find(query).sort({ createdAt: -1 }).limit(opts.limit);
  }
  return BinaryTrade.find(query).sort({ createdAt: -1 });
}

async function getActiveBinaryTrades(userId) {
  return BinaryTrade.find({ userId, status: "pending" }).sort({ createdAt: -1 });
}

module.exports = {
  startMonitor,
  placeBinaryTrade,
  settleBinaryTrade,
  copyTradeToFollowers,
  getUserBinaryTrades,
  getActiveBinaryTrades,
  getBinaryConfig,
  VALID_DURATIONS,
  MIN_AMOUNT,
};

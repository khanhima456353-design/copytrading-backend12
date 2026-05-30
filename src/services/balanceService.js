/**
<<<<<<< HEAD
 * balanceService.js - Handles persistent balance tracking with USDT/BTC separation
 */

const Balance = require("../../models/Balance");
const Trade = require("../../models/Trade");
const Order = require("../../models/Order");
const Deposit = require("../../models/Deposit");

/**
 * Initialize balances for a new user
 * @param {string} userId - User ID
 * @param {number} initialUSDT - Initial USDT balance (from deposit)
 */
const initializeBalances = async (userId, initialUSDT = 0) => {
  try {
    // Create USDT balance
    await Balance.updateOne(
      { userId, currency: "USDT" },
      {
        $setOnInsert: {
          userId,
          currency: "USDT",
          available: initialUSDT,
          locked: 0,
          total: initialUSDT
        }
      },
      { upsert: true }
    );

    // Create BTC balance
    await Balance.updateOne(
      { userId, currency: "BTC" },
      {
        $setOnInsert: {
          userId,
          currency: "BTC",
          available: 0,
          locked: 0,
          total: 0
        }
      },
      { upsert: true }
    );
=======
 * balanceService.js - Unified balance layer (reads/writes Wallet model only)
 * Drop-in replacement — all existing callers unchanged.
 */

"use strict";

const Wallet = require("../../models/Wallet");
const Balance = require("../../models/Balance");

const syncLegacyUSDTBalance = async (userId, wallet) => {
  const available = wallet?.availableBalance || 0;
  const locked = wallet?.lockedBalance || 0;
  return Balance.findOneAndUpdate(
    { userId, currency: "USDT" },
    {
      $set: {
        available,
        locked,
        total: available + locked
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const ensureWallets = async (userId, initialUSDT = 0) => {
  const numericInitialUSDT = Number(initialUSDT);
  const safeInitialUSDT = Number.isFinite(numericInitialUSDT) && numericInitialUSDT > 0
    ? numericInitialUSDT
    : 0;

  const wallet = await Wallet.findOneAndUpdate(
    { userId, type: "spot" },
    {
      $setOnInsert: {
        userId,
        type: "spot",
        availableBalance: safeInitialUSDT,
        lockedBalance: 0,
        borrowedBalance: 0,
        unrealizedPnl: 0,
        equity: safeInitialUSDT
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const walletIsEmpty =
    (wallet.availableBalance || 0) === 0 &&
    (wallet.lockedBalance || 0) === 0 &&
    (wallet.borrowedBalance || 0) === 0;

  if (safeInitialUSDT > 0 && walletIsEmpty) {
    const updatedWallet = await Wallet.findByIdAndUpdate(wallet._id, {
      $set: {
        availableBalance: safeInitialUSDT,
        equity: safeInitialUSDT + (wallet.unrealizedPnl || 0)
      }
    }, { new: true });
    await syncLegacyUSDTBalance(userId, updatedWallet);
    return updatedWallet;
  }

  await syncLegacyUSDTBalance(userId, wallet);
  return wallet;
};

const initializeBalances = async (userId, initialUSDT = 0) => {
  try {
    await ensureWallets(userId, initialUSDT);
>>>>>>> main
  } catch (err) {
    console.error(`Failed to initialize balances for user ${userId}:`, err);
    throw err;
  }
};

<<<<<<< HEAD
/**
 * Get current balances for a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} { USDT: { available, locked, total }, BTC: { available, locked, total } }
 */
const getBalances = async (userId) => {
  try {
    const balances = await Balance.find({ userId });
    const result = {
      USDT: { available: 0, locked: 0, total: 0 },
      BTC: { available: 0, locked: 0, total: 0 }
    };

    balances.forEach((b) => {
      result[b.currency] = {
        available: b.available,
        locked: b.locked,
        total: b.total
      };
    });

    return result;
=======
const getBalances = async (userId) => {
  try {
    await ensureWallets(userId, 0);
    const wallet = await Wallet.findOne({ userId, type: "spot" });
    const available = wallet?.availableBalance || 0;
    const locked    = wallet?.lockedBalance    || 0;
    const total     = available + locked;

    return {
      USDT: { available, locked, total },
      BTC:  { available: 0, locked: 0, total: 0 }
    };
>>>>>>> main
  } catch (err) {
    console.error(`Failed to get balances for user ${userId}:`, err);
    throw err;
  }
};

<<<<<<< HEAD
/**
 * Recalculate balances from trade history (call on app load)
 * @param {string} userId - User ID
 * @param {number} initialDeposit - Initial USDT deposit amount
 */
const recalculateBalancesFromHistory = async (userId, initialDeposit = 0) => {
  try {
    // Start with initial deposit
    let usdtBalance = initialDeposit;
    let btcBought = 0;  // Total BTC purchased
    let btcSold = 0;    // Total BTC sold

    // Get all closed trades for this user
    const closedTrades = await Trade.find({ userId, status: "closed" });

    // Recalculate from trades
    closedTrades.forEach((trade) => {
      const { pair, amount, profit, side, entryPrice, status } = trade;

      if (status === "closed") {
        if (pair === "BTC/USDT") {
          // BTC/USDT pair: track BTC bought/sold
          if (side === "buy") {
            // Buy: receive BTC, pay USDT
            btcBought += Number(amount) || 0;
            const cost = (Number(entryPrice) || 0) * (Number(amount) || 0);
            usdtBalance -= cost;
            // Add profit (if any)
            usdtBalance += Number(profit) || 0;
          } else if (side === "sell") {
            // Sell: give BTC, receive USDT
            btcSold += Number(amount) || 0;
            // Add proceeds from sale
            const proceeds = (Number(entryPrice) || 0) * (Number(amount) || 0);
            usdtBalance += proceeds;
            // Add/subtract profit/loss
            usdtBalance += Number(profit) || 0;
          }
        } else {
          // Other pairs: just track USDT profit/loss
          usdtBalance += Number(profit) || 0;
        }
      }
    });

    // Final BTC balance = total bought - total sold
    const btcBalance = btcBought - btcSold;

    // Update USDT balance
    await Balance.updateOne(
      { userId, currency: "USDT" },
      {
        $set: {
          available: Math.max(0, usdtBalance),
          total: Math.max(0, usdtBalance)
        }
      },
      { upsert: true }
    );

    // Update BTC balance
    await Balance.updateOne(
      { userId, currency: "BTC" },
      {
        $set: {
          available: Math.max(0, btcBalance),
          total: Math.max(0, btcBalance)
        }
      },
      { upsert: true }
    );

    console.log(`[Balance] Recalculated for user ${userId}: USDT=${usdtBalance}, BTC=${btcBalance}`);

    return { USDT: usdtBalance, BTC: btcBalance };
  } catch (err) {
    console.error(
      `Failed to recalculate balances for user ${userId}:`,
      err
    );
=======
const recalculateBalancesFromHistory = async (userId, initialDeposit = 0) => {
  try {
    await ensureWallets(userId, initialDeposit);
    return await getBalances(userId);
  } catch (err) {
    console.error(`Failed to recalculate balances for user ${userId}:`, err);
>>>>>>> main
    throw err;
  }
};

<<<<<<< HEAD
/**
 * Deduct from available balance (when placing a trade/order)
 * @param {string} userId - User ID
 * @param {string} currency - "USDT" or "BTC"
 * @param {number} amount - Amount to deduct
 */
const lockBalance = async (userId, currency, amount) => {
  try {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error(`Invalid ${currency} lock amount`);
    }

    const balance = await Balance.findOne({ userId, currency });

    if (!balance) {
      throw new Error(`${currency} balance record not found`);
    }

    if ((balance.available || 0) < numericAmount) {
      throw new Error(`Insufficient ${currency} balance`);
    }

    balance.available = Number((balance.available - numericAmount).toFixed(8));
    balance.locked = Number(((balance.locked || 0) + numericAmount).toFixed(8));
    balance.total = Number((balance.available + balance.locked).toFixed(8));

    await balance.save();

    return balance;
  } catch (err) {
    console.error(
      `Failed to lock ${amount} ${currency} for user ${userId}:`,
      err
    );
    throw err;
  }
};

/**
 * Release locked balance back to available (when cancelling order)
 * @param {string} userId - User ID
 * @param {string} currency - "USDT" or "BTC"
 * @param {number} amount - Amount to unlock
 */
const unlockBalance = async (userId, currency, amount) => {
  try {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error(`Invalid ${currency} unlock amount`);
    }

    const balance = await Balance.findOne({ userId, currency });

    if (!balance) {
      throw new Error(`${currency} balance record not found`);
    }

    if ((balance.locked || 0) < numericAmount) {
      throw new Error(`Insufficient locked ${currency}`);
    }

    balance.available = Number(((balance.available || 0) + numericAmount).toFixed(8));
    balance.locked = Number((balance.locked - numericAmount).toFixed(8));
    balance.total = Number((balance.available + balance.locked).toFixed(8));

    await balance.save();

    return balance;
  } catch (err) {
    console.error(
      `Failed to unlock ${amount} ${currency} for user ${userId}:`,
      err
    );
    throw err;
  }
};

/**
 * Add to available balance (when trade completes with profit)
 * @param {string} userId - User ID
 * @param {string} currency - "USDT" or "BTC"
 * @param {number} amount - Amount to add (can be negative for losses)
 */
const creditBalance = async (userId, currency, amount) => {
  try {
    // Increment available and total together. Using aggregation expressions
    // (like $add/$literal) inside a normal update requires the update-pipeline
    // option; instead, increment both numeric fields directly which is atomic
    // and avoids pipeline updates.
    const update = {
      $inc: { available: amount, total: amount },
      $setOnInsert: { userId, currency, locked: 0 }
    };

    const balance = await Balance.findOneAndUpdate(
      { userId, currency },
      update,
      { new: true, upsert: true }
    );

    return balance;
  } catch (err) {
    console.error(
      `Failed to credit ${amount} ${currency} for user ${userId}:`,
      err
    );
    throw err;
  }
=======
const lockBalance = async (userId, currency, amount) => {
  if (currency !== "USDT") return;
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0)
    throw new Error(`Invalid ${currency} lock amount`);

  const wallet = await Wallet.findOneAndUpdate(
    {
      userId,
      type: "spot",
      isFrozen: { $ne: true },
      availableBalance: { $gte: numericAmount }
    },
    { $inc: { availableBalance: -numericAmount, lockedBalance: numericAmount } },
    { new: true }
  );

  if (!wallet) {
    const exists = await Wallet.findOne({ userId, type: "spot" });
    if (!exists)         throw new Error("Wallet not found");
    if (exists.isFrozen) throw new Error("Wallet is frozen");
    throw new Error("Insufficient USDT balance");
  }

  await syncLegacyUSDTBalance(userId, wallet);
  return wallet;
};

const unlockBalance = async (userId, currency, amount) => {
  if (currency !== "USDT") return;
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0)
    throw new Error(`Invalid ${currency} unlock amount`);

  const wallet = await Wallet.findOneAndUpdate(
    {
      userId,
      type: "spot",
      lockedBalance: { $gte: numericAmount }
    },
    { $inc: { lockedBalance: -numericAmount, availableBalance: numericAmount } },
    { new: true }
  );

  if (!wallet) throw new Error("Insufficient locked USDT");
  await syncLegacyUSDTBalance(userId, wallet);
  return wallet;
};

const consumeLockedBalance = async (userId, currency, amount) => {
  if (currency !== "USDT") return;
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0)
    throw new Error(`Invalid ${currency} consume amount`);

  const wallet = await Wallet.findOneAndUpdate(
    {
      userId,
      type: "spot",
      lockedBalance: { $gte: numericAmount }
    },
    { $inc: { lockedBalance: -numericAmount } },
    { new: true }
  );

  if (!wallet) throw new Error("Insufficient locked USDT");
  await syncLegacyUSDTBalance(userId, wallet);
  return wallet;
};

const creditBalance = async (userId, currency, amount) => {
  if (currency !== "USDT") return;
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount))
    throw new Error("Invalid credit amount");

  const wallet = await Wallet.findOneAndUpdate(
    { userId, type: "spot" },
    { $inc: { availableBalance: numericAmount } },
    { new: true, upsert: true }
  );

  // Recompute equity
  const equity = wallet.availableBalance + (wallet.unrealizedPnl || 0) - (wallet.borrowedBalance || 0);
  await Wallet.findByIdAndUpdate(wallet._id, { $set: { equity } });

  return syncLegacyUSDTBalance(userId, wallet);
>>>>>>> main
};

module.exports = {
  initializeBalances,
  getBalances,
  recalculateBalancesFromHistory,
  lockBalance,
  unlockBalance,
<<<<<<< HEAD
=======
  consumeLockedBalance,
>>>>>>> main
  creditBalance
};

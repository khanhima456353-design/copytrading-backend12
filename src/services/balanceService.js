/**

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
  } catch (err) {
    console.error(`Failed to initialize balances for user ${userId}:`, err);
    throw err;
  }
};


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
  } catch (err) {
    console.error(`Failed to get balances for user ${userId}:`, err);
    throw err;
  }
};


const recalculateBalancesFromHistory = async (userId, initialDeposit = 0) => {
  try {
    await ensureWallets(userId, initialDeposit);
    return await getBalances(userId);
  } catch (err) {
    console.error(`Failed to recalculate balances for user ${userId}:`, err);
    throw err;
  }
};


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
};

module.exports = {
  initializeBalances,
  getBalances,
  recalculateBalancesFromHistory,
  lockBalance,
  unlockBalance,

  consumeLockedBalance,
  creditBalance
};

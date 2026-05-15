const Wallet = require("../../models/Wallet");
const LedgerService = require("./ledgerService");
const User = require("../../models/User");

const ensureWallet = async (userId, type) => {
  const walletType = type || "spot";
  let wallet = await Wallet.findOne({ userId, type: walletType });

  if (!wallet) {
    wallet = await Wallet.create({ userId, type: walletType });
  }

  wallet.equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;
  await wallet.save();
  return wallet;
};

const getWallet = async (userId, type = "spot") => {
  const wallet = await ensureWallet(userId, type);
  await LedgerService.syncWalletBalance(wallet);
  return wallet;
};

const lockFunds = async ({ userId, amount, walletType = "spot", reason, referenceType, referenceId }) => {
  const wallet = await getWallet(userId, walletType);

  if (wallet.isFrozen) {
    throw new Error("Wallet is frozen");
  }

  if (wallet.availableBalance < amount) {
    throw new Error("Insufficient available balance");
  }

  wallet.availableBalance -= amount;
  wallet.lockedBalance += amount;
  wallet.equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;

  await wallet.save();

  await LedgerService.createLedgerEntry({
    userId,
    walletType,
    entryType: "lock",
    amount,
    debitAccount: "available",
    creditAccount: "locked",
    referenceType,
    referenceId,
    description: reason || "Locked funds for order",
    metadata: { lockedAmount: amount }
  });

  return wallet;
};

const unlockFunds = async ({ userId, amount, walletType = "spot", reason, referenceType, referenceId }) => {
  const wallet = await getWallet(userId, walletType);

  if (wallet.lockedBalance < amount) {
    throw new Error("Insufficient locked balance");
  }

  wallet.lockedBalance -= amount;
  wallet.availableBalance += amount;
  wallet.equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;

  await wallet.save();

  await LedgerService.createLedgerEntry({
    userId,
    walletType,
    entryType: "unlock",
    amount,
    debitAccount: "locked",
    creditAccount: "available",
    referenceType,
    referenceId,
    description: reason || "Funds returned from cancelled order",
    metadata: { unlockedAmount: amount }
  });

  return wallet;
};

const adjustBalances = async ({ userId, walletType = "spot", available = 0, locked = 0, borrowed = 0, adminId, description }) => {
  const wallet = await ensureWallet(userId, walletType);
  if (wallet.isFrozen) {
    throw new Error("Wallet is frozen");
  }

  const delta = available + locked + borrowed;
  if (wallet.availableBalance + wallet.lockedBalance + wallet.borrowedBalance + delta < 0) {
    throw new Error("Adjustment would create negative balance");
  }

  wallet.availableBalance += available;
  wallet.lockedBalance += locked;
  wallet.borrowedBalance += borrowed;
  wallet.equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;

  await wallet.save();

  await LedgerService.createLedgerEntry({
    userId,
    walletType,
    entryType: "admin_adjustment",
    amount: Math.abs(delta),
    debitAccount: delta >= 0 ? "system" : "wallet",
    creditAccount: delta >= 0 ? "wallet" : "system",
    referenceType: "admin",
    referenceId: adminId,
    description: description || "Manual wallet adjustment",
    metadata: { availableDelta: available, lockedDelta: locked, borrowedDelta: borrowed, adminId }
  });

  return wallet;
};

const refreshEquity = async (wallet) => {
  wallet.equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;
  await wallet.save();
  return wallet;
};

module.exports = {
  getWallet,
  ensureWallet,
  lockFunds,
  unlockFunds,
  adjustBalances,
  refreshEquity
};

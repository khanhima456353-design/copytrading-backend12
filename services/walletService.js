const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

function assertPositiveAmount(amount, label = "amount") {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} must be a positive number`);
  }
}

function assertNonNegativeBalances(availableBalance, lockedBalance) {
  if (availableBalance < 0 || lockedBalance < 0) {
    throw new Error("availableBalance and lockedBalance cannot be negative");
  }
}

async function recordTransaction(
  session,
  { userId, type, amount, balanceBefore, balanceAfter, lockedBefore, lockedAfter, reference, description }
) {
  const options = session ? { session } : undefined;
  let ref = reference ?? null;
  if (ref !== null && typeof ref === "string") {
    try { ref = new mongoose.Types.ObjectId(ref); } catch { ref = null; }
  }
  await Transaction.create(
    [
      {
        userId,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        lockedBefore,
        lockedAfter,
        reference: ref,
        description,
      },
    ],
    options
  );
}

async function createWallet(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        userId,
        availableBalance: 0,
        lockedBalance: 0,
        totalBalance: 0,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    }
  );

  if (!wallet) {
    throw new Error("Failed to create wallet");
  }

  return wallet;
}

async function getWallet(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  return wallet;
}

async function creditBalance(userId, amount, description, type) {
  if (!["deposit", "manual_credit", "trade"].includes(type)) {
    throw new Error("type must be 'deposit', 'manual_credit', or 'trade'");
  }
  assertPositiveAmount(amount);

  const before = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { availableBalance: amount } },
    { returnDocument: 'before' }
  );

  if (!before) {
    throw new Error("Wallet not found");
  }

  const wallet = await Wallet.findOne({ userId });
  await recordTransaction(null, {
    userId,
    type,
    amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: null,
    description,
  });

  return wallet;
}

async function lockBalance(userId, amount, orderId) {
  assertPositiveAmount(amount);

  const before = await Wallet.findOneAndUpdate(
    { userId, availableBalance: { $gte: amount } },
    { $inc: { availableBalance: -amount, lockedBalance: amount } },
    { returnDocument: 'before' }
  );

  if (!before) {
    const existing = await Wallet.findOne({ userId });
    if (!existing) {
      throw new Error("Wallet not found");
    }
    throw new Error("Insufficient available balance");
  }

  const wallet = await Wallet.findOne({ userId });
  await recordTransaction(null, {
    userId,
    type: "trade_open",
    amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: orderId,
    description: `Locked ${amount} for order ${orderId}`,
  });

  return wallet;
}

async function unlockBalance(userId, amount, pnlAmount, orderId) {
  assertPositiveAmount(amount);
  if (typeof pnlAmount !== "number" || !Number.isFinite(pnlAmount)) {
    throw new Error("pnlAmount must be a finite number");
  }

  const filter = { userId, lockedBalance: { $gte: amount } };
  if (pnlAmount < 0) {
    filter.availableBalance = { $gte: -pnlAmount };
  }

  const before = await Wallet.findOneAndUpdate(
    filter,
    { $inc: { lockedBalance: -amount, availableBalance: amount + pnlAmount } },
    { returnDocument: 'before' }
  );

  if (!before) {
    const existing = await Wallet.findOne({ userId });
    if (!existing) {
      throw new Error("Wallet not found");
    }
    if (existing.lockedBalance < amount) {
      throw new Error("Insufficient locked balance");
    }
    throw new Error("Adjustment would create a negative balance");
  }

  const wallet = await Wallet.findOne({ userId });
  await recordTransaction(null, {
    userId,
    type: "trade_close",
    amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: orderId,
    description: `Unlocked ${amount} for order ${orderId} (PnL: ${pnlAmount})`,
  });

  return wallet;
}

async function debitBalance(userId, amount, description, type = "withdrawal") {
  assertPositiveAmount(amount);

  const before = await Wallet.findOneAndUpdate(
    { userId, availableBalance: { $gte: amount } },
    { $inc: { availableBalance: -amount } },
    { returnDocument: 'before' }
  );

  if (!before) {
    const existing = await Wallet.findOne({ userId });
    if (!existing) {
      throw new Error("Wallet not found");
    }
    throw new Error("Insufficient available balance");
  }

  const wallet = await Wallet.findOne({ userId });
  await recordTransaction(null, {
    userId,
    type,
    amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: null,
    description,
  });

  return wallet;
}

async function getUserTransactions(userId) {
  return Transaction.find({ userId }).sort({ createdAt: -1 });
}

async function ensureWallet(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        availableBalance: 0,
        lockedBalance: 0,
        totalBalance: 0,
        currency: "USDT",
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    }
  );

  if (!wallet) {
    throw new Error("Failed to ensure wallet");
  }

  return wallet;
}

async function creditAsset(userId, asset, amount) {
  assertPositiveAmount(amount);
  const key = `balances.${asset}`;
  const before = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { [key]: amount } },
    { returnDocument: 'before' }
  );
  if (!before) throw new Error("Wallet not found");
  const wallet = await Wallet.findOne({ userId });
  const balMap = wallet.balances || {};
  await recordTransaction(null, {
    userId, type: "spot_credit", amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: null,
    description: `Spot credit ${amount} ${asset}`,
  });
  return wallet;
}

async function debitAsset(userId, asset, amount) {
  assertPositiveAmount(amount);
  const key = `balances.${asset}`;
  const before = await Wallet.findOneAndUpdate(
    { userId, [`balances.${asset}`]: { $gte: amount } },
    { $inc: { [key]: -amount } },
    { returnDocument: 'before' }
  );
  if (!before) {
    const existing = await Wallet.findOne({ userId });
    if (!existing) throw new Error("Wallet not found");
    const current = existing.balances?.get?.(asset) || existing.balances?.[asset] || 0;
    if (current < amount) throw new Error(`Insufficient ${asset} balance`);
    throw new Error("Insufficient balance");
  }
  const wallet = await Wallet.findOne({ userId });
  await recordTransaction(null, {
    userId, type: "spot_debit", amount,
    balanceBefore: before.availableBalance,
    balanceAfter: wallet.availableBalance,
    lockedBefore: before.lockedBalance,
    lockedAfter: wallet.lockedBalance,
    reference: null,
    description: `Spot debit ${amount} ${asset}`,
  });
  return wallet;
}

async function getAssetBalance(userId, asset) {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) return 0;
  const bal = wallet.balances?.get?.(asset) ?? wallet.balances?.[asset] ?? 0;
  return bal;
}

async function getAllBalances(userId) {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) return {};
  const bal = wallet.balances || {};
  const result = {};
  for (const [key, val] of (bal instanceof Map ? bal.entries() : Object.entries(bal))) {
    if (val > 0) result[key] = val;
  }
  result.USDT = (result.USDT || 0) + wallet.availableBalance;
  return result;
}

module.exports = {
  createWallet,
  getWallet,
  ensureWallet,
  creditBalance,
  lockBalance,
  unlockBalance,
  debitBalance,
  getUserTransactions,
  creditAsset,
  debitAsset,
  getAssetBalance,
  getAllBalances,
};

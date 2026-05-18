/**
 * walletService.js  —  CRASH-PROOF edition
 *
 * UPGRADES:
 *  - lockFunds    : single atomic findOneAndUpdate with inline guards
 *                   (no separate read → mutate → write that can race)
 *  - unlockFunds  : same atomic pattern
 *  - adjustBalances: same atomic pattern with negative-balance guard
 *  - ensureWallet : idempotent upsert via findOneAndUpdate + $setOnInsert
 *                   to prevent duplicate-wallet creation under concurrent requests
 */
"use strict";
const Wallet = require("../../models/Wallet");
const LedgerService = require("./ledgerService");
// ─── ensureWallet ─────────────────────────────────────────────────────────────
/**
 * UPGRADE: findOneAndUpdate with upsert=true guarantees exactly one wallet
 * document even when two concurrent requests try to create it simultaneously.
 */
const ensureWallet = async (userId, type) => {
    const walletType = type || "spot";
    let wallet = await Wallet.findOneAndUpdate({ userId, type: walletType }, { $setOnInsert: { userId, type: walletType, availableBalance: 0, lockedBalance: 0, borrowedBalance: 0, unrealizedPnl: 0, equity: 0 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    // Recompute equity in a separate save (non-critical, read-only recalc)
    const equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;
    if (wallet.equity !== equity) {
        wallet = await Wallet.findByIdAndUpdate(wallet._id, { $set: { equity } }, { new: true });
    }
    return wallet;
};
// ─── getWallet ────────────────────────────────────────────────────────────────
const getWallet = async (userId, type = "spot") => {
    const wallet = await ensureWallet(userId, type);
    await LedgerService.syncWalletBalance(wallet);
    return wallet;
};
// ─── lockFunds ────────────────────────────────────────────────────────────────
/**
 * UPGRADE: One atomic update.
 *   Filter guards:  availableBalance >= amount  AND  isFrozen != true
 *   If the document does not match (frozen or insufficient) → returns null → throw.
 *   No gap exists where another concurrent request can read the same balance.
 */
const lockFunds = async ({ userId, amount, walletType = "spot", reason, referenceType, referenceId }) => {
    if (!amount || amount <= 0)
        throw new Error("Lock amount must be positive");
    const wallet = await Wallet.findOneAndUpdate({
        userId,
        type: walletType,
        isFrozen: { $ne: true },
        availableBalance: { $gte: amount },
    }, {
        $inc: { availableBalance: -amount, lockedBalance: amount },
    }, { new: true });
    if (!wallet) {
        // Distinguish between frozen vs insufficient
        const existing = await Wallet.findOne({ userId, type: walletType });
        if (!existing)
            throw new Error("Wallet not found");
        if (existing.isFrozen)
            throw new Error("Wallet is frozen");
        throw new Error("Insufficient available balance");
    }
    // Recompute equity
    await Wallet.findByIdAndUpdate(wallet._id, {
        $set: { equity: wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance },
    });
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
        metadata: { lockedAmount: amount },
    });
    return wallet;
};
// ─── unlockFunds ──────────────────────────────────────────────────────────────
/**
 * UPGRADE: Atomic — guards lockedBalance >= amount.
 */
const unlockFunds = async ({ userId, amount, walletType = "spot", reason, referenceType, referenceId }) => {
    if (!amount || amount <= 0)
        throw new Error("Unlock amount must be positive");
    const wallet = await Wallet.findOneAndUpdate({
        userId,
        type: walletType,
        lockedBalance: { $gte: amount },
    }, {
        $inc: { lockedBalance: -amount, availableBalance: amount },
    }, { new: true });
    if (!wallet) {
        const existing = await Wallet.findOne({ userId, type: walletType });
        if (!existing)
            throw new Error("Wallet not found");
        throw new Error("Insufficient locked balance");
    }
    await Wallet.findByIdAndUpdate(wallet._id, {
        $set: { equity: wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance },
    });
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
        metadata: { unlockedAmount: amount },
    });
    return wallet;
};
// ─── adjustBalances ───────────────────────────────────────────────────────────
/**
 * UPGRADE: Atomic adjustment.
 * Negative-balance guard is enforced in the filter: available + delta >= 0.
 */
const adjustBalances = async ({ userId, walletType = "spot", available = 0, locked = 0, borrowed = 0, adminId, description }) => {
    // Build filter guards for each field being decremented
    const filter = { userId, type: walletType, isFrozen: { $ne: true } };
    if (available < 0)
        filter.availableBalance = { $gte: -available };
    if (locked < 0)
        filter.lockedBalance = { $gte: -locked };
    if (borrowed < 0)
        filter.borrowedBalance = { $gte: -borrowed };
    const wallet = await Wallet.findOneAndUpdate(filter, { $inc: { availableBalance: available, lockedBalance: locked, borrowedBalance: borrowed } }, { new: true });
    if (!wallet) {
        const existing = await Wallet.findOne({ userId, type: walletType });
        if (!existing)
            throw new Error("Wallet not found");
        if (existing.isFrozen)
            throw new Error("Wallet is frozen");
        throw new Error("Adjustment would create a negative balance");
    }
    const equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;
    await Wallet.findByIdAndUpdate(wallet._id, { $set: { equity } });
    const delta = available + locked + borrowed;
    if (delta !== 0) {
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
            metadata: { availableDelta: available, lockedDelta: locked, borrowedDelta: borrowed, adminId },
        });
    }
    return wallet;
};
// ─── refreshEquity ────────────────────────────────────────────────────────────
const refreshEquity = async (wallet) => {
    const equity = wallet.availableBalance + wallet.unrealizedPnl - wallet.borrowedBalance;
    return Wallet.findByIdAndUpdate(wallet._id, { $set: { equity } }, { new: true });
};
module.exports = {
    getWallet,
    ensureWallet,
    lockFunds,
    unlockFunds,
    adjustBalances,
    refreshEquity,
};

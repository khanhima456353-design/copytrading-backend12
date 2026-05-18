"use strict";
const LedgerEntry = require("../../models/LedgerEntry");
const Wallet = require("../../models/Wallet");
const createLedgerEntry = async ({ userId, walletType, entryType, amount, debitAccount, creditAccount, referenceType, referenceId, description, metadata }) => {
    if (amount === 0) {
        throw new Error("Ledger amount must not be zero");
    }
    const entry = await LedgerEntry.create({
        userId,
        walletType,
        entryType,
        amount,
        debitAccount,
        creditAccount,
        referenceType,
        referenceId,
        description,
        metadata
    });
    return entry;
};
const calculateWalletFromLedger = async (userId, walletType) => {
    const entries = await LedgerEntry.find({ userId, walletType }).lean();
    const result = entries.reduce((summary, entry) => {
        if (entry.creditAccount === "wallet") {
            summary.balance += entry.amount;
        }
        if (entry.debitAccount === "wallet") {
            summary.balance -= entry.amount;
        }
        return summary;
    }, { balance: 0 });
    return result.balance;
};
const syncWalletBalance = async (wallet) => {
    const balance = await calculateWalletFromLedger(wallet.userId, wallet.type);
    wallet.equity = balance + wallet.unrealizedPnl - wallet.borrowedBalance;
    await wallet.save();
    return wallet;
};
module.exports = {
    createLedgerEntry,
    calculateWalletFromLedger,
    syncWalletBalance
};

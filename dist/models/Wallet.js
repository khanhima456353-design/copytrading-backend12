"use strict";
const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["spot", "cross"], required: true },
    availableBalance: { type: Number, default: 0 },
    lockedBalance: { type: Number, default: 0 },
    borrowedBalance: { type: Number, default: 0 },
    unrealizedPnl: { type: Number, default: 0 },
    equity: { type: Number, default: 0 },
    isFrozen: { type: Boolean, default: false },
    isMarginEnabled: { type: Boolean, default: false },
    leverage: { type: Number, default: 1 },
    maxLeverage: { type: Number, default: 1 },
    maintenanceMarginRatio: { type: Number, default: 0.05 },
    riskTier: { type: String, default: "standard" }
}, { timestamps: true });
walletSchema.index({ userId: 1, type: 1 }, { unique: true });
module.exports = mongoose.model("Wallet", walletSchema);

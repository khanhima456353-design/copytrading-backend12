"use strict";
const mongoose = require("mongoose");
const liquidationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    positionId: { type: mongoose.Schema.Types.ObjectId, ref: "MarginPosition" },
    pair: { type: String, required: true },
    walletType: { type: String, enum: ["cross", "isolated"], required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "executed", "failed"], default: "pending" },
    executedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model("Liquidation", liquidationSchema);

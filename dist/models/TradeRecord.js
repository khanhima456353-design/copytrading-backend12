"use strict";
const mongoose = require("mongoose");
const tradeRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    walletType: { type: String, enum: ["spot", "cross", "isolated"], required: true },
    pair: { type: String, required: true },
    side: { type: String, enum: ["buy", "sell"], required: true },
    type: { type: String, enum: ["limit", "market", "stop-loss"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    pnl: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    positionId: { type: mongoose.Schema.Types.ObjectId, ref: "MarginPosition" }
}, { timestamps: true });
module.exports = mongoose.model("TradeRecord", tradeRecordSchema);

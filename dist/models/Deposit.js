"use strict";
const mongoose = require("mongoose");
const depositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    paymentMethod: { type: String, default: "bank_transfer" },
    transactionRef: { type: String },
    notes: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date }
}, { timestamps: true });
module.exports = mongoose.model("Deposit", depositSchema);

"use strict";
const mongoose = require("mongoose");
const ledgerEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    walletType: { type: String, enum: ["spot", "cross", "isolated", "system"], required: true },
    entryType: { type: String, required: true },
    amount: { type: Number, required: true },
    debitAccount: { type: String, required: true },
    creditAccount: { type: String, required: true },
    referenceType: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model("LedgerEntry", ledgerEntrySchema);

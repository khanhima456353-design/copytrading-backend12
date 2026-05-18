"use strict";
const mongoose = require("mongoose");
const holdingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    asset: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    lockedQuantity: { type: Number, default: 0 },
    averagePrice: { type: Number, default: 0 }
}, { timestamps: true });
holdingSchema.index({ userId: 1, asset: 1 }, { unique: true });
module.exports = mongoose.model("Holding", holdingSchema);

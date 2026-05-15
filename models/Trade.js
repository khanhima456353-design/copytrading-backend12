const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pair: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "closed", "cancelled"], default: "pending" },
    profit: { type: Number, default: 0 },
    resultPercent: { type: Number, default: 0 },
    resultType: { type: String, enum: ["profit", "loss", "none"], default: "none" },
    adminReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminReviewedAt: { type: Date },
    processedAt: { type: Date },
    autoProcessed: { type: Boolean, default: false },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trade", tradeSchema);

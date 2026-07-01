const mongoose = require("mongoose");

const binaryTradeSchema = new mongoose.Schema(
  {
    tradeId: { type: String, unique: true, sparse: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    parentTradeId: { type: String, default: null },
    pair: { type: String, required: true },
    direction: { type: String, enum: ["HIGHER", "LOWER"], required: true },
    amount: { type: Number, required: true },
    profitPercent: { type: Number, default: 0 },
    payoutAmount: { type: Number, default: 0 },
    entryPrice: { type: Number, required: true },
    expiryPrice: { type: Number, default: 0 },
    expiryDuration: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    settledAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "won", "lost"],
      default: "pending",
    },
    profit: { type: Number, default: 0 },
    isAdminMode: { type: Boolean, default: false },
    isWinDetermined: { type: Boolean, default: false },
    isCopyTrade: { type: Boolean, default: false },
  },
  { timestamps: true }
);

binaryTradeSchema.index({ userId: 1, status: 1 });
binaryTradeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("BinaryTrade", binaryTradeSchema);

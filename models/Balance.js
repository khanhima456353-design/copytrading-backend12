const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    currency: { type: String, enum: ["USDT", "BTC"], required: true },
    available: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    total: { type: Number, default: 0 } // available + locked
  },
  { timestamps: true }
);

balanceSchema.index({ userId: 1, currency: 1 }, { unique: true });

module.exports = mongoose.model("Balance", balanceSchema);

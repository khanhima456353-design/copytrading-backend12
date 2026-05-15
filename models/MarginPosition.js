const mongoose = require("mongoose");

const marginPositionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pair: { type: String, required: true },
    side: { type: String, enum: ["long", "short"], required: true },
    type: { type: String, enum: ["isolated", "cross"], required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    isolatedMargin: { type: Number, default: 0 },
    borrowedAmount: { type: Number, default: 0 },
    liquidationPrice: { type: Number },
    unrealizedPnl: { type: Number, default: 0 },
    leverage: { type: Number, default: 1 },
    maintenanceMargin: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "closed", "liquidated"], default: "open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarginPosition", marginPositionSchema);

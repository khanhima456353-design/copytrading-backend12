const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pair: { type: String, required: true },
    side: { type: String, enum: ["long", "short"], default: "long" },
    size: { type: Number, default: 0 },
    entryPrice: { type: Number, default: 0 },
    margin: { type: Number, default: 0 },
    leverage: { type: Number, default: 1 },
    category: { type: String, enum: ["futures", "spot"], default: "futures" },
    isDemo: { type: Boolean, default: false },
    isGenuine: { type: Boolean, default: true },
    unrealizedPnL: { type: Number, default: 0 },
    rawUnrealizedPnL: { type: Number, default: 0 },
    roePct: { type: Number, default: 0 },
    rawRoePct: { type: Number, default: 0 },
    liquidationPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

positionSchema.index({ userId: 1, pair: 1 });

module.exports = mongoose.model("Position", positionSchema);

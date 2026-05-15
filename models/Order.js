const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    walletType: { type: String, enum: ["spot", "cross", "isolated"], required: true },
    pair: { type: String, required: true },
    side: { type: String, enum: ["buy", "sell"], required: true },
    type: { type: String, enum: ["limit", "market", "stop-loss"], required: true },
    price: { type: Number },
    quantity: { type: Number, required: true },
    filledQuantity: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "filled", "cancelled", "rejected"], default: "open" },
    stopPrice: { type: Number },
    total: { type: Number },
    feeRate: { type: Number, default: 0 },
    riskParameters: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

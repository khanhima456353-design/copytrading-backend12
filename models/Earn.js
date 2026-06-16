const mongoose = require("mongoose");

const earnSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalEarn: { type: Number, required: true },
    dailyEarn: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    claimedAmount: { type: Number, default: 0 },
    lastPayoutDay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Earn", earnSchema);

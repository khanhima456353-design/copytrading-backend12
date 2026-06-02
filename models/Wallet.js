const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["spot", "margin", "futures"], default: "spot" },
    availableBalance: { type: Number, default: 0 },
    lockedBalance: { type: Number, default: 0 },
    borrowedBalance: { type: Number, default: 0 },
    unrealizedPnl: { type: Number, default: 0 },
    equity: { type: Number, default: 0 },
    isFrozen: { type: Boolean, default: false },
    totalBalance: { type: Number, default: 0 },
    currency: { type: String, default: "USDT" },
  },
  { timestamps: true }
);

walletSchema.pre("save", function (next) {
  this.totalBalance = this.availableBalance + this.lockedBalance;
  next();
});

async function syncTotalBalanceForUpdate() {
  const update = this.getUpdate();
  if (!update) return;

  const hasAvailable = update.$set?.availableBalance !== undefined || update.$inc?.availableBalance !== undefined;
  const hasLocked = update.$set?.lockedBalance !== undefined || update.$inc?.lockedBalance !== undefined;
  if (!hasAvailable && !hasLocked) return;

  const doc = await this.model.findOne(this.getQuery()).lean();
  if (!doc) return;

  const available = (doc.availableBalance || 0) + (update.$inc?.availableBalance || 0);
  const locked = (doc.lockedBalance || 0) + (update.$inc?.lockedBalance || 0);
  update.$set = {
    ...(update.$set || {}),
    totalBalance: available + locked,
  };
}

walletSchema.pre("findOneAndUpdate", syncTotalBalanceForUpdate);
walletSchema.pre("updateOne", syncTotalBalanceForUpdate);
walletSchema.pre("updateMany", syncTotalBalanceForUpdate);

module.exports = mongoose.model("Wallet", walletSchema);

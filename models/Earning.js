const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stakeId: { type: mongoose.Schema.Types.ObjectId, ref: "Earn", required: true },
    day: { type: Number, required: true },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

earningSchema.index({ userId: 1, stakeId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("Earning", earningSchema);

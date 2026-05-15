const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    walletType: { type: String, enum: ["cross", "isolated"], required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, default: 0 },
    borrowedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["open", "repaid", "defaulted"], default: "open" },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);

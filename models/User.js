const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    name: { type: String },
    password: { type: String },
    balance: { type: Number, default: 0 },
    frozenBalance: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    isBanned: { type: Boolean, default: false },
    kycVerified: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    kycSubmission: {
      personal: {
        fullName: { type: String, default: "" },
        dob: { type: String, default: "" },
        country: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" }
      },
      documentType: { type: String, default: "" },
      documentFront: {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        size: { type: Number, default: 0 },
        data: { type: String, default: "" }
      },
      documentBack: {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        size: { type: Number, default: 0 },
        data: { type: String, default: "" }
      },
      selfie: {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        size: { type: Number, default: 0 },
        data: { type: String, default: "" }
      },
      submittedAt: { type: Date },
      reviewedAt: { type: Date }
    },
    lastLogin: { type: Date },

isVerified: { type: Boolean, default: false },
refreshToken: { type: String },
driftConfig: {
  active:         { type: Boolean, default: false },
  pair:           { type: String, default: "" },
  direction:      { type: String, enum: ["profit", "loss", ""], default: "" },
  outcomePercent: { type: Number, default: 0 },
  positionSide:   { type: String, enum: ["long", "short", ""], default: "" },
  speed:          { type: String, default: "normal" },
  volatility:     { type: String, default: "low" },
  positionId:     { type: String, default: "" },
  startedAt:      { type: Date }
}
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
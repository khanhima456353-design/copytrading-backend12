const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
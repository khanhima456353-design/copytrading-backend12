"use strict";
const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true }, // hashed OTP
    ip: { type: String },
    deviceId: { type: String },
    attempts: { type: Number, default: 0 },
    resendCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // auto delete
    }
});
module.exports = mongoose.model("Otp", otpSchema);

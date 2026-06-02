"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dns = require("dns").promises;
const router = express.Router();
const User = require("../../models/User");
const Otp = require("../../models/Otp");
const { generateUniqueUserId } = require("../../utils/userIdGenerator");
const { generateDeviceId } = require("../../utils/otpSecurity");
const EMAIL_RATE_LIMIT = 3;
const EMAIL_RATE_WINDOW_MS = 60 * 60 * 1000;
const GENERIC_OTP_ERROR = "Unable to process request. Please try with valid Email ID.";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ================= OTP GENERATOR =================
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// ================= GET REAL IP =================
function getIp(req) {
    return (req.headers["cf-connecting-ip"] ||
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip);
}
function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
}
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}
async function hasDeliverableEmail(email) {
    const [, domain] = email.split("@");
    if (!domain)
        return false;
    const DNS_TIMEOUT_MS = 2000;
    const withTimeout = (promise, ms) => Promise.race([
        promise,
        new Promise((_, rej) => setTimeout(() => rej(new Error("DNS timeout")), ms)),
    ]);
    try {
        // Prefer MX records
        const mxRecords = await withTimeout(dns.resolveMx(domain), DNS_TIMEOUT_MS);
        if (Array.isArray(mxRecords) && mxRecords.length > 0) {
            return true;
        }
        // no MX entries -> try A/AAAA lookup
        try {
            const addrs = await withTimeout(dns.resolve(domain), DNS_TIMEOUT_MS);
            return Array.isArray(addrs) && addrs.length > 0;
        }
        catch (addrErr) {
            // No A records
            return false;
        }
    }
    catch (mxErr) {
        // If MX failed due to NXDOMAIN/NO DATA etc, try A record. For other errors
        // (timeouts, network issues), be permissive and allow valid emails to pass
        // through rather than blocking registration.
        const permissiveCodes = ["ETIMEOUT", "EAI_AGAIN", "ECONNREFUSED", "ENETUNREACH"];
        const fallbackCodes = ["ENODATA", "ENOTFOUND", "ENOENT", "ENOTIMP", "ESERVFAIL"];
        if (fallbackCodes.includes(mxErr.code)) {
            try {
                const addrs = await withTimeout(dns.resolve(domain), DNS_TIMEOUT_MS);
                return Array.isArray(addrs) && addrs.length > 0;
            }
            catch {
                return false;
            }
        }
        if (permissiveCodes.includes(mxErr.code) || mxErr.message === "DNS timeout") {
            console.warn("MX lookup failed (permissive):", mxErr.message);
            // Do not block valid-format emails when DNS is flaky; let the flow continue.
            return true;
        }
        // Unknown error: log and allow to avoid breaking valid users in restricted envs
        console.warn("MX lookup unexpected error, allowing email:", mxErr.message);
        return true;
    }
}
// ================= EMAIL TRANSPORT =================
const { authMiddleware } = require("../middleware/authMiddleware");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const ip = getIp(req);
    const deviceId = generateDeviceId(req);
    const normalizedEmail = normalizeEmail(email);
    if (!email || !isValidEmail(normalizedEmail)) {
        return res.status(400).json({ message: GENERIC_OTP_ERROR });
    }
    if (process.env.DEBUG_OTP === "true") {
        const maskedEmail = normalizedEmail.replace(/^(.{2})(.*)(?=@)/, "$1***");
        console.debug("send-otp debug:", { email: maskedEmail });
    }
    try {
        const existingOtp = await Otp.findOne({ email: normalizedEmail });
        if (existingOtp) {
            const ageMs = Date.now() - new Date(existingOtp.createdAt).getTime();
            const windowReset = ageMs > EMAIL_RATE_WINDOW_MS;
            const resendCount = windowReset ? 0 : existingOtp.resendCount || 0;
            if (resendCount >= EMAIL_RATE_LIMIT) {
                return res.status(429).json({ message: GENERIC_OTP_ERROR });
            }
            if (windowReset) {
                existingOtp.resendCount = 0;
                existingOtp.createdAt = new Date();
                await existingOtp.save();
            }
        }
        const isDeliverable = await hasDeliverableEmail(normalizedEmail);
        if (!isDeliverable) {
            return res.status(400).json({ message: GENERIC_OTP_ERROR });
        }
        let user = await User.findOne({ email: normalizedEmail });
        if (user && user.password) {
            return res.status(400).json({ message: GENERIC_OTP_ERROR });
        }
        if (!user) {
            const userId = await generateUniqueUserId();
            const newUser = await User.create({ email: normalizedEmail, userId });
            try {
                await walletService.createWallet(newUser._id);
            }
            catch (walletErr) {
                await User.findByIdAndDelete(newUser._id);
                console.error("send-otp wallet error:", walletErr.message);
                return res.status(500).json({ message: GENERIC_OTP_ERROR });
            }
            user = newUser;
        }
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = Date.now() + 5 * 60 * 1000;
        if (!existingOtp || Date.now() - new Date(existingOtp.createdAt).getTime() > EMAIL_RATE_WINDOW_MS) {
            await Otp.findOneAndUpdate({ email: normalizedEmail }, {
                $set: {
                    email: normalizedEmail,
                    otp: hashedOtp,
                    ip,
                    deviceId,
                    expiresAt,
                    attempts: 0,
                    resendCount: 1,
                    createdAt: new Date(),
                },
            }, { upsert: true, returnDocument: "after" });
        }
        else {
            await Otp.findOneAndUpdate({ email: normalizedEmail }, {
                $set: {
                    otp: hashedOtp,
                    ip,
                    deviceId,
                    expiresAt,
                    attempts: 0,
                },
                $inc: { resendCount: 1 },
            }, { new: true });
        }
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: "Your SwanCore Activation Code",
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
          <p><strong>Welcome to SwanCore. Please confirm your registration using the activation code below.</strong></p>
          <p><strong>Account activation code:</strong></p>
          <h2 style="color:#f0b90b;">${otp}</h2>
          <p><strong>Security Tips:</strong></p>
          <ul>
            <li>Always keep your password safe and private.</li>
            <li>Your security is our priority.</li>
            <li>Explore our security tips to keep your account protected.</li>
          </ul>
          <p>Don't recognize this activity? Please reset your password and contact support immediately.</p>
        </div>
      `,
        });
        console.log("send-otp request completed");
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        const errorMessage = typeof error === "string" ? error : error?.message || "Unknown error";
        console.error("send-otp error:", errorMessage);
        res.status(500).json({ message: GENERIC_OTP_ERROR });
    }
});
// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const ip = getIp(req);
    const deviceId = generateDeviceId(req);
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP required" });
    }
    try {
        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: "OTP not found" });
        }
        if (record.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired" });
        }
        if (record.deviceId !== deviceId) {
            return res.status(403).json({ message: "Device mismatch detected" });
        }
        if (record.ip !== ip) {
            console.warn("IP changed:", record.ip, ip);
        }
        if (record.attempts >= 5) {
            return res.status(429).json({ message: "Too many attempts" });
        }
        const isMatch = await bcrypt.compare(otp.trim(), record.otp);
        if (!isMatch) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await Otp.deleteOne({ email });
        return res.json({
            success: true,
            message: "OTP verified",
            verified: true,
        });
    }
    catch (err) {
        console.error("verify-otp error:", err.message);
        return res.status(500).json({ message: "Verification failed" });
    }
});
// ================= RESEND OTP =================
router.post("/resend-otp", async (req, res) => {
    const { email, otpId } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!email || !otpId || !isValidEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: GENERIC_OTP_ERROR });
    }
    try {
        const record = await Otp.findOne({ email: normalizedEmail });
        if (!record) {
            return res.status(400).json({ success: false, message: GENERIC_OTP_ERROR });
        }
        const ageMs = Date.now() - new Date(record.createdAt).getTime();
        if (ageMs > EMAIL_RATE_WINDOW_MS) {
            record.resendCount = 0;
            record.createdAt = new Date();
        }
        if ((record.resendCount || 0) >= EMAIL_RATE_LIMIT) {
            return res.status(429).json({ success: false, message: GENERIC_OTP_ERROR });
        }
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        record.otp = hashedOtp;
        record.expiresAt = Date.now() + 5 * 60 * 1000;
        record.attempts = 0;
        record.resendCount = (record.resendCount || 0) + 1;
        await record.save();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: "Your SwanCore Activation Code",
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
          <p><strong>Your new SwanCore activation code:</strong></p>
          <h2 style="color:#f0b90b;">${otp}</h2>
          <p>If you did not request this, please contact support immediately.</p>
        </div>
      `,
        });
        return res.json({ success: true, message: "OTP resent", otpId });
    }
    catch (err) {
        console.error("resend-otp error:", err.message);
        return res.status(500).json({ success: false, message: GENERIC_OTP_ERROR });
    }
});
// ================= SET PASSWORD =================
router.post("/set-password", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password) {
            return res.status(400).json({ message: "User already exists. Please login instead." });
        }
        if (!user.userId) {
            user.userId = await generateUniqueUserId();
        }
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        await walletService.ensureWallet(user._id);
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "7d" });
        res.json({
            success: true,
            message: "Password set successfully",
            sessionToken: token,
            expiresIn: 7 * 24 * 60 * 60,
            user: {
                id: user.id,
                userId: user.userId,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("set-password error:", err.message);
        res.status(500).json({ message: "Error setting password" });
    }
});
// ================= REGISTER =================
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    let newUser;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.password) {
            return res.status(400).json({ message: "User already exists. Please login instead." });
        }
        const userId = await generateUniqueUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        if (existingUser) {
            existingUser.password = hashedPassword;
            existingUser.userId = userId;
            newUser = await existingUser.save();
        }
        else {
            newUser = await User.create({ userId, email, password: hashedPassword });
        }
        // Auto create wallet for new user
        await walletService.createWallet(newUser._id);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                userId: newUser.userId,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    }
    catch (err) {
        if (newUser?._id) {
            await User.findByIdAndDelete(newUser._id);
        }
        console.error("register error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});
// ================= LOGIN =================
router.post("/login", async (req, res) => {
    const { password } = req.body;
    const rawIdentifier = String(req.body.identifier || req.body.email || "").trim();
    if (!rawIdentifier || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    try {
        const isEmail = rawIdentifier.includes("@");
        const identifier = isEmail ? rawIdentifier.toLowerCase() : rawIdentifier.toUpperCase();
        const query = isEmail ? { email: identifier } : { userId: identifier };
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "Please complete registration before logging in." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "7d" });
        user.lastLogin = new Date();
        await user.save();
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                userId: user.userId,
                email: user.email,
                role: user.role,
                name: user.name,
                lastLogin: user.lastLogin
            }
        });
    }
    catch (err) {
        console.error("login error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});
// ================= SUBMIT KYC =================
router.post("/submit-kyc", authMiddleware, async (req, res) => {
    try {
        const { personal, documentType, documentFront, documentBack, selfie } = req.body;
        if (!personal || !documentType || !documentFront || !documentBack || !selfie) {
            return res.status(400).json({ message: "All KYC fields are required" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.kycSubmission = {
            personal: {
                fullName: personal.fullName || "",
                dob: personal.dob || "",
                country: personal.country || "",
                address: personal.address || "",
                city: personal.city || ""
            },
            documentType,
            documentFront: {
                name: documentFront.name || "",
                type: documentFront.type || "",
                size: documentFront.size || 0,
                data: documentFront.data || ""
            },
            documentBack: {
                name: documentBack.name || "",
                type: documentBack.type || "",
                size: documentBack.size || 0,
                data: documentBack.data || ""
            },
            selfie: {
                name: selfie.name || "",
                type: selfie.type || "",
                size: selfie.size || 0,
                data: selfie.data || ""
            },
            submittedAt: new Date(),
            reviewedAt: user.kycSubmission?.reviewedAt || null
        };
        user.kycStatus = "pending";
        user.kycVerified = false;
        await user.save();
        if (global.io) {
            global.io.emit("kycSubmitted", {
                userId: user._id,
                email: user.email,
                name: user.name,
                kycStatus: user.kycStatus,
                submittedAt: user.kycSubmission.submittedAt
            });
        }
        return res.json({ success: true, message: "KYC submitted successfully", userId: user._id });
    }
    catch (err) {
        console.error("submit-kyc error:", err.message);
        return res.status(500).json({ message: "Error submitting KYC" });
    }
});
module.exports = router;

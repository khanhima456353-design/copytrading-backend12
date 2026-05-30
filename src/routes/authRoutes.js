const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();
const User = require("../../models/User");
const Otp = require("../../models/Otp");
<<<<<<< HEAD
const { generateUniqueUserId } = require("../../utils/userIdGenerator");
const { generateDeviceId } = require("../../utils/otpSecurity");
=======
const Wallet = require("../../models/Wallet");
const { generateUniqueUserId } = require("../../utils/userIdGenerator");
const { generateDeviceId } = require("../../utils/otpSecurity");

// ── Auto-initialize wallet for new user ──────────────────────────────────────
const initUserWallet = async (userId) => {
  try {
    await Wallet.findOneAndUpdate(
      { userId, type: "spot" },
      {
        $setOnInsert: {
          userId,
          type: "spot",
          availableBalance: 0,
          lockedBalance: 0,
          borrowedBalance: 0,
          unrealizedPnl: 0,
          equity: 0
        }
      },
      { upsert: true, returnDocument: "after" }
    );
  } catch (err) {
    console.error("initUserWallet error:", err.message);
  }
};
>>>>>>> main

// ================= OTP GENERATOR =================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= GET REAL IP =================
function getIp(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip
  );
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
<<<<<<< HEAD
  console.log("🔥 OTP REQUEST RECEIVED:", req.body);
  console.log("🔥 REQUEST METHOD:", req.method);
  console.log("🔥 REQUEST URL:", req.url);
  const { email } = req.body;

=======
  const { email } = req.body;
>>>>>>> main
  const ip = getIp(req);
  const deviceId = generateDeviceId(req);

  console.log("📧 Email:", email);
  console.log("🌐 IP:", ip);
  console.log("📱 Device ID:", deviceId);

  if (!email) {
    console.log("❌ No email provided");
    return res.status(400).json({ message: "Email required" });
  }

  try {
<<<<<<< HEAD
    console.log("🔍 Checking if user exists...");
    // ✅ CHECK IF USER ALREADY HAS COMPLETE ACCOUNT
    let user = await User.findOne({ email });
    console.log("👤 User found:", !!user);

    if (user && user.password) {
      console.log("❌ User already has password");
=======
    let user = await User.findOne({ email });

    if (user && user.password) {
>>>>>>> main
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }

    if (!user) {
<<<<<<< HEAD
      console.log("🆕 Creating new user...");
      const userId = await generateUniqueUserId();
      console.log("🆔 Generated userId:", userId);
      user = await User.create({ email, userId });
      console.log("✅ User created:", user._id);
    }

    console.log("🔢 Generating OTP...");
    const otp = generateOTP();
    console.log("🔢 OTP generated:", otp);

    console.log("🔐 Hashing OTP...");
    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log("🔐 OTP hashed successfully");

    const expiresAt = Date.now() + 5 * 60 * 1000;
    console.log("💾 Saving OTP to database...");

    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otp: hashedOtp,
        ip,
        deviceId,
        expiresAt,
        createdAt: Date.now(),
        attempts: 0,
        $inc: { resendCount: 1 },
      },
      { upsert: true, new: true }
    );
    console.log("💾 OTP saved to database");

    // ================= SEND OTP EMAIL =================
    console.log("📤 Sending email...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your SwanCore Activation Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
          
          <p><strong>Welcome to SwanCore. Please confirm your registration using the activation code below.</strong></p>

          <p><strong>Account activation code:</strong></p>

          <h2 style="color:#f0b90b;">${otp}</h2>

          <p><strong>Security Tips :</strong></p>
          <ul>
            <li>Always keep your password safe and private—it’s your key to a secure experience.</li>
            <li>Your security is our priority.</li>
            <li>Explore our security tips to keep your account protected.</li>
          </ul>

          <p>Don’t recognize this activity? Please reset your password and contact support immediately—we’re here to help.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully");

    console.log("🎉 OTP process completed successfully");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("❌ Error in send-otp:", error.message);
    console.log("Stack:", error.stack);
=======
      const userId = await generateUniqueUserId();
      user = await User.create({ email, userId });
      await initUserWallet(user._id);
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otp: hashedOtp,
        ip,
        deviceId,
        expiresAt,
        createdAt: Date.now(),
        attempts: 0,
        $inc: { resendCount: 1 },
      },
      { upsert: true, returnDocument: "after" }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
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

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("send-otp error:", error.message);
>>>>>>> main
    res.status(500).json({ message: "Error sending OTP email" });
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

  } catch (err) {
    console.error("verify-otp error:", err.message);
    return res.status(500).json({ message: "Verification failed" });
  }
});

<<<<<<< HEAD
=======
// ================= RESEND OTP =================
>>>>>>> main
router.post("/resend-otp", async (req, res) => {
  const { email, otpId } = req.body;

  if (!email || !otpId) {
    return res.status(400).json({ success: false, message: "Email and OTP ID required" });
  }

  try {
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(404).json({ success: false, message: "OTP request not found" });
    }

    if ((record.resendCount || 0) >= 3) {
      return res.status(429).json({ success: false, message: "Resend limit reached" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
<<<<<<< HEAD
    const expiresAt = Date.now() + 5 * 60 * 1000;

    record.otp = hashedOtp;
    record.expiresAt = expiresAt;
=======

    record.otp = hashedOtp;
    record.expiresAt = Date.now() + 5 * 60 * 1000;
>>>>>>> main
    record.attempts = 0;
    record.resendCount = (record.resendCount || 0) + 1;
    record.createdAt = Date.now();

    await record.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
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
  } catch (err) {
<<<<<<< HEAD
    console.log(err);
=======
    console.error("resend-otp error:", err.message);
>>>>>>> main
    return res.status(500).json({ success: false, message: "Error resending OTP" });
  }
});

<<<<<<< HEAD
=======
// ================= SET PASSWORD =================
>>>>>>> main
router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

<<<<<<< HEAD
    // Check if user already has a password (already registered)
    if (user.password) {
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }

    // Generate userId if not already set
    if (!user.userId) {
      user.userId = await generateUniqueUserId();
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
=======
    if (user.password) {
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }
>>>>>>> main

    if (!user.userId) {
      user.userId = await generateUniqueUserId();
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

<<<<<<< HEAD
    // Generate JWT token
=======
    // Ensure wallet exists for this user
    await initUserWallet(user._id);

>>>>>>> main
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Password set successfully",
      sessionToken: token,
<<<<<<< HEAD
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
=======
      expiresIn: 7 * 24 * 60 * 60,
>>>>>>> main
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email
      }
    });

  } catch (err) {
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

  try {
<<<<<<< HEAD
    // Check if user already exists and has a password
=======
>>>>>>> main
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }

<<<<<<< HEAD
    // Generate unique userId
    const userId = await generateUniqueUserId();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user or update existing one
    let user;
    if (existingUser) {
      // Update existing user with password and userId
=======
    const userId = await generateUniqueUserId();
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (existingUser) {
>>>>>>> main
      existingUser.password = hashedPassword;
      existingUser.userId = userId;
      user = await existingUser.save();
    } else {
<<<<<<< HEAD
      // Create new user
      user = await User.create({
        userId,
        email,
        password: hashedPassword
      });
    }

=======
      user = await User.create({ userId, email, password: hashedPassword });
    }

    // Auto-initialize wallet for new user
    await initUserWallet(user._id);

>>>>>>> main
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
<<<<<<< HEAD
    console.log(err);
=======
    console.error("register error:", err.message);
>>>>>>> main
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
<<<<<<< HEAD
    // Check if identifier is email or userId
    const isEmail = rawIdentifier.includes('@');
=======
    const isEmail = rawIdentifier.includes("@");
>>>>>>> main
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

<<<<<<< HEAD
    // Generate JWT token
=======
    // Ensure wallet exists (for users registered before this update)
    await initUserWallet(user._id);

>>>>>>> main
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "7d" }
    );

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

  } catch (err) {
<<<<<<< HEAD
    console.log(err);
=======
    console.error("login error:", err.message);
>>>>>>> main
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< HEAD
=======
// ================= SUBMIT KYC =================
>>>>>>> main
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
  } catch (err) {
<<<<<<< HEAD
    console.error("Submit KYC error:", err);
=======
    console.error("submit-kyc error:", err.message);
>>>>>>> main
    return res.status(500).json({ message: "Error submitting KYC" });
  }
});

module.exports = router;

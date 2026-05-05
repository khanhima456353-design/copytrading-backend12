const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();
const User = require("../../models/User");
const Otp = require("../../models/Otp");
const { generateDeviceId } = require("../../utils/otpSecurity");
const { verifyCaptcha } = require("../../utils/captcha");

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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
  const { email, captchaToken } = req.body;

  console.log("📩 captchaToken received:", captchaToken);

  const ip = getIp(req);
  const deviceId = generateDeviceId(req);

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
  // 🔐 CAPTCHA VERIFY
  const isHuman = await verifyCaptcha(captchaToken);

  if (!isHuman) {
    console.log("❌ CAPTCHA FAILED");
    return res.status(403).json({ message: "Captcha failed" });
  }

  // ✅ ADD THIS (CREATE USER IF NOT EXISTS)
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
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
    { upsert: true, new: true }
  );

  // ================= SEND OTP EMAIL =================
   transporter.sendMail({
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

      <p style="font-style: italic;">This is an automated message, please do not reply.</p>

      <hr/>

      <p style="text-align:center;"><strong>Stay connected!</strong></p>

      <p style="font-size:12px; color:#666;">
        Disclaimer:Digital asset markets can be dynamic and exciting, with values that may rise or fall over time. Please make thoughtful and informed decisions when investing. SwanCore is committed to empowering you with knowledge, but investment choices remain your responsibility. Always consider your financial goals, experience, and risk tolerance, and seek independent advice if needed. For more information, please review SwanCore Terms of Use and Risk Warning.
      </p>

      <p style="font-size:12px;">
        Kindly note: Stay confident and protected by ensuring you’re engaging with SwanCore. Every step you take with us is carefully designed to keep you secure. Your security is at the heart of everything we do.
      </p>

    </div>
  `
});

// Respond after email is sent successfully
    res.json({ message: "OTP sent" });

  } catch (err) {
    console.log(err);
    // Return error response if any part of the process fails
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

    // ⛔ EXPIRED
    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // ⛔ DEVICE CHECK
    if (record.deviceId !== deviceId) {
      return res.status(403).json({ message: "Device mismatch detected" });
    }

    // ⚠️ SOFT IP CHECK (log only, don't block)
    if (record.ip !== ip) {
      console.warn("IP changed:", record.ip, ip);
    }

    // ⛔ MAX ATTEMPTS
    if (record.attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts" });
    }

    const isMatch = await bcrypt.compare(otp.trim(), record.otp);

    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ SUCCESS
    await Otp.deleteOne({ email });

    return res.json({
      message: "OTP verified",
      verified: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Verification failed" });
  }
});

router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password set successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error setting password" });
  }
});

module.exports = router;
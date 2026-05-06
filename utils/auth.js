const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 🔐 Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// 🔐 Compare password
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-this";

// 🔐 Access Token (short life)
function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

const REFRESH_SECRET = process.env.REFRESH_SECRET || "default-refresh-secret-change-this";

// 🔄 Refresh Token (long life)
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken
};
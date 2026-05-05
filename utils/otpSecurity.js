const crypto = require("crypto");

// simple device fingerprint fallback
function generateDeviceId(req) {
  const ua = req.headers["user-agent"] || "";
  const ip = req.ip || "";
  return crypto.createHash("sha256").update(ua + ip).digest("hex");
}

module.exports = { generateDeviceId };
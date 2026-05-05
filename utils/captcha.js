const axios = require("axios");

async function verifyCaptcha(token) {
  if (!token) {
    console.log("❌ Missing captcha token");
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const { data } = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("🔍 TURNSTILE FULL RESPONSE:", data);

    if (!data.success) {
      console.log("❌ TURNSTILE FAILED:", data["error-codes"]);
    }

    return data.success === true;

  } catch (err) {
    console.log("🚨 Captcha error:", err.response?.data || err.message);
    return false;
  }
}

module.exports = { verifyCaptcha };
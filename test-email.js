const nodemailer = require("nodemailer");
require("dotenv").config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    console.log("Testing email...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "test@example.com",
      subject: "Test Email",
      html: "<h1>Test</h1><p>This is a test email.</p>",
    });
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testEmail();
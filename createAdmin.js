require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin() {
  try {
    // Connect to MongoDB using the same env var as the server
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/copytrading");

    const email = (process.env.DEFAULT_ADMIN_EMAIL || "admin@swancore.com").toLowerCase().trim();
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      isVerified: true,
      balance: 0,
      frozenBalance: 0,
      isBanned: false,
      kycVerified: true,
      kycStatus: "approved"
    });

    await adminUser.save();

    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Please change the password after first login.");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
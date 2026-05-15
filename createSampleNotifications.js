const mongoose = require("mongoose");
const Notification = require("./models/Notification");
const User = require("./models/User");

require("dotenv").config();

async function createSampleNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Sample notifications
    const sampleNotifications = [
      {
        title: "Welcome to SwanCore!",
        message: "Thank you for joining SwanCore. Your account has been successfully created and verified.",
        type: "success",
        priority: "high"
      },
      {
        title: "Security Reminder",
        message: "Please complete your identity verification to unlock full trading features and increase your withdrawal limits.",
        type: "warning",
        priority: "medium"
      },
      {
        title: "Market Update",
        message: "Bitcoin has reached a new all-time high! Stay updated with the latest market trends.",
        type: "info",
        priority: "low"
      },
      {
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM UTC. Trading may be temporarily unavailable.",
        type: "admin",
        priority: "high"
      },
      {
        title: "New Feature Available",
        message: "We've added advanced charting tools to help you make better trading decisions. Check it out in the Trade section!",
        type: "info",
        priority: "medium"
      }
    ];

    // Create notifications for each user
    for (const user of users) {
      console.log(`Creating notifications for user: ${user.email}`);

      for (const sample of sampleNotifications) {
        // Randomize creation time (within last 7 days)
        const randomDays = Math.floor(Math.random() * 7);
        const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);

        await Notification.create({
          userId: user._id,
          title: sample.title,
          message: sample.message,
          type: sample.type,
          priority: sample.priority,
          isRead: Math.random() > 0.7, // 30% chance of being read
          createdAt
        });
      }
    }

    console.log("Sample notifications created successfully!");

    // Count total notifications
    const totalNotifications = await Notification.countDocuments();
    console.log(`Total notifications in database: ${totalNotifications}`);

  } catch (error) {
    console.error("Error creating sample notifications:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
createSampleNotifications();
const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  createBroadcastNotification,
  deleteNotification,
  getUnreadCount
} = require("../controllers/notificationController");

// Import auth middleware
<<<<<<< HEAD
const { authMiddleware } = require("../middleware/authMiddleware");
=======
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
>>>>>>> main

// User routes (require authentication)
router.get("/", authMiddleware, getUserNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/:notificationId/read", authMiddleware, markAsRead);
router.put("/mark-all-read", authMiddleware, markAllAsRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);

// Admin routes (for creating notifications)
<<<<<<< HEAD
router.post("/", createNotification); // Create notification for specific user
router.post("/broadcast", createBroadcastNotification); // Create notification for all users
=======
router.post("/", authMiddleware, adminMiddleware, createNotification);
router.post("/broadcast", authMiddleware, adminMiddleware, createBroadcastNotification);
>>>>>>> main

module.exports = router;
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
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// User routes (require authentication)
router.get("/", authMiddleware, getUserNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/:notificationId/read", authMiddleware, markAsRead);
router.put("/mark-all-read", authMiddleware, markAllAsRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);

// Admin routes (for creating notifications)
router.post("/", authMiddleware, adminMiddleware, createNotification);
router.post("/broadcast", authMiddleware, adminMiddleware, createBroadcastNotification);

module.exports = router;
const Notification = require("../../models/Notification");

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    // Mark all as read when fetching (optional - you might want to mark individually)
    // await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.json({
      success: true,
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        priority: n.priority,
        createdAt: n.createdAt,
        expiresAt: n.expiresAt
      }))
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification marked as read" });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: "All notifications marked as read" });

  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

// Create notification (for admin use)
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type = "info", priority = "medium", expiresAt } = req.body;

    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({
        message: "userId, title, and message are required"
      });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt
      }
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

// Create notification for all users (broadcast)
const createBroadcastNotification = async (req, res) => {
  try {
    const { title, message, type = "info", priority = "medium", expiresAt } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "title and message are required"
      });
    }

    // Get all users
    const User = require("../../models/User");
    const users = await User.find({}, '_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      count: users.length
    });

  } catch (error) {
    console.error("Error creating broadcast notification:", error);
    res.status(500).json({ message: "Error creating broadcast notification" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.json({ success: true, unreadCount: count });

  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  createBroadcastNotification,
  deleteNotification,
  getUnreadCount
};
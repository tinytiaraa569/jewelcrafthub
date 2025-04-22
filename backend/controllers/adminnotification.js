const AdminNotification = require("../model/adminnotifications");
const express = require("express");

const router = express.Router();

// Create a new admin notification
router.post("/admin-notifications", async (req, res) => {
  try {
    const { title, message, icon, user } = req.body;

    const notification = new AdminNotification({
      title,
      message,
      icon,
      user, // optional - user who triggered it
    });

    await notification.save();

    res.status(201).json({ success: true, message: "Admin notification created", notification });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin notification",
      error: error.message,
    });
  }
});

// Get all admin notifications (for dashboard)
router.get("/admin-notifications", async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .populate("user", "name email") // populate the user who triggered it
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin notifications",
      error: error.message,
    });
  }
});

// Mark all as read (optional: you can track per-admin read status if needed)
router.put("/admin-notifications/mark-all-read", async (req, res) => {
  try {
    await AdminNotification.updateMany({ read: false }, { read: true });

    res.status(200).json({ success: true, message: "All admin notifications marked as read" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark as read",
      error: error.message,
    });
  }
});

// Delete a specific admin notification
router.delete("/admin-notifications/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await AdminNotification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Admin notification deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete admin notification",
      error: error.message,
    });
  }
});

module.exports = router;

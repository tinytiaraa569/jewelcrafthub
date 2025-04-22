const UserNotification = require("../model/notification");
const User = require("../model/User");

const express = require("express");

const router = express.Router();

// Create a new notification
router.post("/notifications", async (req, res) => {
  try {
    const { userId, title, message, icon } = req.body;

    const notification = new UserNotification({ userId, title, message, icon });
    await notification.save();

    res.status(201).json({ success: true, message: "Notification created", notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create notification", error: error.message });
  }
});


// Get all notifications for a user
router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await UserNotification.find({ userId }).sort({ createdAt: -1 }); // newest first

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
  }
});


// Mark notification as read
// router.put("/notifications/mark-all-read/:userId", async (req, res) => {
//     try {
//       const { userId } = req.params;
//       await UserNotification.updateMany({ userId, read: false }, { read: true });
  
//       res.status(200).json({ success: true, message: "All notifications marked as read" });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Failed to mark notifications as read", error: error.message });
//     }
//   });

router.put("/notifications/mark-all-read/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Only update this user's notifications
    await UserNotification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read for the user" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark notifications", error: error.message });
  }
});




// Delete a notification
router.delete("/notifications/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await UserNotification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error: error.message });
  }
});


//bulk notifications accordinly to user role 

router.post("/role-notifications", async (req, res) => {
  try {
    const { role, title, message, icon } = req.body;

    const users = await User.find({ status: role });
    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users found with this role" });
    }


    const notifications = users.map((user) => ({
      userId: user._id,
      title,
      message,
      icon,
    }));

    const savedNotifications = await UserNotification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: "Notifications sent to all approved users",
      notifications: savedNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send role-based notifications",
      error: error.message,
    });
  }
});


// Send notifications to selected users
router.post("/user-notifications", async (req, res) => {
  try {
    const { userIds, title, message, icon } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "No user IDs provided" });
    }

    const notifications = userIds.map((userId) => ({
      userId,
      title,
      message,
      icon,
    }));

    const savedNotifications = await UserNotification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: "Notifications sent to selected users",
      notifications: savedNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send user-specific notifications",
      error: error.message,
    });
  }
});

module.exports = router;
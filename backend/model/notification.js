const mongoose = require("mongoose");

const UserNotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    icon: { type: String }, // optional icon URL or emoji
    read: { type: Boolean, default: false }, // track if the notification has been read
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("UserNotification", UserNotificationSchema);

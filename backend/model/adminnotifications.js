const mongoose = require("mongoose");

const AdminNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    icon: { type: String }, // optional icon URL or emoji
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: for showing who triggered it
    read: { type: Boolean, default: false }, // track if the admin has read it
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("AdminNotification", AdminNotificationSchema);

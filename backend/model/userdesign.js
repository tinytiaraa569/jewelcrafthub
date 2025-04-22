const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'image', 'video', or 'file'
  url: { type: String, required: true },  // Local path to the file
  public_id: { type: String, required: true }, // Filename
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  pointsClaimed: {
    type: Boolean,
    default: false, 
  },
  points: {
    type: Number,
    default: 0, 
  },
  pointsCreditedToUser: { type: Boolean, default: false }, 
  pointsWithdrawn: { type: Boolean, default: false }, 
});

const userDesignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String },
    files: [fileSchema], // Array of files (images, videos, etc.)
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Status field with default value
    selectedBrief: { type: mongoose.Schema.Types.Mixed, required: true }, 
    allpoints: { type: Number, default: 0 }, // ✅ Total points from all files
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDesign", userDesignSchema);

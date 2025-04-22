// models/Portfolio.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'image', 'video', or 'file'
  url: { type: String, required: true },  // Local path to the file
  public_id: { type: String, required: true }, // Filename
});

const userportfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    files: [fileSchema], // Array of files (images, videos, etc.)
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPortfolio", userportfolioSchema);

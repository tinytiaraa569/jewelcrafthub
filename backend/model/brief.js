const mongoose = require("mongoose");


const fileSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'image', 'video', or 'file'
  url: { type: String, required: true },  // Local path to the file
  public_id: { type: String, required: true }, // Filename
});

const briefSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    instruction: String,
    targetdate: String,
    targetcount: String,
    rewardPoints: String,
    statusmap: String,
    styling: String,
    dimension: String,
    pearlsize: String,
    diamondweightrange: String,
    diamondshapes: String,
    colorstonerange: String,
    colorstoneshape: String,
    isLive: {
        type: Boolean,
        default: true,
      },
      category: {
        type: Map,
        of: Boolean,  // Instead of String
        default: {},
      },

    files: [fileSchema],
    visibleTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to your User model
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brief", briefSchema);

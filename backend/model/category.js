const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema(
    {
      categoryName: {
        type: String,
        required: true,
        trim: true,
      },
      categoryShortform: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Category", categorySchema);

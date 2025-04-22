const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // new profile feilds
    availability: { type: Boolean, default: true },
    bio: { type: String },
    employmentType: { type: String, enum: ["Full-Time", "Part-Time", "Freelance"], default: "Full-Time" },
    
    experience: { type: String },
    jewelryRole: { type: String },
    profileImage: { type: String }, // Save image URL after upload (like from Cloudinary)
    skills: { type: String },
    specialties: { type: String },
    workingHours: { type: String },
    workingHoursFrom: { type: String },
    workingHoursTo: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    // Points system (default: 0)
    points: { type: Number, default: 0 },  
    
    // Withdrawn points (default: 0)
    withdrawnPoints: { type: Number, default: 0 }, 

     // New field to store the total earnings
     totalEarnings: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

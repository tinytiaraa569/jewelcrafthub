const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const { OAuth2Client } = require("google-auth-library");
const userMiddleware = require("../middleware/usermiddleware");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fs = require("fs");
const path = require("path");

const router = express.Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Sign Up
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "Email already Registered " });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// ✅ Login
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      // ✅ Store token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      // ✅ Also send token in JSON response for frontend
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

// ✅ Add authentication verification route
router.get("/verify", authMiddleware, async (req, res) => {
    try {
      console.log("🛠️ Request Headers:", req.headers);
  
      const user = await User.findById(req.user.userId).select("-password");
  
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      res.json({ message: "Authenticated", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // google login 
  router.post("/google-login", async (req, res) => {
    const { token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const { name, email , picture } = ticket.getPayload();
  
      // Find or create user in your database
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ name, email,avatar: picture });
      }
  
      // Generate JWT token for session
      const jwtToken = generateToken(user._id);
      res.json({
        success: true,
        message: user ? "Login successful" : "Signup successful",
        token: jwtToken,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Invalid Google token" });
    }
  });




// ✅ Forgot Password
router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email,"email")
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // SMTP host (e.g., smtp.gmail.com)
        port: process.env.SMTP_PORT, // SMTP port (587 is for STARTTLS)
        secure: false, // true for port 465, false for 587
        auth: {
          user: process.env.SMTP_EMAIL, // Your email address
          pass: process.env.SMTP_PASS,  // Your app password from Gmail
        },
      });
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const mailOptions = {
        from: `"Your Website Team" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name || "User"},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards, <br/> Your Website Team</p>
          </div>
        `,
      };
  
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ✅ Reset Password
  router.post("/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
  
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
  
      // Additional token expiration check (in case JWT verification is bypassed)
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(400).json({ message: "Token has expired" });
      }
  
      // Check if token exists and hasn't expired in the DB
      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Ensures the token hasn't expired
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token  Please request a new one." });
  
      // Hash and update the new password
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined; // Clear token after use
      user.resetPasswordExpires = undefined; // Clear expiration after use
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



  router.post("/update-user-profile", async (req, res) => {
    try {
      const { email,profileImage, ...updatedFields } = req.body; // Exclude email from being updated

      console.log(profileImage,"profile imag ereceived from fronted")
  
      // Log the request body to debug the incoming data
      console.log("Request Body:", req.body)
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (profileImage) {
        const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, ""); // Remove Base64 prefix
        const imageBuffer = Buffer.from(base64Data, "base64"); // Convert to buffer
  
        // Generate unique filename and directory
        const uniqueFilename = `${user._id}-avatar.png`; // Name based on user ID
        const uploadDir = path.join(__dirname, "../uploads/user/avatar");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  
        // Write image to the upload directory
        const imagePath = path.join(uploadDir, uniqueFilename);
        fs.writeFileSync(imagePath, imageBuffer);
  
        // Save image path in user profile
        user.avatar = `/uploads/user/avatar/${uniqueFilename}`;
      }
  
      // Update other allowed fields
      Object.assign(user, updatedFields);
  
      // Save the updated user document to the database
      await user.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });


  // Get user profile route
  router.get("/get-user-profile", userMiddleware , async (req, res) => {

    try {
      // Fetch user details using the userId from token
      const user = await User.findById(req.userId).select("-password"); // Exclude password field
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
    }
  });


  // DELETE route to delete user
  router.delete('/delete-user/:id', userMiddleware, async (req, res) => {
    try {
      const userId = req.params.id; // Get user ID from the route parameter

      // Find and delete the user from the database
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error, unable to delete user' });
    }
  });



  
  module.exports = router;
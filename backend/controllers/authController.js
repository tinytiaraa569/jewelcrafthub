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

const ActivationMail = require('../utlis/activation')

const router = express.Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// ✅ Sign Up
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "Email already Registered " });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      // const user = await User.create({ name, email, password: hashedPassword });

      const user = {
        name,
        email,
        password: hashedPassword,
      };
      const activationToken = createActivationToken(user);
      const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;
      
      const htmlMessage = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate Your JewelCrafthub Designer Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f5f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 20px 0;">
        <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 0 auto; max-width: 600px;">
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(to right, #d4af37, #f5e7a3, #d4af37); padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <!-- Logo Placeholder - Replace with your actual logo -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://via.placeholder.com/150x60/ffffff/d4af37?text=JewelCrafthub" alt="JewelCrafthub" style="display: block; width: 200px; height: auto; margin-bottom: 15px;">
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 style="color: #5d4037; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 1px 1px 2px rgba(255,255,255,0.5);">Designer Marketplace</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Welcome Banner -->
          <tr>
            <td style="background-color: #5d4037; padding: 15px 40px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 400;">Where Talent Meets Opportunity</h2>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h2 style="color: #5d4037; font-size: 22px; margin: 0 0 20px 0;">Welcome to JewelCrafthub, ${name}!</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for joining the only platform built specifically for manual jewelry designers, by jewelry industry pioneers.</p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">To complete your registration and activate your designer account, please click the button below:</p>
                    
                    <!-- Button -->
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px 0 30px 0;">
                          <table cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td align="center" style="border-radius: 4px;" bgcolor="#d4af37">
                                <a href="${activationUrl}" target="_blank" style="border: solid 1px #d4af37; border-radius: 4px; color: #ffffff; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 30px; text-decoration: none; background-color: #d4af37;">Activate My Designer Account</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">This activation link will expire in 5 minutes for security reasons.</p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p style="color: #777777; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0; word-break: break-all;"><a href="${activationUrl}" style="color: #d4af37; text-decoration: none;">${activationUrl}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- How It Works Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #eeeeee; padding-top: 30px;">
                <tr>
                  <td>
                    <h3 style="color: #5d4037; font-size: 20px; margin: 0 0 20px 0; text-align: center;">How JewelCrafthub Works</h3>
                    
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 50px; height: 50px; background-color: #f5e7a3; border-radius: 50%; text-align: center; line-height: 50px; font-weight: bold; color: #5d4037; font-size: 20px;">1</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <h4 style="color: #5d4037; margin: 0 0 5px 0; font-size: 18px;">Upload Your Designs</h4>
                          <p style="color: #666666; margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">Share your unique jewelry designs with our community. Upload sketches, 3D models, or photographs of your handcrafted pieces.</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 50px; height: 50px; background-color: #f5e7a3; border-radius: 50%; text-align: center; line-height: 50px; font-weight: bold; color: #5d4037; font-size: 20px;">2</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <h4 style="color: #5d4037; margin: 0 0 5px 0; font-size: 18px;">Get Discovered</h4>
                          <p style="color: #666666; margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">Your designs will be showcased to our network of jewelry enthusiasts, collectors, and manufacturers looking for fresh talent.</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 50px; height: 50px; background-color: #f5e7a3; border-radius: 50%; text-align: center; line-height: 50px; font-weight: bold; color: #5d4037; font-size: 20px;">3</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <h4 style="color: #5d4037; margin: 0 0 5px 0; font-size: 18px;">Earn Money</h4>
                          <p style="color: #666666; margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">Get paid when your designs are purchased, licensed, or commissioned. Turn your creative passion into a profitable career.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
         <!-- Designer Process Steps -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #eeeeee; padding-top: 30px;">
                  <tr>
                    <td>
                      <h3 style="color: #5d4037; font-size: 20px; margin: 0 0 20px 0; text-align: center;">Designer Process</h3>

                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                       <td width="33%" align="center" style="padding: 0 5px;">
                            <img src="https://img.icons8.com/fluency/96/upload.png" alt="Upload Design" style="width: 60px; height: 60px; margin-bottom: 10px;">
                            <p style="color: #5d4037; margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Step 1: Upload Your Design</p>
                            <p style="color: #666666; margin: 0; font-size: 13px; line-height: 1.4;">Create your profile, explore detailed briefs from verified jewelry businesses, and upload original sketches or concept designs with annotations.</p>
                          </td>
                          <td width="33%" align="center" style="padding: 0 5px;">
                            <img src="https://img.icons8.com/color/96/approval--v1.png" alt="Design Approval" style="width: 60px; height: 60px; margin-bottom: 10px;">
                            <p style="color: #5d4037; margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Step 2: Design Review</p>
                            <p style="color: #666666; margin: 0; font-size: 13px; line-height: 1.4;">  Your design will be reviewed based on style inspirations, material requirements, and deadline compliance by experienced jewelry brands.</p>
                          </td>
                          <td width="33%" align="center" style="padding: 0 5px;">
                            <img src="https://img.icons8.com/color/96/money--v1.png" alt="Earn Credits" style="width: 60px; height: 60px; margin-bottom: 10px;">
                            <p style="color: #5d4037; margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Step 3: Earn Rewards</p>
                            <p style="color: #666666; margin: 0; font-size: 13px; line-height: 1.4;">Once your design is approved, you’ll earn credits or commissions directly to your account. The more popular your design, the more you earn!</p>
                          </td>

                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          
         
          
          <!-- Get Started Box -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff9e6; border-radius: 6px; padding: 20px;">
                <tr>
                  <td>
                    <h3 style="color: #5d4037; font-size: 18px; margin: 0 0 15px 0; text-align: center;">Ready to Start Earning?</h3>
                    <p style="color: #5d4037; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                      After activating your account, upload your first design and start your journey as a professional jewelry designer.
                    </p>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center">
                          <div style="background-color: #d4af37; color: white; font-weight: bold; padding: 12px 25px; border-radius: 4px; display: inline-block;">Upload Your First Design</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(to right, #5d4037, #8d6e63, #5d4037); padding: 30px 40px; border-radius: 0 0 8px 8px; text-align: center;">
              <!-- Social Media Icons -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 13px;">
               <tr>
              <td align="center">

                <!-- Phone (white icon) -->
                <a href="tel:+1234567890" target="_blank" style="display: inline-block; margin: 0 10px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" alt="Phone" style="width: 25px; height: 25px;">
                </a>

                  <!-- Email (white icon) -->
                <a href="mailto:yourname@example.com" target="_blank" style="display: inline-block; margin: 0 10px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/mail.png" alt="Email" style="width: 25px; height: 25px;">
                </a>

                <!-- Facebook (white icon) -->
                <a href="https://www.facebook.com/yourpage" target="_blank" style="display: inline-block; margin: 0 10px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" style="width: 25px; height: 25px;">
                </a>

                <!-- Instagram (white icon) -->
                <a href="https://www.instagram.com/yourprofile" target="_blank" style="display: inline-block; margin: 0 10px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" style="width: 25px; height: 25px;">
                </a>
                
              </td>
            </tr>


              </table>
              
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">© ${new Date().getFullYear()} JewelCrafthub. All rights reserved.</p>
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Created by jewelry industry pioneers for manual jewelry designers</p>
              <p style="color: #ffffff; font-size: 14px; margin: 0;">If you have any questions, please contact our designer support team at <a href="mailto:designers@jewelcrafthub.com" style="color: #f5e7a3; text-decoration: none;">designers@jewelcrafthub.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await ActivationMail({
        email: email,
        subject: "Activate Your JewelCrafthub Account",
        message: htmlMessage,
      });

      res.status(201).json({
        success: true,
        message: `Activation link sent to ${user?.email}. Please check your inbox.`,
      });
      // res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/activation", async (req, res) => {
    try {
      const { activation_token } = req.body;
  
      const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
      if (!newUser) return res.status(400).json({ message: "Invalid or expired activation token" });
  
      const { name, email, password } = newUser;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });
  
      const user = await User.create({ name, email, password });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.status(201).json({
        message: "Account activated successfully",
        token,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        from: `"JewelCrafthub Team" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name || "User"},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards, <br/> JewelCrafthub Team</p>
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
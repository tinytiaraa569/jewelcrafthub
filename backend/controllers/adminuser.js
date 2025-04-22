const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../model/adminuser");
const User = require("../model/User")
const UserPortfolio = require("../model/userportfolio")


const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { protectAdmin } = require("../middleware/protectAdmin");

dotenv.config(); // Load environment variables

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


router.post("/admin-signup", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    role = role || "admin";

    const admin = await Admin.create({ name, email, password: hashedPassword, role });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// 🔹 ADMIN LOGIN ROUTE
router.post("/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = generateToken(admin._id);
  
      // Set Cookie
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Secure only in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      console.log("🔹 Set-Cookie Header Sent:", res.getHeaders()["set-cookie"]);
  
      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      });
    } catch (error) {
      console.error("Admin Login Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  
  // 🔹 CHECK AUTH ROUTE
  router.get("/check-auth", async (req, res) => {
    try {
      console.log("🔹 Cookies Received:", req.cookies);
  
      const token = req.cookies?.admin_token;
      console.log("🔹 Received Token:", token);
  
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 Decoded Token:", decoded);
  
      const admin = await Admin.findById(decoded.id).select("-password");
      console.log("🔹 Admin Found:", admin);
  
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      res.status(200).json(admin);
    } catch (error) {
      console.error("Auth Check Error:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  

  // admin logout process
  router.post("/admin-logout", async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
  });



  // Update Admin Profile
  router.put("/update-admin-profile", async (req, res) => {
  try {
    const { email, profileImage, ...updatedFields } = req.body; // Exclude email from updates

    console.log("Profile Image Received from Frontend:", profileImage);
    console.log("Request Body:", req.body);

    // Find Admin by Email
    const adminUser = await Admin.findOne({ email }); // Ensure it's an admin user
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Handle Profile Image Upload (if provided)
    if (profileImage) {
      const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, ""); // Remove Base64 prefix
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Generate unique filename
      const uniqueFilename = `${adminUser._id}-avatar.png`;
      const uploadDir = path.join(__dirname, "../uploads/admin/avatar");

      // Ensure Upload Directory Exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save Image to Server
      const imagePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(imagePath, imageBuffer);

      // Update Profile Image Path
      adminUser.avatar = `/uploads/admin/avatar/${uniqueFilename}`;
    }

    // Update Allowed Fields
    Object.assign(adminUser, updatedFields);

    // Save Admin Data
    await adminUser.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        avatar: adminUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


//profile get ffor admin
router.get("/admin-profile",protectAdmin , async (req, res) => {

try {
  // Ensure admin is authenticated (from middleware)
  const adminId = req.admin.id; // Assuming middleware adds `req.admin`

  // Fetch admin details
  const admin = await Admin.findById(adminId).select("-password"); // Exclude password

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  res.status(200).json(admin);
} catch (error) {
  res.status(500).json({ message: "Server Error" });
}
});

router.get("/all-admins",protectAdmin , async (req, res) => {
try {
  // Check if the logged-in user is a superadmin
  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Superadmin only." });
  }

  // Fetch all admins except passwords
  const admins = await Admin.find().select("-password");

  res.status(200).json(admins);
} catch (error) {
  res.status(500).json({ message: "Server error", error: error.message });
}
});


// Update another admin's info (only superadmin can change role)
router.put("/update-admin/:id", protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const currentAdmin = req.admin; // from protectAdmin middleware

    const targetAdmin = await Admin.findById(id);
    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Allow update of name/email
    if (name) targetAdmin.name = name;
    if (email) targetAdmin.email = email;

    // Only superadmin can change role
    if (role && role !== targetAdmin.role) {
      if (currentAdmin.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmins can change roles" });
      }
      targetAdmin.role = role;
    }

    await targetAdmin.save();

    res.status(200).json({
      message: "Admin updated successfully",
      admin: {
        _id: targetAdmin._id,
        name: targetAdmin.name,
        email: targetAdmin.email,
        role: targetAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Delete an admin (only superadmin can delete)
router.delete("/delete-admin/:id", protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Only superadmin can delete admins
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmins can delete admins" });
    }

    // Prevent superadmin from deleting themselves (optional but recommended)
    if (req.admin._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Get all users (admin only)
router.get("/all-users", protectAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 }); // 🆕 Latest users first

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PATCH /api/user/update-status/:id
router.patch("/update-status/:id", protectAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    // Basic validation
    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User ${status} successfully`, user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET /api/user/:id/portfolio
router.get("/:id/portfolio", protectAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const portfolios = await UserPortfolio.find({ user: userId }).sort({ createdAt: -1 });

    if (!portfolios || portfolios.length === 0) {
      return res.status(404).json({ message: "No portfolio found for this user" });
    }

    res.status(200).json(portfolios);
  } catch (error) {
    console.error("Error fetching user portfolio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/user/:id
router.delete("/delete-user/:id", protectAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally: delete associated portfolio too
    // await UserPortfolio.deleteMany({ user: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//get a user with user ID
router.get("/get-user-ID/:id", protectAdmin, async (req, res) => {

try {
  const userId = req.params.id;

  // Check if ID is valid Mongo ObjectId
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  const user = await User.findById(userId).select('-password'); // exclude password

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, user });
} catch (error) {
  console.error('Error fetching user by ID:', error);
  res.status(500).json({ success: false, message: 'Server error' });
}
});


module.exports = router;

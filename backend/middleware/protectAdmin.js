const jwt = require("jsonwebtoken");
const Admin = require("../model/adminuser");

exports.protectAdmin = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // Debugging line

    const token = req.cookies.admin_token; // ✅ Get token from cookies

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line

    // Fetch admin and attach to request
    req.admin = await Admin.findById(decoded.id).select("-password");
    console.log("Admin Found:", req.admin); // Debugging line

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Debugging line
    res.status(401).json({ message: "Not authorized" });
  }
};

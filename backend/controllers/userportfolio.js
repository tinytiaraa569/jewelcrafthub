// controllers/portfolioController.js
const fs = require("fs");
const path = require("path");
const express = require("express");
const UserPortfolio = require("../model/userportfolio");
const userMiddleware = require("../middleware/usermiddleware");

const router = express.Router();
const jwt = require("jsonwebtoken"); // Import JWT

// Ensure the local folder exists
const uploadPath = path.join(__dirname, "../uploads/user/portfolio");
fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if it doesn't exist

// Create Portfolio - Upload files manually without Multer



// Create Portfolio - Save files manually without Multer
// Helper function to sanitize file names
const sanitizeFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

// POST /portfolio/create
router.post("/portfolio/create", async (req, res) => {
  console.log("User from token:", req.body);

  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided or invalid format" });
    }

    // Extract and decode the token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token
    console.log("Decoded Token:", decoded);

    const userId = decoded.userId;

    const { title, description, files } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }
    // Define user-specific upload path
         const userUploadPath = path.join(uploadPath, userId.toString());
         fs.mkdirSync(userUploadPath, { recursive: true }); // Create user-specific folder if it doesn't exist
     

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = file.content.split(";base64,").pop(); // Extract base64 content
      const fileExtension = file.name.split(".").pop().toLowerCase(); // Extract the original file extension
      const sanitizedFileName = sanitizeFileName(file.name.split(".")[0]); // Sanitize file name (excluding extension)

      // Generate a unique and descriptive file name
      const fileName = `${Date.now()}-${userId}-${sanitizedFileName}.${fileExtension}`;
      const filePath = path.join(userUploadPath, fileName);

      // Write base64 data to file
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

      // Determine file type (image, video, CAD, or generic file)
      const fileType = (() => {
        if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) return "image";
        if (["mp4", "avi", "mov"].includes(fileExtension)) return "video";
        if (["stl", "dwg", "obj"].includes(fileExtension)) return "cad";
        return "file";
      })();

      // Add file details to the uploaded files array
      uploadedFiles.push({
        type: fileType,
        url: `/uploads/user/portfolio/${userId}/${fileName}`,
        public_id: fileName, // Optionally, store a unique public ID
      });
    }

    // Create new portfolio document in the database
    const newPortfolio = new UserPortfolio({
      user: userId,
      title,
      description,
      files: uploadedFiles,
    });

    await newPortfolio.save();
    res.status(201).json({ message: "Portfolio created successfully", portfolio: newPortfolio });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({ error: "Server error" });
  }
});

  

// Get User's Portfolios
router.get("/portfolio/:userId", async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from route parameters
    const portfolios = await UserPortfolio.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(portfolios);  // Return portfolios
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    res.status(500).json({ error: "Server error" });
  }
});



router.delete("/portfolio/delete/:id" ,async(req,res)=>{
  try {
    const { id } = req.params; // Extract ID from route parameters

    // Find and delete the portfolio
    const deletedPortfolio = await UserPortfolio.findByIdAndDelete(id);

    if (!deletedPortfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    return res.status(200).json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
})



module.exports = router;

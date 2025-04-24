const fs = require("fs");
const path = require("path");
const express = require("express");
const User = require("../model/User")
const UserDesign = require("../model/userdesign");
const userToken = require("../middleware/usertoken");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import JWT
const { protectAdmin } = require("../middleware/protectAdmin");

const FormData = require("form-data");
const { Buffer } = require("buffer");
const fetch = require("node-fetch"); // Optional for older Node.js (<18)

// Ensure the local folder exists
const uploadPath = path.join(__dirname, "../uploads/user/design");
fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if it doesn't exist

// Helper function to sanitize file names
const sanitizeFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

// POST /user-design/create
router.post("/user-design/create", async (req, res) => {
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

    const { title, category, type, files ,brief  } = req.body;

    // Validation for required fields
    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }

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
        url: `/uploads/user/design/${userId}/${fileName}`, 
        public_id: fileName,
      });
    }

    // Create new design document in the database
    const newDesign = new UserDesign({
      user: userId,
      title,
      type,
      category, // category field
      files: uploadedFiles,
      selectedBrief:brief,
      status: "pending", // Status defaults to "pending"
    });

    await newDesign.save();
    res.status(201).json({ message: "Design created successfully", design: newDesign });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/user-design/my-designs/:id", userToken, async (req, res) => {
  try {
    const userId = req.userId; // Extract userId from request object (set by the middleware)

    // Fetch all designs for the user, sorted by creation date (latest first)
    const userDesigns = await UserDesign.find({ user: userId }).sort({ createdAt: -1 });

    if (userDesigns.length === 0) {
      return res.status(404).json({ message: "No designs found for this user." });
    }

    res.status(200).json({ message: "User designs retrieved successfully", designs: userDesigns });
  } catch (error) {
    console.error("Error fetching user designs:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /user-design/all-designs
router.get("/user-design/all-designs", protectAdmin ,async (req, res) => {
  try {
    const allDesigns = await UserDesign.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All designs retrieved successfully",
      designs: allDesigns,
    });
  } catch (error) {
    console.error("Error fetching all designs:", error);
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/check-similarity", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Download image as ArrayBuffer
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      throw new Error(`Failed to download image: ${imgRes.statusText}`);
    }
    const arrayBuffer = await imgRes.arrayBuffer();

    // Convert to buffer
    const buffer = Buffer.from(arrayBuffer);

    // Prepare form data
    const form = new FormData();
    form.append("file", buffer, "test.jpg");

    // Send to similarity engine using fetch
    const similarityRes = await fetch("https://jewelcrafthub.onrender.com/match", {
      method: "POST",
      headers: form.getHeaders(),
      body: form,
    });

    if (!similarityRes.ok) {
      throw new Error(`Similarity engine failed: ${similarityRes.statusText}`);
    }

    const data = await similarityRes.json();
    res.json(data);
  } catch (error) {
    console.error("Similarity check failed:", error.message);
    res.status(500).json({ error: "Similarity check failed" });
  }
});



// router.patch('/update-file-status/:id',protectAdmin ,async (req, res) => {
//   try {
//     const designId = req.params.id;
//     const { updatedFiles } = req.body; // [{ url, status }, ...]

//     const design = await UserDesign.findById(designId);
//     if (!design) return res.status(404).json({ message: "Design not found" });

//     // Update statuses of individual files
//     design.files.forEach(file => {
//       const match = updatedFiles.find(f => f.url === file.url);
//       if (match) file.status = match.status;
//     });
//       // Apply overall design status logic
//       const total = design.files.length;
//       const approvedCount = design.files.filter(f => f.status === 'approved').length;
//       const rejectedCount = design.files.filter(f => f.status === 'rejected').length;
      
//       // Apply new rejection threshold logic
//       if (approvedCount === total) {
//         design.status = 'approved';
//       } else if (rejectedCount / total > 0.8) {
//         design.status = 'rejected';
//       } else {
//         design.status = 'approved';
//       }
      
//     await design.save();

//     res.status(200).json({ message: "Statuses updated", design });
//   } catch (error) {
//     console.error("Error updating statuses:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


//wrokign
// router.patch('/update-file-status/:id', protectAdmin, async (req, res) => {
//   try {
//     const designId = req.params.id;
//     const { updatedFiles } = req.body;

//     const design = await UserDesign.findById(designId);
//     if (!design) return res.status(404).json({ message: "Design not found" });

//     if (!design.allpoints) design.allpoints = 0;

//     design.files.forEach(file => {
//       const match = updatedFiles.find(f => f.url === file.url);
//       if (!match) return;

//       const prevStatus = file.status;
//       const newStatus = match.status;

//       if (file.pointsClaimed === undefined) file.pointsClaimed = false;
//       if (file.points === undefined) file.points = 0;

//       // Check if status is changing
//       if (prevStatus !== newStatus) {
//         if (newStatus === 'approved' && !file.pointsClaimed) {
//           file.status = 'approved';
//           file.pointsClaimed = true;
//           file.points = 1;
//         } else if (newStatus === 'rejected' && file.pointsClaimed) {
//           file.status = 'rejected';
//           file.pointsClaimed = false;
//           file.points = 0;
//         } else {
//           file.status = newStatus;
//         }
//       }
//     });

//     // ✅ Recalculate allpoints
//     design.allpoints = design.files.reduce((sum, f) => sum + (f.points || 0), 0);

//     // ✅ Check if design is fully approved
//     const totalFiles = design.files.length;
//     const approvedCount = design.files.filter(f => f.status === 'approved').length;
//     const rejectedCount = design.files.filter(f => f.status === 'rejected').length;

//     if (approvedCount === totalFiles && design.allpoints === totalFiles) {
//       design.status = 'approved';
//     } else if (rejectedCount / totalFiles > 0.8) {
//       design.status = 'rejected';
//     } else {
//       design.status = 'approved'; // Or keep it pending if needed
//     }

//     await design.save();

//      // ✅ UPDATE USER POINTS BASED ON ALL THEIR DESIGNS
//      const userId = design.user;
//      const allDesigns = await UserDesign.find({ user: userId });
 
//      const totalUserPoints = allDesigns.reduce((acc, d) => acc + (d.allpoints || 0), 0);
 
//      await User.findByIdAndUpdate(userId, { points: totalUserPoints });
 
//      res.status(200).json({
//        message: "Statuses & allpoints updated, user points recalculated",
//        design,
//        totalUserPoints,
//      });

//     // res.status(200).json({ message: "Statuses & allpoints updated", design });
//   } catch (error) {
//     console.error("Error updating statuses:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


router.patch('/update-file-status/:id', protectAdmin, async (req, res) => {
  try {
    const designId = req.params.id;
    const { updatedFiles } = req.body;

    // Fetch the design object
    const design = await UserDesign.findById(designId);
    if (!design) return res.status(404).json({ message: "Design not found" });

    // Ensure allpoints is initialized
    if (!design.allpoints) design.allpoints = 0;

    // Loop through the files and update their statuses
    design.files.forEach(file => {
      const match = updatedFiles.find(f => f.url === file.url);
      if (!match) return;

      const prevStatus = file.status;
      const newStatus = match.status;

      // Ensure default values for file properties
      if (file.pointsClaimed === undefined) file.pointsClaimed = false;
      if (file.points === undefined) file.points = 0;
      if (file.pointsCreditedToUser === undefined) file.pointsCreditedToUser = false;
      if (file.pointsWithdrawn === undefined) file.pointsWithdrawn = false;

      // Handle status changes and adjust points accordingly
      if (prevStatus !== newStatus) {
        if (newStatus === 'approved') {
          file.status = 'approved';
          file.pointsClaimed = true;
          file.points = 1;

          // Only credit points if they haven't been credited already
          if (!file.pointsCreditedToUser) {
            file.pointsCreditedToUser = true;
            design.allpoints += 1; // Increment total points for the design
          }
        } else if (newStatus === 'rejected') {
          file.status = 'rejected';
          file.pointsClaimed = false;
          file.points = 0;

          // If the file was previously approved and points were credited, subtract them
          if (file.pointsCreditedToUser) {
            design.allpoints -= 1;
            file.pointsCreditedToUser = false; // Reset the credited flag
          }
        } else {
          file.status = newStatus;
        }
      }
    });

    // ✅ Recalculate allpoints from scratch by checking each file's status and pointsClaimed flag
    design.allpoints = design.files.reduce((sum, file) => {
      // Add points only if the file is approved and pointsClaimed is true
      return sum + (file.status === 'approved' && file.pointsClaimed ? 1 : 0);
    }, 0);

    // Debugging: Log the updated design and allpoints for inspection
    console.log('Updated design:', design);
    console.log('Total points for this design:', design.allpoints);

    // ✅ Check if design is fully approved or rejected based on the file statuses
    const totalFiles = design.files.length;
    const approvedCount = design.files.filter(f => f.status === 'approved').length;
    const rejectedCount = design.files.filter(f => f.status === 'rejected').length;

    if (approvedCount === totalFiles && design.allpoints === totalFiles) {
      design.status = 'approved';
    } else if (rejectedCount / totalFiles > 0.8) {
      design.status = 'rejected';
    } else {
      design.status = 'approved'; // Or keep it pending if needed
    }

    // Save updated design
    await design.save();

    // ✅ Recalculate total points for the user by summing up all the points from all designs
    const userId = design.user;
    const allDesigns = await UserDesign.find({ user: userId });

    const totalUserPoints = allDesigns.reduce((acc, d) => acc + (d.allpoints || 0), 0);
    await User.findByIdAndUpdate(userId, { points: totalUserPoints });

    // Send response with the updated design and total user points
    res.status(200).json({
      message: "Statuses updated, points recalculated properly",
      design,
      totalUserPoints,
    });
  } catch (error) {
    console.error("Error updating statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//rank of a user


router.patch('/user-rank/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch all user designs
    const allUserDesigns = await UserDesign.find();

    // Create a map of userId -> approved file count
    const approvedMap = {};

    allUserDesigns.forEach((design) => {
      const uid = design.user.toString();
      const approvedFiles = design.files?.filter(
        (file) => file.status === "approved"
      ) || [];
      const approvedCount = approvedFiles.length;

      if (!approvedMap[uid]) {
        approvedMap[uid] = approvedCount;
      } else {
        approvedMap[uid] += approvedCount;
      }
    });

    // Sort users by approved files in descending order
    const sortedUsers = Object.entries(approvedMap)
      .sort((a, b) => b[1] - a[1]) // sort by approved file count
      .map(([uid]) => uid);

    // Find rank (1-based index)
    const rank = sortedUsers.indexOf(userId) + 1;

    return res.status(200).json({ rank });
  } catch (error) {
    console.error("Error getting user ranking:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


// get all user rank 

router.patch('/all-user-rank', async (req, res) => {
  try {
    // Fetch all user designs
    const allUserDesigns = await UserDesign.find();

    // Create a map of userId -> approved file count
    const approvedMap = {};

    allUserDesigns.forEach((design) => {
      const uid = design.user.toString();
      const approvedFiles = design.files?.filter(
        (file) => file.status === "approved"
      ) || [];
      const approvedCount = approvedFiles.length;

      if (!approvedMap[uid]) {
        approvedMap[uid] = approvedCount;
      } else {
        approvedMap[uid] += approvedCount;
      }
    });

    // Sort users by approved files in descending order
    const sortedUsers = Object.entries(approvedMap)
      .sort((a, b) => b[1] - a[1]) // Sort by approved file count
      .map(([uid]) => uid);

    // Create a ranking map (1-based rank)
    const rankMap = {};
    sortedUsers.forEach((uid, index) => {
      rankMap[uid] = index + 1; // 1-based rank
    });

    // Return the ranks for all users
    const usersWithRank = sortedUsers.map((uid) => {
      return {
        userId: uid,
        rank: rankMap[uid],
      };
    });

    return res.status(200).json({ rank: usersWithRank });
  } catch (error) {
    console.error("Error getting user rankings:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


//recredited solutinn

module.exports = router;

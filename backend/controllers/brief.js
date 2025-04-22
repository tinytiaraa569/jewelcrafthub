const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { protectAdmin } = require("../middleware/protectAdmin");
const Brief = require("../model/brief");

// Ensure upload base folder exists
const uploadPath = path.join(__dirname, "../uploads/brief");
fs.mkdirSync(uploadPath, { recursive: true });

// Helper to sanitize folder and file names
const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_.]/gi, "-")  // replace special chars with hyphen
    .replace(/-+/g, "-");             // replace multiple hyphens with one

// POST /brief/create (Admin Protected)
router.post("/brief/create", protectAdmin, async (req, res) => {
  console.log(req.body, "requested body data");

  try {
    const {
      name,
      title,
      instruction,
      targetdate,
      targetcount,
      rewardPoints,
      statusmap,
      styling,
      dimension,
      pearlsize,
      diamondweightrange,
      diamondshapes,
      colorstonerange,
      colorstoneshape,
      category,
      files,
    } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one file." });
    }

    // Use brief title or name to create a folder
    const folderName = sanitizeFileName(name || `brief-${Date.now()}`);
    const briefUploadPath = path.join(uploadPath, folderName);
    fs.mkdirSync(briefUploadPath, { recursive: true });

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = file.content.split(";base64,").pop();
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const sanitizedFileName = sanitizeFileName(file.name.split(".")[0]);

      const fileName = `${Date.now()}-${sanitizedFileName}.${fileExtension}`;
      const filePath = path.join(briefUploadPath, fileName);

      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

      const fileType = (() => {
        if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) return "image";
        if (["mp4", "avi", "mov"].includes(fileExtension)) return "video";
        if (["stl", "dwg", "obj"].includes(fileExtension)) return "cad";
        return "file";
      })();

      uploadedFiles.push({
        type: fileType,
        url: `/uploads/brief/${folderName}/${fileName}`,
        public_id: fileName,
      });
    }

    const brief = new Brief({
      name,
      title,
      instruction,
      targetdate,
      targetcount,
      rewardPoints,
      statusmap,
      styling,
      dimension,
      pearlsize,
      diamondweightrange,
      diamondshapes,
      colorstonerange,
      colorstoneshape,
      category,
      files: uploadedFiles,
    });

    await brief.save();

    res.status(201).json({
      message: "Brief created successfully",
      brief,
    });
  } catch (error) {
    console.error("Error creating brief:", error);
    res.status(500).json({ error: "Server error while creating brief" });
  }
});


// GET /briefs (Get All Briefs)
// GET /briefs (Get All Briefs)
router.get("/get-all-briefs", async (req, res) => {
  try {
    // Fetch all briefs from the database
    const briefs = await Brief.find().sort({ createdAt: -1 });

    // Get the current date
    const currentDate = new Date();

    // Loop through each brief to check if the targetdate has passed
    for (let brief of briefs) {
      const targetDate = new Date(brief.targetdate);

      // If the target date has passed, update isLive to false
      if (targetDate < currentDate) {
        brief.isLive = false;
        await brief.save(); // Save the updated brief in the database
      }
    }

    // Send the briefs as response
    res.status(200).json({ briefs });
  } catch (error) {
    console.error("Error fetching briefs:", error);
    res.status(500).json({ error: "Server error while fetching briefs" });
  }
});


//edit of a breif
  router.put("/brief-edit/:id", protectAdmin, async (req, res) => {
    try {
      const {
        name,
        title,
        instruction,
        targetdate,
        targetcount,
        rewardPoints,
        statusmap,
        styling,
        dimension,
        pearlsize,
        diamondweightrange,
        diamondshapes,
        colorstonerange,
        colorstoneshape,
        category,
        files,
      } = req.body;
  
      const brief = await Brief.findById(req.params.id);
      if (!brief) {
        return res.status(404).json({ error: "Brief not found" });
      }
  
      // Only update if a field is present
      if (name !== undefined) brief.name = name;
      if (title !== undefined) brief.title = title;
      if (instruction !== undefined) brief.instruction = instruction;
      if (targetdate !== undefined) brief.targetdate = targetdate;
      if (targetcount !== undefined) brief.targetcount = targetcount;
      if (rewardPoints !== undefined) brief.rewardPoints = rewardPoints;
      if (statusmap !== undefined) brief.statusmap = statusmap;
      if (styling !== undefined) brief.styling = styling;
      if (dimension !== undefined) brief.dimension = dimension;
      if (pearlsize !== undefined) brief.pearlsize = pearlsize;
      if (diamondweightrange !== undefined) brief.diamondweightrange = diamondweightrange;
      if (diamondshapes !== undefined) brief.diamondshapes = diamondshapes;
      if (colorstonerange !== undefined) brief.colorstonerange = colorstonerange;
      if (colorstoneshape !== undefined) brief.colorstoneshape = colorstoneshape;
      if (category !== undefined) brief.category = category;
  
      // Handle new file uploads if files are provided
      if (Array.isArray(files) && files.length > 0) {
        const folderName = sanitizeFileName(name || brief.name || `brief-${Date.now()}`);
        const briefUploadPath = path.join(uploadPath, folderName);
        fs.mkdirSync(briefUploadPath, { recursive: true });
  
        const uploadedFiles = [];
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
  
          // Keep existing files if they already have a URL
          if (file.url && file.public_id) {
            uploadedFiles.push(file);
            continue;
          }
  
          const base64Data = file.content?.split(";base64,").pop();
          if (!base64Data) continue; // skip invalid files
  
          const fileExtension = file.name.split(".").pop().toLowerCase();
          const sanitizedFileName = sanitizeFileName(file.name.split(".")[0]);
  
          const fileName = `${Date.now()}-${sanitizedFileName}.${fileExtension}`;
          const filePath = path.join(briefUploadPath, fileName);
  
          fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
  
          const fileType = (() => {
            if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) return "image";
            if (["mp4", "avi", "mov"].includes(fileExtension)) return "video";
            if (["stl", "dwg", "obj"].includes(fileExtension)) return "cad";
            return "file";
          })();
  
          uploadedFiles.push({
            type: fileType,
            url: `/uploads/brief/${folderName}/${fileName}`,
            public_id: fileName,
          });
        }
  
        brief.files = uploadedFiles; // only update files if new ones are provided
      }
  
      await brief.save();
  
      res.status(200).json({
        message: "Brief updated successfully",
        brief,
      });
    } catch (error) {
      console.error("Error updating brief:", error);
      res.status(500).json({ error: "Server error while updating brief" });
    }
  });
  

  // DELETE /brief/:id (Admin Protected)
router.delete("/brief-delete/:id", protectAdmin, async (req, res) => {
  try {
    const brief = await Brief.findById(req.params.id);

    if (!brief) {
      return res.status(404).json({ error: "Brief not found" });
    }

    // Optionally delete uploaded files from the server
    // if (brief.files && brief.files.length > 0) {
    //   for (const file of brief.files) {
    //     const filePath = path.join(__dirname, `../uploads/brief/${file.public_id}`);
    //     if (fs.existsSync(filePath)) {
    //       fs.unlinkSync(filePath);
    //     }
    //   }
    // }

    await brief.deleteOne();
    res.status(200).json({ message: "Brief deleted successfully" });
  } catch (error) {
    console.error("Error deleting brief:", error);
    res.status(500).json({ error: "Server error while deleting brief" });
  }
});


// islive functionality

// PUT /brief/:id/toggle (Admin Protected)
router.put("/toggle-brief-live/:id", protectAdmin, async (req, res) => {
  try {
    const { isLive } = req.body;  // Expecting isLive in the body

    // Find the brief by ID
    const brief = await Brief.findById(req.params.id);

    if (!brief) {
      return res.status(404).json({ error: "Brief not found" });
    }

    // Toggle the 'isLive' field
    brief.isLive = isLive;

    // Save the updated brief
    await brief.save();

    res.status(200).json({
      message: "Brief live status updated successfully",
      brief,
    });
  } catch (error) {
    console.error("Error toggling live status:", error);
    res.status(500).json({ error: "Server error while updating live status" });
  }
});


//brief for slected users

router.put("/briefs/:briefId/visible-users", protectAdmin, async (req, res) => {
  try {
    const { briefId } = req.params;
    const { visibleTo } = req.body;

    if (!Array.isArray(visibleTo)) {
      return res.status(400).json({ message: "visibleTo must be an array of user IDs." });
    }

    const updatedBrief = await Brief.findByIdAndUpdate(
      briefId,
      { visibleTo },
      { new: true }
    ).populate("visibleTo", "name email avatar");

    if (!updatedBrief) {
      return res.status(404).json({ message: "Brief not found." });
    }

    res.status(200).json({
      message: "Visible users updated successfully.",
      updatedBrief,
    });
  } catch (error) {
    console.error("Error updating visible users:", error);
    res.status(500).json({ message: "Server error." });
  }
});


router.get("/briefs-visible/:id", protectAdmin, async (req, res) => {
  try {
    const brief = await Brief.findById(req.params.id).populate("visibleTo", "name email");

    if (!brief) {
      return res.status(404).json({ message: "Brief not found" });
    }

    res.status(200).json({ brief });
  } catch (error) {
    console.error("Error fetching brief:", error);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;

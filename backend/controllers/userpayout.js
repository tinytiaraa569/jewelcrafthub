const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const UserPayout = require("../model/userpayout"); // Corrected import
const User = require("../model/User"); // Corrected import

const router = express.Router();

const payoutUploadPath = path.join(__dirname, "../uploads/user/payouts");
fs.mkdirSync(payoutUploadPath, { recursive: true });

const sanitizeFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

// POST /user-payout/create
// router.post("/user-payout/create", async (req, res) => {
//     console.log("Received payout request:", req.body);

//     try {
//         // Extract and verify token
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ error: "Unauthorized: No token provided" });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded Token:", decoded);

//         const userId = decoded.userId;
//         const { addressdetails, paypaldetails, upidetails, bankdeatils, files } = req.body;

//         // Ensure at least one payment method is provided
//         if (!addressdetails && !paypaldetails && !upidetails && !bankdeatils) {
//             return res.status(400).json({ error: "At least one payout method is required" });
//         }

//         // Find existing payout record for the user
//         let existingPayout = await UserPayout.findOne({ user: userId });

//         if (!existingPayout) {
//             // If no existing record, create a new one
//             existingPayout = new UserPayout({ user: userId });
//         }

//         // Update address details if provided
//         if (addressdetails) existingPayout.address = addressdetails;

//         // Function to append unique values to an array field
//         const appendUniqueValues = (existingArray, newValues) => {
//             if (!Array.isArray(existingArray)) {
//                 existingArray = [];
//             }

//             newValues.forEach((value) => {
//                 if (!existingArray.includes(value)) {
//                     existingArray.push(value);
//                 }
//             });

//             return existingArray;
//         };

//         // Preserve existing UPI details and append new ones
//         // if (upidetails) {
//         //     const newUpiDetails = Array.isArray(upidetails) ? upidetails : [upidetails];
//         //     existingPayout.upiDetails = appendUniqueValues(existingPayout.upiDetails, newUpiDetails);
//         // }

//         // // Preserve existing PayPal details and append new ones
//         // Preserve existing PayPal details and append new unique ones
//             if (paypaldetails) {
//                 const newPaypalDetails = Array.isArray(paypaldetails) ? paypaldetails : [paypaldetails];

//                 // Filter out null/empty emails
//                 const filteredNewPaypalDetails = newPaypalDetails.filter(
//                     detail => detail?.paypalEmail && detail.paypalEmail.trim() !== ""
//                 );

//                 if (!existingPayout.paypalDetails) existingPayout.paypalDetails = [];

//                 // Create a set of existing emails for easy lookup
//                 const existingEmails = new Set(
//                     existingPayout.paypalDetails.map(d => d.paypalEmail?.toLowerCase())
//                 );

//                 filteredNewPaypalDetails.forEach(detail => {
//                     const emailLower = detail.paypalEmail.toLowerCase();
//                     if (!existingEmails.has(emailLower)) {
//                         existingPayout.paypalDetails.push(detail);
//                         existingEmails.add(emailLower);
//                     }
//                 });
//             }


//         // // Preserve existing Bank details and append new ones
//         // if (bankdeatils) {
//         //     const newBankDetails = Array.isArray(bankdeatils) ? bankdeatils : [bankdeatils];
//         //     existingPayout.bankDetails = appendUniqueValues(existingPayout.bankDetails, newBankDetails);
//         // }

//         // Define user-specific upload path
//         const userPayoutPath = path.join(payoutUploadPath, userId.toString());
//         fs.mkdirSync(userPayoutPath, { recursive: true });

//         if (files && files.length > 0) {
//             const uploadedFiles = [];

//             for (let file of files) {
//                 const base64Data = file.content.split(";base64,").pop();
//                 const fileExtension = file.name.split(".").pop().toLowerCase();
//                 const sanitizedFileName = sanitizeFileName(file.name.split(".")[0]);

//                 // Generate unique file name
//                 const fileName = `${Date.now()}-${userId}-${sanitizedFileName}.${fileExtension}`;
//                 const filePath = path.join(userPayoutPath, fileName);

//                 // Write file to server
//                 fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

//                 uploadedFiles.push({
//                     type: file.type,
//                     url: `/uploads/user/payouts/${userId}/${fileName}`,
//                     public_id: fileName,
//                 });
//             }

//             // Merge new files with existing ones
//             existingPayout.files = [...existingPayout.files, ...uploadedFiles];
//         }

//         // Save the updated payout record
//         await existingPayout.save();
//         res.status(201).json({ message: "Payout information updated successfully", payout: existingPayout });
//     } catch (error) {
//         console.error("Error processing payout request:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

router.post("/user-payout/create", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      const { addressdetails, paypaldetails, upidetails, bankdeatils, files } = req.body;
  
      let existingPayout = await UserPayout.findOne({ user: userId });
      if (!existingPayout) {
        existingPayout = new UserPayout({ user: userId });
      }
  
      if (addressdetails) {
        existingPayout.address = addressdetails;
      }
  
      // ✅ Add PayPal details without duplication
      if (Array.isArray(paypaldetails)) {
        const filtered = paypaldetails.filter(
          detail => detail?.paypalEmail && detail.paypalEmail.trim() !== ""
        );
  
        const existingEmails = new Set(
          (existingPayout.paypalDetails || []).map(d => d.paypalEmail?.toLowerCase())
        );
  
        filtered.forEach(detail => {
          const emailLower = detail.paypalEmail.toLowerCase();
          if (!existingEmails.has(emailLower)) {
            existingPayout.paypalDetails.push(detail);
            existingEmails.add(emailLower);
          }
        });
      }
  
      // ✅ UPI
      if (Array.isArray(upidetails)) {
        const newUpi = upidetails.filter(
          d => d.upiId && !existingPayout.upiDetails.some(e => e.upiId === d.upiId)
        );
        existingPayout.upiDetails.push(...newUpi);
      }
  
      // ✅ Bank
      if (Array.isArray(bankdeatils)) {
        const newBank = bankdeatils.filter(
          d => d.accountNumber && !existingPayout.bankDetails.some(e => e.accountNumber === d.accountNumber)
        );
        existingPayout.bankDetails.push(...newBank);
      }
  
      // ✅ File Upload
      const userPayoutPath = path.join(payoutUploadPath, userId.toString());
      fs.mkdirSync(userPayoutPath, { recursive: true });
  
      if (Array.isArray(files) && files.length > 0) {
        const uploadedFiles = [];
  
        for (let file of files) {
          const base64Data = file.content.split(";base64,").pop();
          const ext = file.name.split(".").pop();
          const safeName = sanitizeFileName(file.name.split(".")[0]);
          const filename = `${Date.now()}-${userId}-${safeName}.${ext}`;
          const filePath = path.join(userPayoutPath, filename);
  
          fs.writeFileSync(filePath, base64Data, "base64");
  
          uploadedFiles.push({
            type: file.type,
            url: `/uploads/user/payouts/${userId}/${filename}`,
            public_id: filename,
          });
        }
  
        existingPayout.files.push(...uploadedFiles);
      }
  
      await existingPayout.save();
      res.status(201).json({ message: "Payout saved", payout: existingPayout });
    } catch (err) {
      console.error("Error processing payout request:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
// GET /user-payout/details - Fetch specific user's payout details
router.get("/user-payout/details", async (req, res) => {
    try {
        // Extract and verify the token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find payout details for the specific user
        const payoutDetails = await UserPayout.findOne({ user: userId });

        if (!payoutDetails) {
            return res.status(404).json({ error: "Payout details not found" });
        }

        res.status(200).json({ success: true, payoutDetails });
    } catch (error) {
        console.error("Error fetching payout details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//get user details on withdrwal points
router.get("/user-payout/confirmation-details/:id", async (req, res) => {

try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

});




module.exports = router;

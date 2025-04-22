const express = require("express");
const router = express.Router();

const SupportRequest = require("../model/SupportRequest");
const { protectAdmin } = require("../middleware/protectAdmin");




router.post("/user-support/create", async (req, res) => {

try {
    const { name, email, subject, message, user ,phone } = req.body;

    if (!name || !email || !subject || !message ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRequest = await SupportRequest.create({
      name,
      email,
      subject,
      message,
      user,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error in support request:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// Admin route to get all support requests
router.get("/admin/support-requests", protectAdmin, async (req, res) => {
    try {
      const requests = await SupportRequest.find()
        .sort({ createdAt: -1 }) // 👈 Sort by newest first
        .populate('user', 'name email'); // Optional: Populate user data
  
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      console.error('Error fetching support requests:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
  

  //  Update status and priority of a support request (Admin)
router.patch("/admin/support-requests/:id", protectAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, priority } = req.body;
  
      const request = await SupportRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }
  
      if (status) request.status = status;
      if (priority) request.priority = priority;
  
      await request.save();
  
      res.status(200).json({
        success: true,
        message: "Support request updated successfully",
        data: request,
      });
    } catch (error) {
      console.error("Error updating support request:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });

module.exports = router;

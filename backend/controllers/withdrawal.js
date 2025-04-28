const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Withdrawal = require("../model/withdrawal");  // Assuming you have a Withdrawal model
const { protectAdmin } = require("../middleware/protectAdmin");

const router = express.Router();

// POST /user-withdrawal/create
router.post("/user-withdrawal/create", async (req, res) => {
  try {
    const { userId, method, amount, upi, bank, paypal, details } = req.body;

    // Fetch user details (if needed)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the withdrawal method is valid
    const validMethods = ['upi', 'bank', 'paypal'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ message: 'Invalid withdrawal method.' });
    }

    // Validate withdrawal amount (should be a positive number and not exceed available points)
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero.' });
    }
    if (user.points < amount) {
      return res.status(400).json({ message: 'Insufficient points for withdrawal.' });
    }

    // Validate method-specific data
    if (method === 'upi' && !upi) {
      return res.status(400).json({ message: 'UPI ID is required for UPI withdrawal.' });
    }
    if (method === 'bank' && !bank) {
      return res.status(400).json({ message: 'Bank account details are required for bank withdrawal.' });
    }
    if (method === 'paypal' && !paypal) {
      return res.status(400).json({ message: 'PayPal account details are required for PayPal withdrawal.' });
    }

    // Create the withdrawal record
    const newWithdrawal = new Withdrawal({
      user: userId,
      method,
      amount,
      upi,
      bank,
      paypal,
      details,
    });

    // Save withdrawal request
    await newWithdrawal.save();

    // Update user points after withdrawal
    user.points -= amount;
    user.withdrawnPoints += amount; 
    await user.save();

    return res.status(201).json({ message: 'Withdrawal request created successfully', withdrawal: newWithdrawal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


//get all withdrwaal of a user 

// Get withdrawal requests for a specific user
router.get("/user/:userId/get-withdrawals", async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch withdrawal requests for the specific user
      const withdrawals = await Withdrawal.find({ user: userId })
        .populate("user", "name email")  // Populate user details
        .sort({ createdAt: -1 });  // Sort by most recent first
  
      // If no withdrawals found
      if (!withdrawals.length) {
        return res.status(404).json({ message: 'No withdrawal requests found for this user.' });
      }
  
      return res.status(200).json({ withdrawals });
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  

// Get all withdrawal requests (for admin)
router.get("/admin/get-all-withdrawals", protectAdmin ,async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
  
      return res.status(200).json({ withdrawals });
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
});


// reject
router.post("/admin/withdrawal-reject", protectAdmin, async (req, res) => {
    try {
      const { withdrawalId } = req.body;
  
      // Fetch the withdrawal record
      const withdrawal = await Withdrawal.findById(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ message: 'Withdrawal request not found.' });
      }
  
      // Check if the withdrawal is already processed or rejected
      if (withdrawal.status === 'rejected' || withdrawal.status === 'processed') {
        return res.status(400).json({ message: 'This withdrawal request has already been processed or rejected.' });
      }
  
      // Update the withdrawal status to 'rejected'
      withdrawal.status = 'rejected';
      await withdrawal.save();
  
      // Optionally, you can also update the user's account if needed (e.g., refund points)
      const user = await User.findById(withdrawal.user);
      if (user) {
        // Optionally refund points if needed, depending on your business logic
        user.points += withdrawal.amount;
        user.withdrawnPoints -= withdrawal.amount
        await user.save();
      }
  
      return res.status(200).json({ message: 'Withdrawal request rejected successfully.' });
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});
  
//approval request of a withdrwal
router.post("/admin/withdrawal-approve", protectAdmin, async (req, res) => {
    try {
      const { withdrawalId, conversionRate } = req.body;
  
      // Fetch the withdrawal record
      const withdrawal = await Withdrawal.findById(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal request not found." });
      }
  
      // Check if the withdrawal is already processed or rejected
      if (withdrawal.status === "approved" || withdrawal.status === "rejected") {
        return res.status(400).json({ message: "This withdrawal request has already been processed." });
      }
  
      // Convert points to money
      const money = withdrawal.amount * conversionRate;
  
      // Update the withdrawal status to 'Approved'
      withdrawal.status = "approved";
      withdrawal.conversionRate = conversionRate;
      await withdrawal.save();
  
      // Update the user's withdrawal details
      const user = await User.findById(withdrawal.user);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Deduct points from user and update withdrawn points and earnings

      user.totalEarnings += money;  // Add the converted money to the user's totalEarnings
      await user.save();
  
      return res.status(200).json({ message: "Withdrawal request approved successfully." });
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

router.patch("/withdrawals/:id/update-payment", protectAdmin, async (req, res) => {

  try {
    const { id } = req.params; // withdrawal id
    const { amountPaid, paymentDoneBy, referenceNumber } = req.body;

    if (!amountPaid || !paymentDoneBy || !referenceNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Only allow update if status is approved
    if (withdrawal.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved withdrawals can have payment info updated' });
    }

    withdrawal.amountPaid = amountPaid;
    withdrawal.paymentDoneBy = paymentDoneBy;
    withdrawal.referenceNumber = referenceNumber;
    withdrawal.updatedAt = Date.now();

    await withdrawal.save();

    res.status(200).json({ message: 'Payment details updated successfully', withdrawal });
  } catch (error) {
    console.error('Error updating payment info:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;

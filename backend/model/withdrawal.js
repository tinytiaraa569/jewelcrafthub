const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model for referencing
    required: true,
  },
  method: {
    type: String,
    enum: ['upi', 'bank', 'paypal'],  // The withdrawal method (can be extended)
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  upi: {
    type: Object,  // UPI details like ID
    default: null,
  },
  bank: {
    type: Object,  // Bank details like account number, holder, IFSC
    default: null,
  },
  paypal: {
    type: Object,  // PayPal details like email
    default: null,
  },
  details: {
    type: Object,  // Full payoutDetails object (optional)
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],  // Withdrawal status
    default: 'pending',
  },
  conversionRate: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);



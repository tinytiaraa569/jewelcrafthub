const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zip: String,
});

const fileSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const upiSchema = new mongoose.Schema({
  upiId: String,
}, { _id: false });

const bankSchema = new mongoose.Schema({
  accountHolder: String,
  accountNumber: String,
  ifsc: String,
}, { _id: false });

const paypalSchema = new mongoose.Schema({
  paypalEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  swiftCode: String,
}, { _id: false }); // ✅ No unique index

const userPayoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: addressSchema,
  files: { type: [fileSchema], default: [] },
  upiDetails: { type: [upiSchema], default: [] },
  bankDetails: { type: [bankSchema], default: [] },
  paypalDetails: { type: [paypalSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("UserPayout", userPayoutSchema);

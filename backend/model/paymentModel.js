const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentSchema", PaymentSchema);

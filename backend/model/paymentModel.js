const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentModel" }],
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
      amount: { type: Number, required: true },
    status: { type: String },
  },
  { timestamps: true }
);


module.exports = mongoose.model("PaymentSchema", PaymentSchema);

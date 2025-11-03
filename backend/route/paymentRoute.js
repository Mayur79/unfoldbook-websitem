const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const documentModel = require("../model/documentModel");
const paymentModel = require("../model/paymentModel");
const middleware = require("../middleware/middleware");
const dotenv = require("dotenv");
const userModel = require("../model/userModel");

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/order", middleware, async (req, res) => {
  const { documentId } = req.body;
  console.log("Req ", req.body);
  const doc = await documentModel.findById(documentId);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  const order = await razorpay.orders.create({
    amount: doc.price * 100,
    currency: "INR",
    receipt: `order_${Date.now()}`,
  });

  console.log("Order,", order);
  res.json({ order, key: process.env.RAZORPAY_KEY_ID, document: doc });
});

// POST /api/pay/verify
router.post("/verify", middleware, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    documentId,
  } = req.body;

  console.log("Req body", req.body);
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature)
    return res.status(400).json({ message: "Invalid signature" });

  await paymentModel.create({
    userId: req.user.id,
    documentId,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  res.json({ message: "Payment verified" });
});

router.get("/purchased", middleware, async (req, res) => {
  try {
    const payments = await paymentModel
      .find({ userId: req.user.id })
      .select("documentId");
     
    const purchasedIds = payments.map((p) => p.documentId.toString());
    res.json(purchasedIds);
  } catch (error) {
    console.error("Error fetching purchased docs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-document", middleware, async (req, res) => {
try {
    // Find all payments for the user and populate the document details
    const payments = await paymentModel
      .find({ userId: req.user.id })
      .populate({
        path: "documentId",
        model: "DocumentModel",
        select: "-__v", // exclude __v field
      });

    // Map payments to documents
    const purchasedDocs = payments.map((p) => {
      const doc = p.documentId.toObject();

      // Convert thumbnail buffer to base64 if exists
      if (doc.thumbnailImage?.data) {
        doc.thumbnailBase64 = `data:${doc.thumbnailImage.contentType};base64,${doc.thumbnailImage.data.toString('base64')}`;
      }

      return doc;
    });

    
    res.json(purchasedDocs);
  } catch (error) {
    console.error("Error fetching purchased docs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-order", async (req, res) => {
  try {
    const { userId, amount, documentIds } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new paymentModel({
      userId,
      documentIds,
      razorpayOrderId: order.id,
      amount,
      status: "pending",
    });

    await payment.save();

    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Verify payment and update user
// routes/payment.js
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const payment = await paymentModel.findOne({ razorpayOrderId });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // Verify signature
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ error: "Invalid signature" });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "success";
    await payment.save();

    // Add purchased docs to user
    const user = await userModel.findByIdAndUpdate(
      payment.userId,
      { 
        $addToSet: { purchasedDocs: { $each: payment.documentIds } },
        $pull: { cart: { $in: payment.documentIds } }, // REMOVE purchased docs from cart
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const documentModel = require("../model/documentModel");
const paymentModel = require("../model/paymentModel");
const middleware = require("../middleware/middleware");
const dotenv = require("dotenv");
const userModel = require("../model/userModel");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
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
    const userId = req.user.id;

    // Fetch the user along with purchasedDocs (DocumentModel)
    const user = await userModel.findById(userId).populate("purchasedDocs");

    if (!user || !user.purchasedDocs?.length) {
      return res.status(200).json([]);
    }

    // Generate presigned URLs for thumbnails
    const docsWithThumbnails = await Promise.all(
      user.purchasedDocs.map(async (doc) => {
        const docObj = doc.toObject();

        if (doc.thumbnailKey) {
          const thumbnailUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.S3_BUCKET,
            Key: doc.thumbnailKey,
            Expires: 60 * 60, // 1 hour
          });
          docObj.thumbnailBase64 = thumbnailUrl; // store URL for frontend
        } else {
          docObj.thumbnailBase64 = null;
        }

        return docObj;
      })
    );

    console.log("Fetched purchased docs:", docsWithThumbnails);
    res.json(docsWithThumbnails);
  } catch (err) {
    console.error("❌ Error fetching purchased documents:", err);
    res.status(500).json({ message: "Failed to fetch purchased documents" });
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

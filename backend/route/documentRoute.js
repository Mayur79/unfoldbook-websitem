const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const documentModel = require("../model/documentModel");
const middleware = require("../middleware/middleware");
const paymentModel = require("../model/paymentModel");
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.get("/", async (req, res) => {
  const docs = await documentModel.find();
  res.json(docs);
});

router.get("/:id/access", middleware, async (req, res) => {
  const doc = await documentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  const purchased = await paymentModel.findOne({
    userId: req.user.id,
    documentId: doc._id,
  });
  if (!purchased) return res.status(403).json({ message: "Not purchased" });

  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET,
    Key: doc.fileKey,
    Expires: 60 * 5, // 5 min
  });
  console.log("Url", url);
  res.json({ url });
});

router.get("/:id/view", middleware, async (req, res) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Check if user purchased this document
    const purchased = await paymentModel.findOne({
      userId: req.user.id,
      documentId: doc._id,
    });
    if (!purchased)
      return res
        .status(403)
        .json({ message: "You haven't purchased this document" });

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: doc.fileKey,
    };

    // Get metadata (optional: helps set proper content type)
    const headData = await s3.headObject(params).promise();
    const contentType = headData.ContentType || "application/octet-stream";

    // ✅ Inline preview instead of download
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(doc.title)}"`
    );

    // Stream file directly from S3 to browser
    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error streaming file:", err);
    res.status(500).json({ message: "Error fetching document" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const documentModel = require("../model/documentModel");
const middleware = require("../middleware/middleware");
const paymentModel = require("../model/paymentModel");
const multer = require("multer");
const categoryModel = require("../model/categoryModel");
const upload = multer({ storage: multer.memoryStorage() });
const jwt=require("jsonwebtoken");
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.post("/presign", middleware, async (req, res) => {
  try {
    const { filename, filetype } = req.body;

    if (!filename || !filetype) {
      return res.status(400).json({ message: "Missing filename or filetype" });
    }

    const fileKey = `${Date.now()}_${filename}`;

    const uploadUrl = s3.getSignedUrl("putObject", {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ContentType: filetype,
      Expires: 300, 
    });

    return res.json({ uploadUrl, fileKey });
  } catch (error) {
    console.error("❌ Error generating presigned URL:", error);
    return res.status(500).json({ message: "Failed to generate presigned URL" });
  }
});


router.post("/saveMetadata", middleware, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, price, type, category, fileKey, description } = req.body;
    const thumbnail = req.file;

    if (!fileKey) {
      return res.status(400).json({ message: "Missing file key from upload" });
    }

    const newDoc = new documentModel({
      title,
      price,
      type,
      description,
      category,
      fileKey,
      backupStatus: "pending",
      thumbnailImage: thumbnail
        ? {
            data: thumbnail.buffer,
            contentType: thumbnail.mimetype,
          }
        : undefined,
    });

    await newDoc.save();

   
    const backupKey = fileKey;

    s3.copyObject({
      Bucket: process.env.S3_BACKUP_BUCKET,
      CopySource: `${process.env.S3_BUCKET}/${fileKey}`,
      Key: backupKey,
    })
      .promise()
      .then(async () => {
        console.log(`✅ Backup successful for ${backupKey}`);
        await documentModel.findByIdAndUpdate(newDoc._id, {
          backupStatus: "completed",
        });
      })
      .catch(async (err) => {
        console.error(`⚠️ Backup failed for ${backupKey}:`, err);
        await documentModel.findByIdAndUpdate(newDoc._id, {
          backupStatus: "failed",
        });
      });
      
    return res.status(200).json({
      message: "Document metadata saved. Backup in progress.",
      document: newDoc,
    });
  } catch (error) {
    console.error("❌ Error saving metadata:", error);
    return res.status(500).json({ message: "Failed to save metadata" });
  }
});

router.get("/", async (req, res) => {
  try {
    const docs = await documentModel.find();

   
    const docsWithThumbnails = docs.map((doc) => {
      const docObj = doc.toObject();
      if (doc.thumbnailImage && doc.thumbnailImage.data) {
        docObj.thumbnailBase64 = `data:${doc.thumbnailImage.contentType};base64,${doc.thumbnailImage.data.toString('base64')}`;
      } else {
        docObj.thumbnailBase64 = null;
      }
      return docObj;
    });

    res.json(docsWithThumbnails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
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

// server route
router.get("/:id/presign", middleware, async (req, res) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const purchased = await paymentModel.findOne({
      userId: req.user.id,
      documentId: doc._id,
    });
    if (!purchased)
      return res.status(403).json({ message: "You haven't purchased this document" });

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: doc.fileKey,
      Expires: 60 * 5, // 5 minutes
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(doc.title)}"`,
    };

    const url = s3.getSignedUrl("getObject", params);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating presigned URL" });
  }
});






router.get("/:id/print", middleware, async (req, res) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

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

    const headData = await s3.headObject(params).promise();
    const contentType = headData.ContentType || "application/pdf";

    // ✅ Set inline for browser preview/print
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(doc.title)}"`
    );

    // Stream PDF from S3 → response
    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error in print route:", err);
    res.status(500).json({ message: "Error preparing print document" });
  }
});

router.post("/createCategory", async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ message: "Category name is required" });

    const newCategory = await categoryModel.create({ categoryName });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
});

// ✅ Get all categories
router.get("/getCategory", async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.get("/:id/share", middleware, async (req, res) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Ensure user purchased it
    const purchased = await paymentModel.findOne({
      userId: req.user.id,
      documentId: doc._id,
    });
    if (!purchased)
      return res.status(403).json({ message: "You haven't purchased this document" });

    // Create short-lived JWT (e.g. expires in 15 minutes)
    const token = jwt.sign(
      { docId: doc._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const shareUrl = `${process.env.FRONTEND_URL}/share/${token}`;
    res.json({ shareUrl });
  } catch (err) {
    console.error("Error generating share link:", err);
    res.status(500).json({ message: "Error generating share link" });
  }
});
router.get("/share/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doc = await documentModel.findById(decoded.docId);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: doc.fileKey,
      Expires: 60 * 5, // 5 minutes
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(doc.title)}"`,
    };

    const url = s3.getSignedUrl("getObject", params);
    res.json({ url, title: doc.title });
  } catch (err) {
    console.error("Error verifying share token:", err);
    return res.status(403).json({ message: "Invalid or expired share link" });
  }
});
module.exports = router;

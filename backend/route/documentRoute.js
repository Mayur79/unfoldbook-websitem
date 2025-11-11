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
const adminMiddleware = require("../middleware/adminMiddleware");
const userModel = require("../model/userModel");
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const MAIN_BUCKET = process.env.S3_BUCKET;
const BACKUP_BUCKET = process.env.S3_BACKUP_BUCKET;
const deleteFromS3 = async (key, bucket) => {
  if (!key || !bucket) return;
  try {
    await s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    console.log(`Deleted ${key} from ${bucket}`);
  } catch (err) {
    console.error(`Failed to delete ${key} from ${bucket}:`, err.message);
  }
};

router.post("/presign", async (req, res) => {
  try {
    const { filename, filetype, uploadType } = req.body;

    // Default folder is "documents" if not specified
    let folder = "documents";
    if (uploadType === "thumbnail") folder = "thumbnails";
    else if (uploadType === "image") folder = "images";
    else if (uploadType === "preview") folder = "previews";

    // Create unique key
    const fileKey = `${folder}/${Date.now()}_${filename}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      Expires: 60, // 1 minute
      ContentType: filetype,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    const fileURL = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

     res.json({ uploadURL, fileURL, fileKey });
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

// route: POST /saveMetadata
router.post("/saveMetadata", middleware, async (req, res) => {
  try {
    const {
      title,
      originalPrice,
      discountPercent,
      finalPrice,
      description,
      category,
      fileKey,
      thumbnailKey,
      extraImageKeys = [],
    } = req.body;

    if (!fileKey || !thumbnailKey) {
      return res.status(400).json({ message: "Missing fileKey or thumbnailKey" });
    }

    // Create document record
    const newDoc = new documentModel({
      title,
      description,
      price: originalPrice,
      discountPercent,
      finalPrice,
      category,
      fileKey,          // main PDF
      thumbnailKey,     // main thumbnail
      extraImageKeys,   // additional images
      backupStatus: "pending",
    });

    await newDoc.save();

    // 🔹 Start backup ONLY for the main PDF
    s3.copyObject({
      Bucket: process.env.S3_BACKUP_BUCKET,
      CopySource: `${process.env.S3_BUCKET}/${fileKey}`,
      Key: fileKey, // same key path in backup bucket
    })
      .promise()
      .then(async () => {
        console.log(`✅ Backup successful for ${fileKey}`);
        await documentModel.findByIdAndUpdate(newDoc._id, {
          backupStatus: "completed",
        });
      })
      .catch(async (err) => {
        console.error(`⚠️ Backup failed for ${fileKey}:`, err);
        await documentModel.findByIdAndUpdate(newDoc._id, {
          backupStatus: "failed",
        });
      });

    // Respond immediately (don’t wait for backup to finish)
    return res.status(200).json({
      message: "Document metadata saved. PDF backup in progress.",
      document: newDoc,
    });
  } catch (err) {
    console.error("❌ Error saving metadata:", err);
    return res.status(500).json({ message: "Failed to save metadata" });
  }
});



router.get("/", async (req, res) => {
  try {
    const docs = await documentModel.find().populate("category", "categoryName");

    // Convert to JSON with S3 image URLs
    const docsWithThumbnails = await Promise.all(
      docs.map(async (doc) => {
        const docObj = doc.toObject();

        // Generate a presigned URL for the thumbnail from S3
        if (doc.thumbnailKey) {
          const thumbnailUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.S3_BUCKET,
            Key: doc.thumbnailKey,
            Expires: 60 * 60, // 1 hour (you can adjust)
          });
          docObj.thumbnailBase64 = thumbnailUrl;
        } else {
          docObj.thumbnailBase64 = null;
        }

        return docObj;
      })
    );

    res.json(docsWithThumbnails);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch single document and populate category
    const doc = await documentModel.findById(id).populate("category", "categoryName");
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const docObj = doc.toObject();

    // 🖼️ Generate signed URL for thumbnail if exists
    if (doc.thumbnailKey) {
      docObj.thumbnailURL = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET,
        Key: doc.thumbnailKey,
        Expires: 3600, // 1 hour
      });
    } else {
      docObj.thumbnailURL = null;
    }

    // 🖼️ Generate signed URLs for extra images (if any)
    if (doc.extraImageKeys && doc.extraImageKeys.length > 0) {
      docObj.extraImageURLs = doc.extraImageKeys.map((key) =>
        s3.getSignedUrl("getObject", {
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Expires: 3600, // 1 hour
        })
      );
    } else {
      docObj.extraImageURLs = [];
    }

    // 📄 (Optional) You can also include a signed PDF URL if you need it in detail view
    if (doc.fileKey) {
      docObj.fileURL = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET,
        Key: doc.fileKey,
        Expires: 3600,
      });
    }

    res.json(docObj);
  } catch (err) {
    console.error("❌ Error fetching document:", err);
    res.status(500).json({ message: "Failed to fetch document" });
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
    // if (!doc) return res.status(404).json({ message: "Document not found" });

    // const purchased = await paymentModel.findOne({
    //   userId: req.user.id,
    //   documentId: doc._id,
    // });
    // if (!purchased)
    //   return res.status(403).json({ message: "You haven't purchased this document" });

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

router.post("/createCategory",middleware,adminMiddleware, async (req, res) => {
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

router.delete("/deleteCategory/:id",middleware,adminMiddleware ,async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Category deletion error:", error);
    console.log("Category deletion error:", error);
    res.status(500).json({ message: "Failed to delete category" });
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

    // // Ensure user purchased it
    // const purchased = await paymentModel.findOne({
    //   userId: req.user.id,
    //   documentId: doc._id,
    // });
    // if (!purchased)
    //   return res.status(403).json({ message: "You haven't purchased this document" });

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

router.get("/categories/list", async (req, res) => {
   try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    console.log("error",error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
 }
);
router.get("/documents/:categoryId", async (req, res) => {
  try {
    const docs = await documentModel.find({ category: req.params.categoryId });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// router.delete("/document/:id", async (req, res) => {
//   try {
//     const doc = await documentModel.findById(req.params.id);
//     if (!doc) return res.status(404).json({ error: "Document not found" });

//     // Delete from S3 buckets
//     if (doc.fileKey) {
//       await deleteFromS3(MAIN_BUCKET, doc.fileKey);
//       await deleteFromS3(BACKUP_BUCKET, doc.fileKey);
//     }

//     // Delete from MongoDB
//     await doc.deleteOne();

//     res.json({ success: true, message: "Document deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete document" });
//   }
// });

// // === DELETE a category and all related documents ===
// router.delete("/category/:id", async (req, res) => {
//   try {
//     const category = await categoryModel.findById(req.params.id);
//     if (!category) return res.status(404).json({ error: "Category not found" });

//     // Find all documents linked to this category
//     const docs = await documentModel.find({ category: req.params.id });

//     // Delete each document from MongoDB and S3
//     for (const doc of docs) {
//       if (doc.fileKey) {
//         await deleteFromS3(MAIN_BUCKET, doc.fileKey);
//         await deleteFromS3(BACKUP_BUCKET, doc.fileKey);
//       }
//       await doc.deleteOne();
//     }

//     // Delete the category
//     await category.deleteOne();

//     res.json({
//       success: true,
//       message: `Category "${category.categoryName}" and its files deleted.`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete category" });
//   }
// });
router.delete("/delete/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    if (type === "folder") {
      // Delete all files in this category
      const docs = await documentModel.find({ category: id });

      for (const doc of docs) {
        // Remove doc references from all users
        await userModel
        .updateMany(
          {},
          {
            $pull: {
              cart: doc._id,
              wishlist: doc._id,
              purchasedDocs: doc._id,
            },
          }
        );

        // Delete file from both main and backup S3 buckets
        await deleteFromS3(doc.fileKey, MAIN_BUCKET);
        await deleteFromS3(doc.fileKey, BACKUP_BUCKET);

        await doc.deleteOne();
      }

      await categoryModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Folder and its files deleted" });
    }

    // Deleting single file
    else if (type === "file") {
      const doc = await documentModel.findById(id);
      if (!doc) return res.status(404).json({ message: "File not found" });

      // Remove from all users' cart, wishlist, purchasedDocs
      await userModel.updateMany(
        {},
        {
          $pull: {
            cart: doc._id,
            wishlist: doc._id,
            purchasedDocs: doc._id,
          },
        }
      );

      // Delete from S3
      await deleteFromS3(doc.fileKey, MAIN_BUCKET);
      await deleteFromS3(doc.fileKey, BACKUP_BUCKET);

      await doc.deleteOne();

      return res.status(200).json({ message: "File deleted" });
    } else {
      return res.status(400).json({ message: "Invalid delete type" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
});

router.get("/my-document/list", middleware, async (req, res) => {
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

   
    res.json(docsWithThumbnails);
  } catch (err) {
    console.error("❌ Error fetching purchased documents:", err);
    res.status(500).json({ message: "Failed to fetch purchased documents" });
  }
});


module.exports = router;

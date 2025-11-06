const express = require("express");
const router = express.Router();


const AWS = require("aws-sdk");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage })
const bannerModel = require("../model/bannerModel"); 
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1',
  signatureVersion: 'v4', // <--- add this
});
router.post('/upload-banner', upload.array('images', 5), async (req, res) => {
   const { bannerType } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

  try {
    const uploadPromises = req.files.map(async (file) => {
      const key = `banner/${bannerType}/${Date.now()}_${file.originalname}`;

      // Upload to S3 (no ACL)
      await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      // Generate signed URL (valid for 1 hour)
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Expires: 3600, // 1 hour
      });

      // Save to MongoDB
      const imageDoc = await bannerModel.create({
        bannerType,
        url: signedUrl,
        key,
      });

      return imageDoc;
    });

    const savedImages = await Promise.all(uploadPromises);
    res.json({ message: 'Files uploaded successfully', images: savedImages });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error });
  }
});

// Get all images (optionally by bannerType)
// Get images
router.get('/getimages', async (req, res) => {
  try {
    const { bannerType } = req.query;
    const filter = bannerType ? { bannerType } : {};
    const images = await bannerModel.find(filter).sort({ createdAt: -1 });

    // Generate fresh signed URLs for all images
   const imagesWithUrls = await Promise.all(
  images.map(async (img) => {
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET,
      Key: img.key,
      Expires: 3600,
    });
    return { _id: img._id, bannerType: img.bannerType, url: signedUrl };
  })
);

    res.json(imagesWithUrls);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images', error });
  }
});


// Delete image
router.delete('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const image = await bannerModel.findById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Delete from S3
    await s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: image.key }).promise();

    // Delete from MongoDB
    await bannerModel.findByIdAndDelete(id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete failed', error });
  }
});



module.exports = router;

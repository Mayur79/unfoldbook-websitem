// models/BannerImage.js

const mongoose = require('mongoose');
const BannerImageSchema = new mongoose.Schema({
  bannerType: { type: String, enum: ['banner1', 'banner2'], required: true },
  url: { type: String, required: true },
  key: { type: String, required: true }, // S3 object key
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BannerImage', BannerImageSchema);

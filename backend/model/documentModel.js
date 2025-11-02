const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: String,
  description:String,
  fileKey: String,
  price: Number,
  finalPrice  : Number,
  discountPercent: Number,
  type: String,
  thumbnailImage: {
    data: Buffer,        // Binary data
    contentType: String, // e.g. image/png
  },
    backupStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  category:{type: mongoose.Schema.Types.ObjectId, ref: "Category" }
},{
  timestamps: true
}
);

module.exports = mongoose.model("DocumentModel", DocumentSchema);

const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: String,
  description:String,
  fileKey: String,
  price: Number,
  finalPrice  : Number,
  discountPercent: Number,
  type: String,
  extraImageKeys: [String],
  thumbnailKey: String,
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

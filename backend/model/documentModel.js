const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: String,
  fileKey: String,
  price: Number,
  type: String,
});

module.exports = mongoose.model("DocumentModel", DocumentSchema);

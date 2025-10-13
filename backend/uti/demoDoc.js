const documentModel = require("../model/documentModel");

require("dotenv").config();

async function seedDoc() {
  await documentModel.deleteMany();
  await documentModel.insertMany([
    { title: "Sample PDF", fileKey: "ResumeMayur.pdf", price: 50, type: "pdf" },
  ]);
  console.log("Seeded docs");
  process.exit(0);
}
module.exports = seedDoc;

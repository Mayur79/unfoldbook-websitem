require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");

async function seed() {
  const email = "test@gmail.com";
  const existing = await userModel.findOne({ email });
  if (existing) {
    console.log("User already exists:", email);
    return process.exit(0);
  }

  const hashed = await bcrypt.hash("test@gmail.com", 10);

  const user = new userModel({
    name: "test@gmail.com",
    email,
    password: hashed,
  });

  await user.save();
  console.log("Seed user created:", { email, password: "test@gmail.com" });
  process.exit(0);
}
module.exports = seed;

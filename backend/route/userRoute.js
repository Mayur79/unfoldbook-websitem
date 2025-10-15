const express = require("express");
const router = express.Router();
const User = require("../model/userModel");


// GET all users (excluding password)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

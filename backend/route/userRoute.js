const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const paymentModel = require("../model/paymentModel");


// GET all users (excluding password)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/update-role/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate input
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true } // returns updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating role",
      error: error.message,
    });
  }
});

router.get("/user-doc-data", async (req, res) => {
  try {
   
    const purchaseCounts = await paymentModel.aggregate([
      { $group: { _id: "$userId", documents: { $sum: 1 } } },
    ]);

  
    const countMap = {};
    purchaseCounts.forEach((p) => {
      countMap[p._id.toString()] = p.documents;
    });

   
    const users = await User.find().select("name email createdAt");

    // Merge user data + doc counts
    const result = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      documents: countMap[u._id.toString()] || 0,
      createdAt:u.createdAt
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

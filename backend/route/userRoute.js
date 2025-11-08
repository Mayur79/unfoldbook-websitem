const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const paymentModel = require("../model/paymentModel");
const middleware = require("../middleware/middleware");

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


router.post("/wishlist/toggle",middleware, async (req, res) => {
  try {
    const { documentId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(documentId);
    if (index === -1) {
      user.wishlist.push(documentId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.json({
      wishlist: user.wishlist,
      wishlistCount: user.wishlist.length,
      message: index === -1 ? "Added to wishlist" : "Removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/cart/toggle", middleware, async (req, res) => {
  try {
    const { documentId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.cart.indexOf(documentId);
    if (index === -1) {
      user.cart.push(documentId);
    } else {
      user.cart.splice(index, 1);
    }

    await user.save();
    res.json({
      cart: user.cart,
      cartCount: user.cart.length,
      message: index === -1 ? "Added to cart" : "Removed from cart",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/getUserCart", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/getUserWishlist", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

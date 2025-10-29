const userModel = require("../model/userModel");


const adminMiddleware = async (req, res, next) => {
  try {
    // If user info is not available from auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No user info found." });
    }

    // Fetch the user from DB using the ID from JWT
    const user = await userModel.findById(req.user.id).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is actually an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Add the full user object to req.user for later use
    req.user = user;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;

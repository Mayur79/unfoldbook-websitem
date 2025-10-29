const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const middleware = require("../middleware/middleware");
const {OAuth2Client}=require('google-auth-library');
const adminMiddleware = require("../middleware/adminMiddleware");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    // check if user exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new userModel({
      name: name || "Demo User",
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();

    // generate JWT
    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.log("Err",err);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/googleLogin", async (req, res) => {
 try {
    const { token } = req.body; // from frontend
    if (!token) return res.status(400).json({ message: "No token provided" });

  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await userModel.findOne({ email });

    // Create new user if not exists
    if (!user) {
      user = new userModel({
        name,
        email,
        password: await bcrypt.hash(googleId, 10), // dummy password
        // profileImage: picture,
        googleId,
      });
      await user.save();
    }

    // Generate JWT
    const jwtPayload = { id: user._id, email: user.email };
    const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({
      token: authToken,
      // user: { id: user._id, name: user.name, email: user.email, picture },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});


router.get("/me", middleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/verify", middleware, adminMiddleware, (req, res) => {
  res.json({ success: true });
});


module.exports = router;

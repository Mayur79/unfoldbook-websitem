// database/db.js
const mongoose = require("mongoose");

let isConnecting = false;
let hasConnectedOnce = false;

const connectDB = async (retryCount = 5, delay = 5000) => {
  const url = process.env.MONGO_URL;

  // ✅ Avoid reconnecting if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("🟢 MongoDB already connected, skipping reconnect.");
    return;
  }

  // ✅ Prevent parallel attempts
  if (isConnecting) {
    console.log("⏳ MongoDB connection attempt already in progress...");
    return;
  }

  isConnecting = true;

  for (let i = 1; i <= retryCount; i++) {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: { w: "majority", wtimeout: 1000, j: true },
      });

      console.log(`✅ MongoDB connected at ${mongoose.connection.host}`);
      hasConnectedOnce = true;
      isConnecting = false;
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${i}/${retryCount}): ${error.message}`);
      if (i < retryCount) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("🚨 MongoDB connection failed after all retries.");
        isConnecting = false;
        throw error;
      }
    }
  }
};

// 🧠 Handle disconnections gracefully — retry only once
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected.");
  if (!isConnecting && hasConnectedOnce) {
    console.log("🔁 Retrying MongoDB connection in 5s...");
    setTimeout(() => connectDB().catch(err => console.error("❌ Reconnect failed:", err.message)), 5000);
  }
});

// Log useful connection state info
mongoose.connection.on("connected", () => console.log("✅ MongoDB connection established."));
mongoose.connection.on("error", err => console.error("❌ MongoDB error:", err.message));

module.exports = connectDB;

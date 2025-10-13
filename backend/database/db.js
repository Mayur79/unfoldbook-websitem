const mongoose = require("mongoose");

const connectDB = async (retryCount = 5, delay = 5000) => {
  const url = process.env.MONGO_URL;

  for (let i = 1; i <= retryCount; i++) {
    try {
      const conn = await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: {
          w: "majority",
          wtimeout: 1000,
          j: true,
        },
      });
      console.log(`✅ MongoDB connected at ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${i}/${retryCount})`);
      if (i < retryCount) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("🚨 MongoDB connection failed after all retries.");
        throw error; // throw instead of exiting
      }
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.error("⚠️ MongoDB disconnected. Attempting reconnection...");
  connectDB();
});

module.exports = connectDB;

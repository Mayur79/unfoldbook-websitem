const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db.js");
const cors = require("cors");
const app = express();
const authRoute = require("./route/authRoute.js");
const morgan = require("morgan");
// const productRoute = require("../routes/productRoute.js");
const bodyParser = require("body-parser");
const paymentRote = require("./route/paymentRoute.js");
const documentRoute = require("./route/documentRoute.js");
const seed = require("./uti/demoUser.js");
const seedDoc = require("./uti/demoDoc.js");
dotenv.config();
let isDBConnected = false;
app.use(
  cors({
    origin: process.env.frontend_url, // Replace with your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    headers: ["Content-Type", "Authorization"],
  })
);
app.use(cors());
// Middleware to handle large payloads
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/doc", documentRoute);
app.use("/api/v1/pay", paymentRote);

app.get("/api/health", (req, res) => {
  res.status(isDBConnected ? 200 : 500).json({
    status: isDBConnected ? "ok" : "error",
    db: isDBConnected ? "connected" : "disconnected",
  });
});

const connectAndTrackDB = async () => {
  try {
    await connectDB();
    isDBConnected = true;
  } catch (err) {
    isDBConnected = false;
  }
};

connectAndTrackDB();

const port = process.env.PORT || 4000;
// seed();
// seedDoc();
app.get("/", (req, res) => {
  res.send("Welcome to my Furno backend");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const wishListRoute = require("./routes/wishRoute");
const proxyRoute = require("./routes/proxyRoute");

const app = express();
const newsLetterRoutes = require("./routes/newsLetterRoute");

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://glitchd-dqc2a3g8bkdsczex.southeastasia-01.azurewebsites.net' 
  : 'http://localhost:5000';

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  BASE_URL,
  "https://glitchd.in",
  "http://127.0.0.1:3000"
];

// ROUTES
app.use("/proxy", proxyRoute); // ✅ FIXED: Remove the function call
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/wishlist", wishListRoute);
app.use("/newsletter", newsLetterRoutes);

// Serve Frontend (If Deployed)
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ERROR MIDDLEWARE
app.use(errorHandler);

// API Route to send email

app.get("/", (req, res) => {
  res.send("Home Page...");
});

const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

connectDB();

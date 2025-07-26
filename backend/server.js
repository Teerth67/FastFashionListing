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
const newsLetterRoutes=require("./routes/newsLetterRoute")

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


const allowedOrigins = [
  "https://3.111.9.37:80", // Your domain with port
 "https://3.111.9.37", // Server IP
 "https://glitchd.in",
"http://localhost:3000",

"http://127.0.0.1:3000"
];
  




// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true, // ✅ Allow cookies, tokens, etc.
//     methods: ["GET", "POST","PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     preflightContinue: false, // ✅ Allow preflight requests through
//   })
// );

// ROUTES
// app.use("/proxy", proxyRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/wishlist", wishListRoute);
app.use("/newsletter",newsLetterRoutes)



// API Route to send email


app.get("/", (req, res) => {
  res.send("Home Page...");
});

// ERROR MIDDLEWARE
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

connectDB();

// // Serve Frontend (If Deployed)
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

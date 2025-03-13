const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const router = express.Router();
const BACKEND_API = "http://glitchd.in/api"; 
const SECRET_KEY = process.env.JWT_SECRET; 
const VALID_API_KEY = process.env.SECRET_API_KEY; // API Key stored in env

// Allowed frontend domains
const ALLOWED_ORIGINS = [ "http://3.111.9.37",
  "http://glitchd.in"];


// ✅ Middleware: Verify JWT for Logged-in Users
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized access" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// ✅ Rate limiter for guest users
const guestRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute for guests
  message: { error: "Too many requests, please try again later." },
});

// ✅ Rate limiter for authenticated users
const userRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per minute for authenticated users
  message: { error: "Too many requests, please try again later." },
});

// ✅ Middleware: Verify Referer and Origin
const verifyRefererAndOrigin = (req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (!origin && !referer) {
    return res.status(403).json({ error: "Forbidden: Invalid Access" });
  }
  

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Forbidden: Invalid Access" });
  }

  if (referer && !ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed))) {
    return res.status(403).json({ error: "Forbidden: Invalid Access" });
  }

  next();
};

// ✅ Handle CORS Preflight Requests
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGINS.join(","));
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); 
});

// ✅ Middleware for proxy requests
const proxyRequest = async (req, res, targetPath) => {
  try {
    const targetURL = `${BACKEND_API}${req.originalUrl.replace("/proxy", "")}`;

    const response = await axios({
      method: req.method,
      url: targetURL,
      headers: {
        Authorization: req.headers.authorization, // Keep user token
        "X-API-Key": VALID_API_KEY, // ✅ Inject API Key from env variable
        "Content-Type": req.headers["content-type"] || "application/json",
        "x-proxy-request": "true",
      },
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Proxy failed" });
  }
};

// ✅ Apply Origin, Referer before proxying requests
router.use(verifyRefererAndOrigin);

// ✅ Proxy Product Search Route with separate rate limits
router.use("/products/search", (req, res, next) => {
  if (req.headers.authorization) {
    return verifyJWT(req, res, () => userRateLimiter(req, res, next));
  }
  return guestRateLimiter(req, res, next);
});
// ✅ Allow login & register without JWT
router.post("/users/login", (req, res) => proxyRequest(req, res, "/users/login"));
router.post("/users/register", (req, res) => proxyRequest(req, res, "/users/register"));
// ✅ Proxy all product-related requests
router.use("/products", (req, res) => proxyRequest(req, res, "/products"));

// ✅ Proxy all user-related requests (only for logged-in users)
router.use("/users", verifyJWT, (req, res) => proxyRequest(req, res, "/users"));

// ✅ Proxy all wishlist-related requests (only for logged-in users)
router.use("/wishlist", verifyJWT, (req, res) => proxyRequest(req, res, "/wishlist"));

module.exports = router;

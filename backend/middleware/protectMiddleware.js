// const allowedOrigins = ["http://localhost:3000"];

// const verifyApiKey = (req, res, next) => {
//   const apiKey = req.headers["x-api-key"];
//   const requestOrigin = req.get("origin");

//   if (!allowedOrigins.some(origin => requestOrigin.startsWith(origin))) {
//     return res.status(403).json({ message: "Forbidden: Invalid origin" });
//   }

//   if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
//     return res.status(403).json({ message: "Forbidden: Invalid API key" });
//   }

//   next();
// };

//   module.exports = verifyApiKey;
  
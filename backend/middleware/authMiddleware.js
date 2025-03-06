const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized, please login!" });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(verified.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found!" });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                console.error("Token Expired:", error.message);
                return res.status(401).json({ message: "Token expired. Please log in again." });
            } else {
                console.error("JWT Verification failed:", error.message);
                return res.status(401).json({ message: "Not authorized, invalid token!" });
            }
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Not authorized, please login!" });
    }
});


const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin.");
    }
};

module.exports = {
    protect,
    adminOnly
};

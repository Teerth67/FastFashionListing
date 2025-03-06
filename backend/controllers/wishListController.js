const Wishlist = require("../models/wishList");

// 1️⃣ Add to Wishlist (Using `findOneAndUpdate`)
const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId }, // Find by userId
            { $addToSet: { items: productId } }, // Add only if not already present
            { new: true, upsert: true } // Return updated document, create if not found
        );

        res.status(200).json({ message: "Added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2️⃣ Get Wishlist
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const wishlist = await Wishlist.findOne({ user: userId }).populate("items");

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3️⃣ Remove from Wishlist (Using `findOneAndUpdate`)
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId }, // Find by userId
            { $pull: { items: productId } }, // Remove product from items array
            { new: true } // Return updated document
        );

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.status(200).json({ message: "Removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Export all functions at the end
module.exports = { addToWishlist, getWishlist, removeFromWishlist };

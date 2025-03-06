const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishListController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Apply `protect` middleware to restrict access to logged-in users
router.post('/add', protect, addToWishlist);
router.get('/:userId', protect, getWishlist);
router.delete('/remove', protect, removeFromWishlist);

module.exports = router;

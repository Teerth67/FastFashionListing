const express = require("express");
const { subscribeNewsletter, verifyEmail } = require("../controllers/newsLetterController");

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/verify", verifyEmail);

module.exports = router;

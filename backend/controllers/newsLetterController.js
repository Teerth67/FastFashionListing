const crypto = require("crypto");
const NewsletterSubscriber = require("../models/newsLetterSubscription");
const { sendEmail, sendVerificationEmail } = require("../utility/nodemailer");

// Subscribe and send verification email
exports.subscribeNewsletter = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email || !email.includes("@")) {
        return res.status(400).json({ message: "Please enter a valid name and email address" });
    }

    try {
        let subscriber = await NewsletterSubscriber.findOne({ email });

        if (subscriber && subscriber.isVerified) {
            return res.status(400).json({ message: "This email is already verified!" });
        }

        // Generate a new secure verification token
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const tokenExpiresAt = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

        if (!subscriber) {
            // First-time user: create new subscriber entry
            subscriber = await NewsletterSubscriber.create({
                name,
                email,
                verificationToken: hashedToken,
                tokenExpiresAt,
            });
        } else {
            // Update the existing user with a new token if not verified
            subscriber.name = name; // Update name if missing
            subscriber.verificationToken = hashedToken;
            subscriber.tokenExpiresAt = tokenExpiresAt;
            await subscriber.save();
        }

        console.log("Generated Token:", token);

        // Send verification email
        const verificationUrl = `http://localhost:5000/newsletter/verify?token=${token}`;
        await sendVerificationEmail(email, name, token);

        res.status(200).json({ message: "Verification email sent!" });
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};


// Verify email and confirm subscription
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        
        const subscriber = await NewsletterSubscriber.findOne({ verificationToken: hashedToken });
        
        if (!subscriber) {
            return res.status(400).json({ message: "Invalid or expired token!" });
        }
        
        // Mark the subscriber as verified
        subscriber.isVerified = true;
        subscriber.verificationToken = undefined; // Remove the used token
        subscriber.tokenExpiresAt = undefined;
        await subscriber.save();
        
        // Send a personalized welcome email
        const emailResponse = await sendEmail(subscriber.email, subscriber.name);
        
        if (!emailResponse.success) {
            console.error("Email sending failed:", emailResponse.error);
            return res.status(500).json({ message: "Verification successful, but email failed to send." });
        }
        
        res.json({ message: "Email verified successfully! You are now subscribed." });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};
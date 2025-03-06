const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail email
    pass: process.env.PASSWORD, // Your Gmail app password
  },
});

/**
 * Function to send a styled email
 * @param {string} to - Recipient email address
 * @param {string} firstName - Recipient's first name for personalization
 */
const sendEmail = async (to, firstName) => {
  const subject = "Welcome to the Future of Fashion — Your Glitch’d Exclusive Awaits!";
  const logoUrl = "https://yourwebsite.com/path-to-your-logo.png"; // Replace with actual logo URL
  const shopUrl = "https://yourwebsite.com/shop"; // Replace with actual shop link
  const socialUrl = "https://instagram.com/yourbrand"; // Replace with actual social link

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #000; color: #fff;">
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Glitch’d Logo" style="max-width: 150px; margin-bottom: 20px;" />
      <h1 style="font-size: 24px; font-weight: bold;">GLITCH’D - Fashion So Wrong, It’s Right ⚡</h1>
    </div>
    <p>Hey <strong>${firstName}</strong>,</p>
    <p>You’re officially part of the <strong>Glitch’d movement</strong>—a rebellion against the ordinary. Here, fashion isn’t just about wearing a trend; it’s about creating one.</p>

    <ul style="list-style: none; padding-left: 0;">
      <li>🔥 Streetwear that pushes <strong>boundaries.</strong></li>
      <li>🌐 Join a <strong>global community of trendsetters</strong></li>
      <li>🚀 Unlock <strong>curated edits & viral underground styles</strong></li>
    </ul>

    <p>And we’re just getting started. Soon, you’ll be the first to access independent designer collabs, limited-edition collections, and next-level streetwear tech.</p>

    <p style="text-align: center;">
      <a href="${shopUrl}" style="display: inline-block; padding: 12px 20px; background: #ff007f; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Shop Now</a>
      <a href="${socialUrl}" style="display: inline-block; padding: 12px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-left: 10px;">Follow Us</a>
    </p>

    <p style="font-size: 14px; text-align: center;">No limits. No labels. Just raw, unfiltered expression. <br />Welcome to the future of fashion.</p>

    <p style="text-align: center; font-size: 12px; opacity: 0.7;">🚀 Your first exclusive drop is coming soon. Keep an eye on your inbox—you won’t want to miss this.</p>
  </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlContent, // Use HTML instead of plain text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Email Error:", error);
    return { success: false, error: "Failed to send email" };
  }
};

/**
 * Function to send a verification email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient's name for personalization
 * @param {string} token - Verification token for authentication
 */
const sendVerificationEmail = async (to, name, token) => {
  const subject = "Verify Your Email - Glitch’d";
  const logoUrl = "https://yourwebsite.com/path-to-your-logo.png"; // Replace with actual logo URL
  const verificationUrl = `http://localhost:5000/newsletter/verify?token=${token}`; // Replace with actual verification link

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #000; color: #fff;">
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Glitch’d Logo" style="max-width: 150px; margin-bottom: 20px;" />
      <h1 style="font-size: 24px; font-weight: bold;">GLITCH’D - Fashion So Wrong, It’s Right ⚡</h1>
    </div>
    <p>Hey <strong>${name}</strong>,</p>
    <p>You're officially part of the <strong>Glitch’d movement</strong>—but first, verify your email.</p>

    <p style="text-align: center;">
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; background: #ff007f; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Verify Email</a>
    </p>

    <p>🔥 Get ready for <strong>exclusive weekly drops</strong></p>
    <p>🌐 Join a <strong>global community of trendsetters</strong></p>
    <p>🚀 Unlock <strong>curated edits & viral underground styles</strong></p>

    <p style="text-align: center; font-size: 12px; opacity: 0.7;">No limits. No labels. Just raw, unfiltered expression.<br />Welcome to the future of fashion.</p>
  </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Email Error:", error);
    return { success: false, error: "Failed to send email" };
  }
};
module.exports.sendEmail = sendEmail;
module.exports.sendVerificationEmail = sendVerificationEmail;


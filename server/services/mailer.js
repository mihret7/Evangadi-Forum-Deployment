const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test transporter connection
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

/**
 * Creates a standardized HTML email template.
 * @param {object} options - The options for the email content.
 * @param {string} options.title - The main headline of the email.
 * @param {string} options.body - The main paragraph content (can include HTML).
 * @param {string} options.buttonText - The text for the call-to-action button.
 * @param {string} options.buttonLink - The URL for the call-to-action button.
 * @returns {string} The complete HTML for the email.
 */
function createEmailTemplate({ title, body, buttonText, buttonLink }) {
  const bannerUrl =
    "https://media.licdn.com/dms/image/v2/C4D1BAQHjcAywjO5oog/company-background_10000/company-background_10000/0/1617365551032/evangadi_cover?e=2147483647&v=beta&t=H9otC1uxv80rgxHUXj0odSMh4I_raLIqjSXZgmmgI88";

  return `
    <div style="background-color: #f4f7f6; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <img src="${bannerUrl}" alt="Evangadi Banner" style="width: 100%; height: auto; display: block;"/>
        <div style="padding: 30px; color: #1e3a5f;">
          <h2 style="margin-top: 0; font-weight: 700; font-size: 24px;">${title}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${body}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${buttonLink}" style="display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #1e3a5f 60%, #007bff 100%); color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(30,58,95,0.15); transition: transform 0.2s;">
              ${buttonText}
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">If you have any questions, just reply to this email—we're always happy to help out.</p>
        </div>
        <div style="background-color: #eef2f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          &copy; ${new Date().getFullYear()} Evangadi Forum. All rights reserved.<br/>
          Evangadi Community, Addis Ababa, Ethiopia
        </div>
      </div>
    </div>
  `;
}

// Password reset email function
async function sendPasswordResetEmail(email, username, resetLink) {
  try {
    const emailHtml = createEmailTemplate({
      title: "Password Reset Request",
      body: `Hello ${username},<br/><br/>We received a request to reset your password. Click the button below to proceed. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
      buttonText: "Reset Password",
      buttonLink: resetLink,
    });

    await transporter.sendMail({
      from: `"Evangadi Forum" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}

// Answer notification email function
async function sendAnswerNotification(
  email,
  questionId,
  questionTitle = "your question"
) {
  try {
    const questionLink = `${process.env.FRONTEND_URL}/question-detail/${questionId}`;
    const emailHtml = createEmailTemplate({
      title: "Your Question Has a New Answer!",
      body: `Someone just answered your question: <strong>"${questionTitle}"</strong>. Click the button below to see the new answer and join the discussion.`,
      buttonText: "View Your Question",
      buttonLink: questionLink,
    });

    await transporter.sendMail({
      from: `"Evangadi Forum" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your question has been answered!",
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending answer notification email:", error);
    return false;
  }
}

module.exports = {
  transporter,
  sendPasswordResetEmail,
  sendAnswerNotification,
};

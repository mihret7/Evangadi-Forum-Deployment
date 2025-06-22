const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");
const { sendPasswordResetEmail } = require("../services/mailer");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide an email address." });
  }

  try {
    const userResult = await dbConnection.query(
      "SELECT user_id, user_name FROM registration WHERE user_email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "If your email is registered, you will receive a reset link.",
      });
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    await dbConnection.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.user_id, hashedToken, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, user.user_name, resetUrl);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An internal error occurred." });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // We cannot hash the token and compare directly because bcrypt hashes differ every time.
    // Instead, retrieve all non-expired tokens and compare with bcrypt.compare:

    const tokenResult = await dbConnection.query(
      "SELECT * FROM password_reset_tokens WHERE expires_at > NOW()"
    );

    const tokens = tokenResult.rows;

    let valid = false;
    for (const row of tokens) {
      const isMatch = await bcrypt.compare(token, row.token);
      if (isMatch) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ valid: false, message: "Token is invalid or has expired." });
    }

    res.status(StatusCodes.OK).json({ valid: true });
  } catch (error) {
    console.error("Verify Token Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An internal error occurred." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const tokenResult = await dbConnection.query(
      "SELECT * FROM password_reset_tokens WHERE expires_at > NOW()"
    );

    const tokens = tokenResult.rows;

    let user_id;
    let tokenIsValid = false;
    for (const row of tokens) {
      const isMatch = await bcrypt.compare(token, row.token);
      if (isMatch) {
        tokenIsValid = true;
        user_id = row.user_id;
        break;
      }
    }

    if (!tokenIsValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "UPDATE registration SET password = $1 WHERE user_id = $2",
      [hashedPassword, user_id]
    );

    await dbConnection.query(
      "DELETE FROM password_reset_tokens WHERE user_id = $1",
      [user_id]
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token is invalid or has expired." });
  }
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword,
};

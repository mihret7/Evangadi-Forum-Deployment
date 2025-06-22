const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");
const xss = require("xss");

// login route implementation FOR already registered users
async function login(req, res) {
  // Sanitize email and password
  const email = xss(req.body.email);
  const password = xss(req.body.password);

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const result = await dbConnection.query(
      `SELECT r.user_name, r.user_id, r.user_email, r.password, p.first_name
       FROM registration r
       JOIN profile p ON r.user_id = p.user_id
       WHERE r.user_email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found, please register first" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }

    const { user_id: userid, user_name: username, first_name } = user;

    const token = jwt.sign({ userid, username }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(StatusCodes.OK).json({
      message: "User login successful",
      userid,
      username,
      email: user.user_email,
      first_name,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { login };

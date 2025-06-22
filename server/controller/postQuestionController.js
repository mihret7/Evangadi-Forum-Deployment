const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const xss = require("xss");

async function postQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user?.userid; // Assuming user ID is stored in req.user

    // Validate required fields
    if (!title || !description || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title, description, and user-ID are required",
      });
    }

    // Validate tag length (max 20 chars per schema)
    if (tag && tag.length > 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Tag must be 20 characters or less",
      });
    }

    // Sanitize inputs to prevent XSS
    const sanitizedTitle = xss(title);
    const sanitizedDescription = xss(description);
    const sanitizedTag = tag ? xss(tag) : null;

    // Generate a unique post_id before insert (optional for PostgreSQL, can use SERIAL or UUID instead)
    const postId = Math.floor(Math.random() * 2147483647) + 1;

    // Insert question into database with RETURNING to get inserted ID
    const insertQuery = `
      INSERT INTO question (question_title, question_description, tag, user_id, post_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING question_id
    `;
    const result = await dbconnection.query(insertQuery, [
      sanitizedTitle,
      sanitizedDescription,
      sanitizedTag,
      userId,
      postId,
    ]);

    res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully",
      questionId: result.rows[0].question_id,
    });
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error posting question",
      error: error.message,
    });
  }
}

module.exports = { postQuestion };

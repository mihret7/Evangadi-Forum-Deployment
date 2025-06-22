const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function handleVote(req, res, type, isLike) {
  const id = req.params[`${type}_id`];
  const userId = req.user.userid;

  let typeIdColumn;
  if (type === "question") {
    typeIdColumn = "question_id";
  } else if (type === "answer") {
    typeIdColumn = "answer_id";
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid resource type." });
  }

  try {
    // Upsert vote
    const insertQuery = `
      INSERT INTO likes_dislikes (user_id, ${typeIdColumn}, is_like)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, ${typeIdColumn})
      DO UPDATE SET is_like = EXCLUDED.is_like;
    `;
    await dbconnection.query(insertQuery, [userId, id, isLike]);

    // Get updated counts
    const countQuery = `
      SELECT
        SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
      FROM likes_dislikes
      WHERE ${typeIdColumn} = $1
    `;
    const countResult = await dbconnection.query(countQuery, [id]);
    const counts = countResult.rows[0];

    res.status(StatusCodes.OK).json({
      likes: parseInt(counts.likes, 10) || 0,
      dislikes: parseInt(counts.dislikes, 10) || 0,
    });
  } catch (err) {
    console.error(`Error while voting on ${type}:`, err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Database error occurred." });
  }
}

const likeQuestion = (req, res) => handleVote(req, res, "question", true);
const dislikeQuestion = (req, res) => handleVote(req, res, "question", false);
const likeAnswer = (req, res) => handleVote(req, res, "answer", true);
const dislikeAnswer = (req, res) => handleVote(req, res, "answer", false);

module.exports = { likeQuestion, dislikeQuestion, likeAnswer, dislikeAnswer };

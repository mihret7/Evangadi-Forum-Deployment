const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

// Get all questions with pagination, sorting, search
async function getquestions(req, res) {
  try {
    const userId = req.user?.userid || 0;

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Sorting
    const sort = req.query.sort === "popular" ? "popular" : "recent";
    let orderBy = "q.created_at DESC";
    if (sort === "popular") {
      orderBy = "likes DESC, q.created_at DESC";
    }

    // Search
    const search = req.query.search ? req.query.search.trim() : null;
    let whereClause = "";
    let params = [];
    if (search) {
      whereClause = `WHERE (q.tag ILIKE $1 OR q.question_title ILIKE $2 OR q.question_description ILIKE $3)`;
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch);
    }

    // Total count for pagination
    const countQuery = `SELECT COUNT(*) AS total FROM question q ${whereClause}`;
    const countResult = await dbconnection.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Build params for main query
    const userParamIndex = params.length + 1;
    const limitParamIndex = params.length + 2;
    const offsetParamIndex = params.length + 3;

    params.push(userId, pageSize, offset);

    // Main query
    const questionsQuery = `
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = true THEN 'up'
          WHEN ul.is_like = false THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul
        ON ul.question_id = q.question_id AND ul.user_id = $${userParamIndex}
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex};
    `;

    const questionsResult = await dbconnection.query(questionsQuery, params);

    res.status(StatusCodes.OK).json({
      questions: questionsResult.rows,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving questions" });
  }
}

// Get a single question by ID
async function getSingleQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.userid || 0;

    const questionQuery = `
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = true THEN 'up'
          WHEN ul.is_like = false THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul
        ON ul.question_id = q.question_id AND ul.user_id = $1
      WHERE q.question_id = $2;
    `;

    const questionResult = await dbconnection.query(questionQuery, [
      userId,
      id,
    ]);

    if (questionResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    res.status(StatusCodes.OK).json({ question: questionResult.rows[0] });
  } catch (error) {
    console.error(
      `Error retrieving question with id ${req.params.id}:`,
      error.message
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving question" });
  }
}

module.exports = { getquestions, getSingleQuestion };

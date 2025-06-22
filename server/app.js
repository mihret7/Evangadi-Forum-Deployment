// imports
const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/db.Config");
const dotenv = require("dotenv");

// configuring dotenv
dotenv.config();

const app = express();

// middlewares
app.use(
  cors({
    origin: "https://evangadi-forum-mihret.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import auth middleware
const authMiddleware = require("./middleware/authMiddleware");

// import admin routes
const initDB_Router = require("./routes/initDB_route");
const createTableRouter = require("./routes/createTablesRoute");
// import user routes
const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const passwordResetRouter = require("./routes/passwordResetRoute");

// import question and answer routes
const getquestions = require("./routes/getquestionsRoute");
const postQuestionRoutes = require("./routes/postQuestionsRoute");
const getAnswerRouter = require("./routes/getAnswerRoute");
const postAnswerRoutes = require("./routes/postAnswerRoute");
const likeDislikeRouter = require("./routes/likeDislikeRoute");
const updateQuestionRouter = require("./routes/updateQuestionRouter");
const updateAnswerRouter = require("./routes/updateAnswerRoute");

// --- All Routes ---
// admin routes middleware
app.use("/api/admin", initDB_Router);
app.use("/api/admin", createTableRouter);

// user routes middleware
app.use("/api/user", registerRouter);
app.use("/api/user", loginRouter);
app.use("/api/user", passwordResetRouter);

// question and answer routes middleware
app.use("/api", getquestions);
app.use("/api", getAnswerRouter);
app.use("/api", authMiddleware, postQuestionRoutes);
app.use("/api", authMiddleware, postAnswerRoutes);
app.use("/api", authMiddleware, likeDislikeRouter);
app.use("/api", authMiddleware, updateQuestionRouter);
app.use("/api", authMiddleware, updateAnswerRouter);

// profile routes
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", authMiddleware, profileRoutes);

// Start server and test database connection
async function connectDB() {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()"); // test query
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}


const PORT = process.env.PORT || 5400;
app.listen(PORT, async () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
  await connectDB();
});


const express = require("express");
const { getquestions, getSingleQuestion } = require("../controller/getquestionsController");

const getQuestionRouter = express.Router();

getQuestionRouter.get("/question", getquestions);
getQuestionRouter.get("/question/:id", getSingleQuestion);

module.exports = getQuestionRouter;



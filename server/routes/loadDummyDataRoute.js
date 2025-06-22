const express = require("express");
const {  } = require("../controller/loadDummyDataController");

const loginRouter = express.Router();

loginRouter.post("/login", login);

module.exports = loginRouter;

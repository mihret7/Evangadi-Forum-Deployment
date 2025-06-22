const express = require("express");
const { createTable } = require("../controller/createTableController");

const createTableRouter = express.Router();

createTableRouter.post("/createTables", createTable);

module.exports = createTableRouter;




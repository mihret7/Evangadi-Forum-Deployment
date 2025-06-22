const express = require("express");
const { insertDummyData } = require("../controller/loadDummyDataController");

const insertDummyDataRouter = express.Router();

insertDummyDataRouter.post("/insertDummyData", insertDummyData);

module.exports = insertDummyDataRouter;

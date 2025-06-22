const dbconnection = require("../db/db.Config");
const dummy_data = require("../db/dummy_data.sql");
const fs = require("fs");


async function insertDummyData() {
  const sql = fs.readFileSync(dummy_data, "utf8");
  try {
    await dbconnection.query(sql);
    console.log("Dummy data inserted successfully");
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  } finally {
    await dbconnection.end();
  }
}

module.exports = {insertDummyData, };
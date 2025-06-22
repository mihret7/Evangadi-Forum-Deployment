const dbconnection = require("../db/db.Config");
const fs = require("fs");
const path = require("path");

async function insertDummyData() {
  try {
    const sqlFilePath = path.join(__dirname, "../db/dummy_data.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");
    await dbconnection.query(sql);
    console.log("Dummy data inserted successfully");
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  } finally {
    await dbconnection.end();
  }
}

module.exports = { insertDummyData };

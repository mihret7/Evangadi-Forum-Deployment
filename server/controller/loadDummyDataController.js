const dbconnection = require("../db/db.Config");
const fs = require("fs");
const path = require("path");

async function insertDummyData() {
  try {
    const sqlFilePath = path.join(__dirname, "../db/dummy_data.sql");
    let sql = fs.readFileSync(sqlFilePath, "utf8");

    // Remove line comments and split by semicolon
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      await dbconnection.query(statement);
    }

    console.log("Dummy data inserted successfully");
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  }
  // Don't call dbconnection.end() here to keep the pool alive
}

module.exports = { insertDummyData };

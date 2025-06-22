const mysql = require("mysql2/promise");

async function initDB(req, res) {
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      // password: "", // XAMPP default root password is empty string
      password: "root", // for MAMP default root password is root
    });

    // Create database
    await rootConn.query("CREATE DATABASE IF NOT EXISTS evangadi_forum");

    // Create user and grant privileges
    await rootConn.query(
      "CREATE USER IF NOT EXISTS 'evangadi_admin'@'localhost' IDENTIFIED BY '123456'"
    );
    await rootConn.query(
      "GRANT ALL PRIVILEGES ON evangadi_forum.* TO 'evangadi_admin'@'localhost'"
    );
    await rootConn.query("FLUSH PRIVILEGES"); // to make sure that privileges are updated/refreshed on grant table in MYSQL memory

    res.send("Database and user created with all privileges.");
  } catch (err) {
    res.status(500).send("Error initializing database/user: " + err.message);
  } finally {
    // to make sure that the root connection is closed; finally block execute independently of try/catch
    if (rootConn) await rootConn.end();
  }
}

module.exports = { initDB };






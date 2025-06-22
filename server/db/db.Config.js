require("dotenv").config(); // Load environment variables from .env

const mysql2 = require("mysql2/promise");


//! using .env for sensitive credentials
const dbconnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
});

module.exports = dbconnection;





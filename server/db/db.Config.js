require("dotenv").config(); // Load environment variables from .env

const { Pool } = require("pg");

//! using .env for sensitive credentials
const dbconnection = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: process.env.DB_CONNECTION_LIMIT || 10,
  ssl: {
    rejectUnauthorized: false, // Render uses trusted certs so this is safe for most cases
  },
});

module.exports = dbconnection;





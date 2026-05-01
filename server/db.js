const Pool = require("pg").Pool;
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "root",
  database: process.env.PGDATABASE || "pernWeightItems",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => {
    console.log("PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

module.exports = pool;
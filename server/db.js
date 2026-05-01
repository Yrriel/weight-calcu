const Pool = require("pg").Pool;
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

module.exports = pool;
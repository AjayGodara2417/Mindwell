import mysql from "mysql2/promise";
// import fs from "fs";
// import path from "path";

// const caPath = path.join(process.cwd(), "certs", "ca.pem");

const db = mysql.createPool({
  host: process.env.DB_HOST,        // Aiven host
  port: Number(process.env.DB_PORT), // Aiven port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,

  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
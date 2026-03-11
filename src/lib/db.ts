import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "@QAZajay2417$",
  database: "mindwell",
  connectionLimit: 10,
});

export default db;
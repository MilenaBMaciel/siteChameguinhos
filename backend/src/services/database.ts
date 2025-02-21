import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "d1a6",
  database: process.env.DB_NAME || "chameguinhos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

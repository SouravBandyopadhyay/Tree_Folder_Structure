import mysql from "mysql2/promise";
import { configDotenv } from "dotenv";
console.log(configDotenv());

const { HOST, USER, PASSWORD, DATABASE } = process.env;
const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

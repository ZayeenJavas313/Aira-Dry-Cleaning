import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sslConfig = process.env.DB_SSL === 'true' ? {} : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aira_laundry',
  waitForConnections: true,
  connectionLimit: 10,
  ...(sslConfig ? { ssl: sslConfig } : {}),
});

console.log(`🐬 MySQL database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

export default pool;

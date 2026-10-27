import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mi_base_de_datos',
  waitForConnections: true,
  // El plan gratuito de Clever Cloud permite 5 conexiones simultáneas en total
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 4,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

export default pool;

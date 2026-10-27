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
  // El plan gratuito de Clever Cloud permite 5 conexiones simultáneas en total, repartidas
  // entre el servidor local y cada instancia de Vercel: cada proceso usa pocas y las suelta rápido
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 2,
  maxIdle: 1,
  idleTimeout: 10000,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

export default pool;

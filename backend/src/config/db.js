import dotenv from 'dotenv';

dotenv.config();

const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

let pool;

if (dbType === 'mysql') {
  const mod = await import('./mysql-db.js');
  pool = mod.default;
} else {
  const mod = await import('./sqlite-db.js');
  pool = mod.default;
}

export default pool;
export { dbType };

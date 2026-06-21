import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dataDir;
if (process.env.VERCEL) {
  dataDir = '/tmp/aira-laundry-data';
} else {
  dataDir = path.join(__dirname, '../../data');
}
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.SQLITE_PATH || path.join(dataDir, 'aira_laundry.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'pelanggan' CHECK(role IN ('pelanggan','admin','kasir','pegawai','pemilik')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  joined_at TEXT DEFAULT (date('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg' CHECK(unit IN ('kg','item','pasang')),
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trx_code TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  weight REAL DEFAULT 0,
  item_count INTEGER DEFAULT 0,
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  extra_fee REAL DEFAULT 0,
  total REAL NOT NULL,
  status TEXT DEFAULT 'Diterima' CHECK(status IN ('Diterima','Dicuci','Dikeringkan','Disetrika','Dikemas','Selesai','Diambil')),
  payment_status TEXT DEFAULT 'belum' CHECK(payment_status IN ('belum','lunas')),
  payment_method TEXT,
  payment_gateway TEXT,
  note TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('laundry_diterima','laundry_proses','laundry_selesai','pembayaran')),
  is_read INTEGER DEFAULT 0,
  transaction_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  updated_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
`;

db.exec(SCHEMA);

/** Translate common MySQL syntax to SQLite */
function translateSql(sql) {
  return sql
    .replace(/DATE_FORMAT\s*\(\s*created_at\s*,\s*'%a'\s*\)/gi, "strftime('%d/%m', created_at)")
    .replace(/DATE_FORMAT\s*\(\s*created_at\s*,\s*'%b'\s*\)/gi, "strftime('%m', created_at)")
    .replace(/DATE_SUB\s*\(\s*CURDATE\s*\(\s*\)\s*,\s*INTERVAL\s+7\s+DAY\s*\)/gi, "date('now', '-7 days')")
    .replace(/MONTH\s*\(\s*created_at\s*\)\s*=\s*MONTH\s*\(\s*CURDATE\s*\(\s*\)\s*\)/gi, "strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')")
    .replace(/YEAR\s*\(\s*created_at\s*\)\s*=\s*YEAR\s*\(\s*CURDATE\s*\(\s*\)\s*\)/gi, "strftime('%Y', created_at) = strftime('%Y', 'now')")
    .replace(/GROUP BY MONTH\s*\(\s*created_at\s*\)/gi, "GROUP BY strftime('%Y-%m', created_at)")
    .replace(/ORDER BY MONTH\s*\(\s*created_at\s*\)/gi, "ORDER BY strftime('%Y-%m', created_at)")
    .replace(/CURDATE\s*\(\s*\)/gi, "date('now')")
    .replace(/NOW\s*\(\s*\)/gi, "datetime('now')")
    .replace(/BOOLEAN/gi, 'INTEGER')
    .replace(/TRUE/gi, '1')
    .replace(/FALSE/gi, '0')
    .replace(/\bis_active\s*=\s*true\b/gi, 'is_active = 1')
    .replace(/\bis_active\s*=\s*false\b/gi, 'is_active = 0');
}

function isSelect(sql) {
  return sql.trim().toUpperCase().startsWith('SELECT');
}

function isInsert(sql) {
  return sql.trim().toUpperCase().startsWith('INSERT');
}

function isUpdate(sql) {
  return sql.trim().toUpperCase().startsWith('UPDATE');
}

function isDelete(sql) {
  return sql.trim().toUpperCase().startsWith('DELETE');
}

function isCreate(sql) {
  const u = sql.trim().toUpperCase();
  return u.startsWith('CREATE') || u.startsWith('USE ');
}

const pool = {
  async query(sql, params = []) {
    const translated = translateSql(sql);

    if (isCreate(translated)) {
      if (translated.toUpperCase().startsWith('USE ')) return [[], []];
      db.exec(translated);
      return [[], []];
    }

    try {
      if (isSelect(translated)) {
        const stmt = db.prepare(translated);
        const rows = stmt.all(...params);
        return [rows, []];
      }

      if (isInsert(translated)) {
        const stmt = db.prepare(translated);
        const info = stmt.run(...params);
        return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }, []];
      }

      if (isUpdate(translated) || isDelete(translated)) {
        const stmt = db.prepare(translated);
        const info = stmt.run(...params);
        return [{ insertId: 0, affectedRows: info.changes }, []];
      }

      db.exec(translated);
      return [[], []];
    } catch (err) {
      console.error('SQLite query error:', translated, params, err.message);
      throw err;
    }
  },
};

console.log(`📦 SQLite database: ${dbPath}`);

export default pool;
export { db };

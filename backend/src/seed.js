import bcrypt from 'bcryptjs';
import pool, { dbType } from './config/db.js';

const users = [
  { name: 'Admin Aira', email: 'admin@aira.com', role: 'admin', phone: '081111111111' },
  { name: 'Kasir 1', email: 'kasir@aira.com', role: 'kasir', phone: '082222222222' },
  { name: 'Andi Pratama', email: 'pegawai@aira.com', role: 'pegawai', phone: '083333333333' },
  { name: 'Bapak Andi', email: 'pemilik@aira.com', role: 'pemilik', phone: '084444444444' },
  { name: 'Budi Santoso', email: 'pelanggan@aira.com', role: 'pelanggan', phone: '081234567890', address: 'Jl. Merdeka No. 12, Jakarta' },
];

const services = [
  { name: 'Cuci Reguler', price: 5000, unit: 'kg', duration: '2-3 hari', category: 'Cuci' },
  { name: 'Cuci Express', price: 10000, unit: 'kg', duration: '1 hari', category: 'Cuci' },
  { name: 'Dry Clean', price: 25000, unit: 'item', duration: '3-5 hari', category: 'Khusus' },
  { name: 'Setrika Saja', price: 3000, unit: 'kg', duration: '1 hari', category: 'Setrika' },
  { name: 'Cuci Sepatu', price: 30000, unit: 'pasang', duration: '2-3 hari', category: 'Khusus' },
  { name: 'Cuci Karpet', price: 15000, unit: 'kg', duration: '3-4 hari', category: 'Cuci' },
  { name: 'Premium Wash', price: 15000, unit: 'kg', duration: '1-2 hari', category: 'Premium' },
];

export async function seedDatabase() {
  console.log(`🌱 Seeding database (${dbType})...`);

  if (dbType === 'mysql') {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    for (const stmt of schema.split(';').filter(s => s.trim())) {
      const trimmed = stmt.trim();
      if (!trimmed) continue;
      if (/^CREATE\s+DATABASE/i.test(trimmed)) continue;
      if (/^USE\s+/i.test(trimmed)) continue;
      await pool.query(trimmed);
    }
    console.log('✅ MySQL schema created');
  }

  const password = await bcrypt.hash('password123', 10);

  for (const u of users) {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
    if (existing.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
        [u.name, u.email, password, u.phone, u.address || null, u.role]
      );
      if (u.role === 'pelanggan') {
        await pool.query(
          'INSERT INTO customers (user_id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
          [result.insertId, u.name, u.phone, u.email, u.address || null]
        );
      }
    }
  }
  console.log('✅ Users seeded');

  for (const s of services) {
    const [existing] = await pool.query('SELECT id FROM services WHERE name = ?', [s.name]);
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO services (name, price, unit, duration, category) VALUES (?, ?, ?, ?, ?)',
        [s.name, s.price, s.unit, s.duration, s.category]
      );
    }
  }
  console.log('✅ Services seeded');

  const extraCustomers = [
    { name: 'Dewi Rahayu', phone: '082345678901', email: 'dewi@email.com', address: 'Jl. Sudirman No. 5, Bandung' },
    { name: 'Ahmad Fauzi', phone: '083456789012', email: 'ahmad@email.com', address: 'Jl. Ahmad Yani No. 33, Surabaya' },
    { name: 'Siti Nurhaliza', phone: '084567890123', email: 'siti@email.com', address: 'Jl. Gatot Subroto No. 7, Medan' },
  ];

  for (const c of extraCustomers) {
    const [existing] = await pool.query('SELECT id FROM customers WHERE phone = ?', [c.phone]);
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
        [c.name, c.phone, c.email, c.address]
      );
    }
  }
  console.log('✅ Extra customers seeded');

  const [cust] = await pool.query('SELECT id FROM customers WHERE phone = ?', ['081234567890']);
  const [svc] = await pool.query('SELECT id, price, unit FROM services WHERE name = ?', ['Cuci Reguler']);
  const [trxCount] = await pool.query('SELECT COUNT(*) as count FROM transactions');
  const count = Number(trxCount[0]?.count ?? 0);

  if (count === 0 && cust.length && svc.length) {
    const statuses = ['Diterima', 'Dicuci', 'Dikeringkan', 'Disetrika', 'Dikemas', 'Selesai', 'Diambil'];
    for (let i = 0; i < 8; i++) {
      const weight = 2 + i * 0.5;
      const total = svc[0].price * weight;
      await pool.query(
        `INSERT INTO transactions (trx_code, customer_id, service_id, weight, subtotal, total, status, payment_status, payment_method, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [`TRX-${String(i + 1).padStart(3, '0')}`, cust[0].id, svc[0].id, weight, total, total,
          statuses[i % statuses.length], i % 3 === 0 ? 'belum' : 'lunas', i % 2 === 0 ? 'tunai' : 'transfer']
      );
    }
    console.log('✅ Sample transactions seeded');
  }

  console.log('\n🎉 Seed completed! Login credentials:');
  console.log('   admin@aira.com / password123');
  console.log('   kasir@aira.com / password123');
  console.log('   pegawai@aira.com / password123');
  console.log('   pemilik@aira.com / password123');
  console.log('   pelanggan@aira.com / password123');
}

// Run directly when executed as script
const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('seed.js');
if (isDirectRun) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seed failed:', err.message);
      if (dbType === 'mysql') {
        console.error('\n💡 Tip: MariaDB XAMPP error? Set DB_TYPE=sqlite in backend/.env');
        console.error('   Or run: .\\scripts\\fix-xampp-mysql.ps1');
      }
      process.exit(1);
    });
}

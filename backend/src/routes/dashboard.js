import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const role = req.user.role;
    const today = new Date().toISOString().split('T')[0];

    if (role === 'pelanggan') {
      const [cust] = await pool.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
      if (cust.length === 0) return res.json({ success: true, data: {} });
      const customerId = cust[0].id;

      const [[stats]] = await pool.query(`
        SELECT
          COUNT(*) as total_transactions,
          SUM(CASE WHEN status NOT IN ('Selesai','Diambil') THEN 1 ELSE 0 END) as processing,
          SUM(CASE WHEN status IN ('Selesai','Diambil') THEN 1 ELSE 0 END) as completed,
          COALESCE(SUM(total), 0) as total_spent
        FROM transactions WHERE customer_id = ?
      `, [customerId]);

      const [recent] = await pool.query(
        'SELECT t.*, s.name as service_name FROM transactions t JOIN services s ON s.id = t.service_id WHERE t.customer_id = ? ORDER BY t.created_at DESC LIMIT 5',
        [customerId]
      );

      return res.json({ success: true, data: { stats, recent } });
    }

    if (role === 'kasir') {
      const [[stats]] = await pool.query(`
        SELECT
          COUNT(CASE WHEN DATE(created_at) = ? THEN 1 END) as today_transactions,
          COALESCE(SUM(CASE WHEN DATE(created_at) = ? AND payment_status = 'lunas' THEN total END), 0) as today_revenue,
          SUM(CASE WHEN payment_status = 'belum' THEN 1 ELSE 0 END) as unpaid,
          SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as ready_pickup
        FROM transactions
      `, [today, today]);

      const [ready] = await pool.query(`
        SELECT t.*, c.name as customer_name, s.name as service_name
        FROM transactions t JOIN customers c ON c.id = t.customer_id JOIN services s ON s.id = t.service_id
        WHERE t.status = 'Selesai' ORDER BY t.updated_at DESC LIMIT 10
      `);

      return res.json({ success: true, data: { stats, ready } });
    }

    if (role === 'pegawai') {
      const [[stats]] = await pool.query(`
        SELECT
          SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) as incoming,
          SUM(CASE WHEN status IN ('Dicuci','Dikeringkan','Disetrika','Dikemas') THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'Selesai' AND DATE(updated_at) = ? THEN 1 ELSE 0 END) as completed_today,
          SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as ready_pickup
        FROM transactions
      `, [today]);

      const [orders] = await pool.query(`
        SELECT t.*, c.name as customer_name, s.name as service_name
        FROM transactions t JOIN customers c ON c.id = t.customer_id JOIN services s ON s.id = t.service_id
        WHERE t.status != 'Diambil' ORDER BY t.created_at ASC
      `);

      return res.json({ success: true, data: { stats, orders } });
    }

    // admin & pemilik
    const [[stats]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COUNT(*) FROM users WHERE role IN ('kasir','pegawai')) as total_employees,
        COALESCE((SELECT SUM(total) FROM transactions WHERE payment_status = 'lunas' AND MONTH(created_at) = MONTH(CURDATE())), 0) as monthly_revenue,
        SUM(CASE WHEN status NOT IN ('Selesai','Diambil') THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status IN ('Selesai','Diambil') THEN 1 ELSE 0 END) as completed
      FROM transactions
    `);

    const [weeklyRevenue] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%a') as day,
        COALESCE(SUM(CASE WHEN payment_status = 'lunas' THEN total END), 0) as revenue,
        COUNT(*) as transactions
      FROM transactions
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at) ORDER BY DATE(created_at)
    `);

    const [servicePopular] = await pool.query(`
      SELECT s.name, COUNT(t.id) as count
      FROM services s LEFT JOIN transactions t ON t.service_id = s.id
      GROUP BY s.id ORDER BY count DESC LIMIT 5
    `);

    const [recentTrx] = await pool.query(`
      SELECT t.*, c.name as customer_name, s.name as service_name
      FROM transactions t JOIN customers c ON c.id = t.customer_id JOIN services s ON s.id = t.service_id
      ORDER BY t.created_at DESC LIMIT 6
    `);

    let ownerData = {};
    if (role === 'pemilik') {
      const [monthlyRevenue] = await pool.query(`
        SELECT DATE_FORMAT(created_at, '%b') as month,
          COALESCE(SUM(CASE WHEN payment_status = 'lunas' THEN total END), 0) as revenue
        FROM transactions WHERE YEAR(created_at) = YEAR(CURDATE())
        GROUP BY MONTH(created_at) ORDER BY MONTH(created_at)
      `);

      const [employeePerf] = await pool.query(`
        SELECT u.name, u.role,
          COUNT(sh.id) as orders_handled,
          SUM(CASE WHEN sh.status = 'Selesai' THEN 1 ELSE 0 END) as completed
        FROM users u
        LEFT JOIN status_history sh ON sh.updated_by = u.id
        WHERE u.role IN ('pegawai','kasir')
        GROUP BY u.id ORDER BY orders_handled DESC LIMIT 5
      `);

      const [[yearStats]] = await pool.query(`
        SELECT COALESCE(SUM(CASE WHEN payment_status = 'lunas' THEN total END), 0) as yearly_revenue
        FROM transactions WHERE YEAR(created_at) = YEAR(CURDATE())
      `);

      ownerData = { monthlyRevenue, employeePerf, yearly_revenue: yearStats.yearly_revenue };
    }

    res.json({
      success: true,
      data: { stats, weeklyRevenue, servicePopular, recentTrx, ...ownerData },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { validate, generateTrxCode } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const STATUSES = ['Diterima', 'Dicuci', 'Dikeringkan', 'Disetrika', 'Dikemas', 'Selesai', 'Diambil'];

async function getTransactionsQuery(filters = {}) {
  let query = `
    SELECT t.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
           s.name as service_name, s.unit as service_unit, s.duration as service_duration
    FROM transactions t
    JOIN customers c ON c.id = t.customer_id
    JOIN services s ON s.id = t.service_id
    WHERE 1=1
  `;
  const params = [];

  if (filters.customer_id) {
    query += ' AND t.customer_id = ?';
    params.push(filters.customer_id);
  }
  if (filters.status) {
    query += ' AND t.status = ?';
    params.push(filters.status);
  }
  if (filters.payment_status) {
    query += ' AND t.payment_status = ?';
    params.push(filters.payment_status);
  }
  if (filters.search) {
    query += ' AND (t.trx_code LIKE ? OR c.name LIKE ? OR c.phone LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s);
  }
  if (filters.date_from) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(filters.date_from);
  }
  if (filters.date_to) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(filters.date_to);
  }
  if (filters.service_id) {
    query += ' AND t.service_id = ?';
    params.push(filters.service_id);
  }

  query += ' ORDER BY t.created_at DESC';
  return { query, params };
}

router.get('/', authenticate, async (req, res) => {
  try {
    const filters = { ...req.query };
    if (req.user.role === 'pelanggan') {
      const [cust] = await pool.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
      if (cust.length === 0) return res.json({ success: true, data: [] });
      filters.customer_id = cust[0].id;
    }
    const { query, params } = await getTransactionsQuery(filters);
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { query, params } = await getTransactionsQuery({});
    const [rows] = await pool.query(query.replace('WHERE 1=1', 'WHERE t.id = ?'), [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }
    const [history] = await pool.query(
      'SELECT sh.*, u.name as updated_by_name FROM status_history sh LEFT JOIN users u ON u.id = sh.updated_by WHERE sh.transaction_id = ? ORDER BY sh.created_at',
      [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], history } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/', authenticate, authorize('admin', 'kasir', 'pelanggan'), [
  body('customer_id').isInt().withMessage('Pelanggan wajib dipilih'),
  body('service_id').isInt().withMessage('Layanan wajib dipilih'),
  body('weight').optional().isFloat({ min: 0 }),
  body('item_count').optional().isInt({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('extra_fee').optional().isFloat({ min: 0 }),
  body('note').optional(),
], validate, async (req, res) => {
  try {
    const { customer_id, service_id, weight = 0, item_count = 0, discount = 0, extra_fee = 0, note, payment_method, payment_status } = req.body;

    const [services] = await pool.query('SELECT * FROM services WHERE id = ? AND is_active = 1', [service_id]);
    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }
    const service = services[0];

    if (service.unit === 'kg' && (!weight || weight <= 0)) {
      return res.status(422).json({ success: false, message: 'Berat cucian tidak boleh kosong' });
    }

    const multiplier = service.unit === 'kg' ? weight : item_count || 1;
    const subtotal = service.price * multiplier;
    const total = subtotal - discount + extra_fee;

    if (total < 0) {
      return res.status(422).json({ success: false, message: 'Harga tidak valid' });
    }

    const trx_code = await generateTrxCode(pool);
    const [result] = await pool.query(
      `INSERT INTO transactions (trx_code, customer_id, service_id, weight, item_count, subtotal, discount, extra_fee, total, payment_status, payment_method, note, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [trx_code, customer_id, service_id, weight, item_count, subtotal, discount, extra_fee, total,
        payment_status || 'belum', payment_method || null, note || null, req.user.id]
    );

    await pool.query('INSERT INTO status_history (transaction_id, status, updated_by) VALUES (?, ?, ?)',
      [result.insertId, 'Diterima', req.user.id]);

    const [cust] = await pool.query('SELECT user_id FROM customers WHERE id = ?', [customer_id]);
    if (cust[0]?.user_id) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type, transaction_id) VALUES (?, ?, ?, ?, ?)',
        [cust[0].user_id, 'Laundry Diterima', `Pesanan ${trx_code} telah diterima`, 'laundry_diterima', result.insertId]
      );
    }

    res.status(201).json({ success: true, message: 'Transaksi berhasil dibuat', data: { id: result.insertId, trx_code } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id/status', authenticate, authorize('admin', 'pegawai'), [
  body('status').isIn(STATUSES).withMessage('Status tidak valid'),
], validate, async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.query('UPDATE transactions SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }

    await pool.query('INSERT INTO status_history (transaction_id, status, updated_by) VALUES (?, ?, ?)',
      [req.params.id, status, req.user.id]);

    const [trx] = await pool.query(
      'SELECT t.trx_code, c.user_id FROM transactions t JOIN customers c ON c.id = t.customer_id WHERE t.id = ?',
      [req.params.id]
    );
    if (trx[0]?.user_id) {
      const type = status === 'Selesai' ? 'laundry_selesai' : 'laundry_proses';
      const title = status === 'Selesai' ? 'Laundry Selesai!' : 'Status Diperbarui';
      const message = status === 'Selesai'
        ? `Pesanan ${trx[0].trx_code} sudah selesai dan siap diambil`
        : `Pesanan ${trx[0].trx_code} sekarang: ${status}`;
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type, transaction_id) VALUES (?, ?, ?, ?, ?)',
        [trx[0].user_id, title, message, type, req.params.id]
      );
    }

    res.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id/payment', authenticate, authorize('admin', 'kasir', 'pelanggan'), [
  body('payment_status').isIn(['belum', 'lunas']).withMessage('Status pembayaran tidak valid'),
  body('payment_method').optional(),
  body('payment_gateway').optional(),
], validate, async (req, res) => {
  try {
    const { payment_status, payment_method, payment_gateway } = req.body;
    const [result] = await pool.query(
      'UPDATE transactions SET payment_status = ?, payment_method = COALESCE(?, payment_method), payment_gateway = COALESCE(?, payment_gateway) WHERE id = ?',
      [payment_status, payment_method, payment_gateway, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }

    if (payment_status === 'lunas') {
      const [trx] = await pool.query(
        'SELECT t.trx_code, c.user_id FROM transactions t JOIN customers c ON c.id = t.customer_id WHERE t.id = ?',
        [req.params.id]
      );
      if (trx[0]?.user_id) {
        await pool.query(
          'INSERT INTO notifications (user_id, title, message, type, transaction_id) VALUES (?, ?, ?, ?, ?)',
          [trx[0].user_id, 'Pembayaran Berhasil', `Pembayaran ${payment_gateway ? 'via ' + payment_gateway : ''} untuk ${trx[0].trx_code} telah diterima`, 'pembayaran', req.params.id]
        );
      }
    }

    res.json({ success: true, message: 'Pembayaran berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'kasir'), async (req, res) => {
  try {
    const { discount, extra_fee, note, weight, item_count } = req.body;
    const [trx] = await pool.query('SELECT t.*, s.price, s.unit FROM transactions t JOIN services s ON s.id = t.service_id WHERE t.id = ?', [req.params.id]);
    if (trx.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }

    const t = trx[0];
    const w = weight ?? t.weight;
    const ic = item_count ?? t.item_count;
    const d = discount ?? t.discount;
    const ef = extra_fee ?? t.extra_fee;
    const multiplier = t.unit === 'kg' ? w : ic || 1;
    const subtotal = t.price * multiplier;
    const total = subtotal - d + ef;

    await pool.query(
      'UPDATE transactions SET weight=?, item_count=?, subtotal=?, discount=?, extra_fee=?, total=?, note=COALESCE(?, note) WHERE id=?',
      [w, ic, subtotal, d, ef, total, note, req.params.id]
    );
    res.json({ success: true, message: 'Transaksi berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }
    res.json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

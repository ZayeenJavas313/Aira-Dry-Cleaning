import { Router } from 'express';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { validate } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'kasir', 'pemilik'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT c.*, COUNT(t.id) as transaction_count
      FROM customers c
      LEFT JOIN transactions t ON t.customer_id = c.id
    `;
    const params = [];
    if (search) {
      query += ' WHERE c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    query += ' GROUP BY c.id ORDER BY c.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/', authenticate, authorize('admin', 'kasir'), [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('phone').notEmpty().withMessage('Nomor HP wajib diisi'),
  body('email').optional().isEmail().withMessage('Email tidak valid'),
  body('address').optional(),
], validate, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      [name, phone, email || null, address || null]
    );
    res.status(201).json({ success: true, message: 'Pelanggan berhasil ditambahkan', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'kasir'), [
  body('name').optional().notEmpty(),
  body('phone').optional().notEmpty(),
], validate, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const [result] = await pool.query(
      'UPDATE customers SET name = COALESCE(?, name), phone = COALESCE(?, phone), email = COALESCE(?, email), address = COALESCE(?, address) WHERE id = ?',
      [name, phone, email, address, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pelanggan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pelanggan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

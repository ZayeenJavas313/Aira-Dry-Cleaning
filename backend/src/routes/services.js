import { Router } from 'express';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { validate } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY category, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/', authenticate, authorize('admin'), [
  body('name').notEmpty().withMessage('Nama layanan wajib diisi'),
  body('price').isFloat({ min: 0 }).withMessage('Harga tidak valid'),
  body('unit').isIn(['kg', 'item', 'pasang']).withMessage('Unit tidak valid'),
  body('duration').notEmpty().withMessage('Estimasi wajib diisi'),
  body('category').notEmpty().withMessage('Kategori wajib diisi'),
], validate, async (req, res) => {
  try {
    const { name, price, unit, duration, category, is_active = true } = req.body;
    const [result] = await pool.query(
      'INSERT INTO services (name, price, unit, duration, category, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, unit, duration, category, is_active !== false]
    );
    res.status(201).json({ success: true, message: 'Layanan berhasil ditambahkan', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id', authenticate, authorize('admin'), [
  body('price').optional().isFloat({ min: 0 }).withMessage('Harga tidak valid'),
], validate, async (req, res) => {
  try {
    const { name, price, unit, duration, category, is_active } = req.body;
    const [result] = await pool.query(
      `UPDATE services SET
        name = COALESCE(?, name), price = COALESCE(?, price), unit = COALESCE(?, unit),
        duration = COALESCE(?, duration), category = COALESCE(?, category),
        is_active = COALESCE(?, is_active) WHERE id = ?`,
      [name, price, unit, duration, category, is_active, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Layanan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Layanan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

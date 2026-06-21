import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { validate } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'pemilik'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, is_active, created_at, updated_at FROM users ORDER BY role, name'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/', authenticate, authorize('admin'), [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').isIn(['admin', 'kasir', 'pegawai', 'pemilik', 'pelanggan']).withMessage('Role tidak valid'),
], validate, async (req, res) => {
  try {
    const { name, email, password, phone, role, address } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, address || null, role]
    );
    if (role === 'pelanggan') {
      await pool.query(
        'INSERT INTO customers (user_id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, name, phone || '-', email, address || null]
      );
    }
    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, role, is_active, address } = req.body;
    const [result] = await pool.query(
      `UPDATE users SET name=COALESCE(?,name), email=COALESCE(?,email), phone=COALESCE(?,phone),
       role=COALESCE(?,role), is_active=COALESCE(?,is_active), address=COALESCE(?,address) WHERE id=?`,
      [name, email, phone, role, is_active, address, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pengguna berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/:id/reset-password', authenticate, authorize('admin'), [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
], validate, async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }
    res.json({ success: true, message: 'Password berhasil direset' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun sendiri' });
    }
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }
    res.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

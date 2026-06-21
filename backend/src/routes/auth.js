import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { validate } from '../utils/helpers.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phone').optional(),
  body('address').optional(),
], validate, async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, address || null, 'pelanggan']
    );

    const [customerResult] = await pool.query(
      'INSERT INTO customers (user_id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [result.insertId, name, phone || '-', email, address || null]
    );

    const user = { id: result.insertId, name, email, role: 'pelanggan', customer_id: customerResult.insertId };
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { token, user: { id: user.id, name, email, role: 'pelanggan', phone, address } },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query(
      'SELECT u.*, c.id as customer_id FROM users u LEFT JOIN customers c ON c.user_id = u.id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password tidak sesuai' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Akun tidak aktif' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email atau password tidak sesuai' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          customer_id: user.customer_id,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.created_at, c.id as customer_id FROM users u LEFT JOIN customers c ON c.user_id = u.id WHERE u.id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }
    res.json({ success: true, data: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/profile', authenticate, [
  body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('phone').optional(),
  body('address').optional(),
], validate, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?',
      [name, phone, address, req.user.id]
    );

    if (req.user.role === 'pelanggan') {
      await pool.query(
        'UPDATE customers SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE user_id = ?',
        [name, phone, address, req.user.id]
      );
    }

    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/change-password', authenticate, [
  body('old_password').notEmpty().withMessage('Password lama wajib diisi'),
  body('new_password').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
], validate, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(old_password, users[0].password);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai' });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;

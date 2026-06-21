import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import serviceRoutes from './routes/services.js';
import transactionRoutes from './routes/transactions.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';
import pool from './config/db.js';
import { seedDatabase } from './seed.js';

if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

const allowedOrigins = [
  'http://localhost:5173', 'http://localhost:5174',
  'http://127.0.0.1:5173', 'http://127.0.0.1:5174',
  'http://localhost:3000',
];

if (process.env.VERCEL) {
  allowedOrigins.push('https://aira-laundry.vercel.app');
}

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ success: true, message: 'Aira Laundry API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

async function start() {
  try {
    const [svc] = await pool.query('SELECT COUNT(*) as count FROM services');
    if (Number(svc[0]?.count ?? 0) === 0) {
      console.log('🌱 Database empty, running seed...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Seed check failed:', err.message);
  }

  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🧺 Aira Laundry API running on http://localhost:${PORT}`);
    });
  }
}

start();

export default app;

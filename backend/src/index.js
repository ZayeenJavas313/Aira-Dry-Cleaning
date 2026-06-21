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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:3000'], credentials: true }));
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

app.listen(PORT, () => {
  console.log(`🧺 Aira Laundry API running on http://localhost:${PORT}`);
});

import { Router } from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { formatCurrency } from '../utils/helpers.js';

const router = Router();

function getDateFilter(period) {
  const now = new Date();
  switch (period) {
    case 'daily':
      return { from: now.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
    case 'weekly':
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return { from: weekAgo.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
    case 'monthly':
      return { from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`, to: now.toISOString().split('T')[0] };
    case 'yearly':
      return { from: `${now.getFullYear()}-01-01`, to: now.toISOString().split('T')[0] };
    default:
      return { from: null, to: null };
  }
}

async function fetchReportData(period) {
  const { from, to } = getDateFilter(period);
  let where = 'WHERE 1=1';
  const params = [];
  if (from) { where += ' AND DATE(t.created_at) >= ?'; params.push(from); }
  if (to) { where += ' AND DATE(t.created_at) <= ?'; params.push(to); }

  const [transactions] = await pool.query(`
    SELECT t.*, c.name as customer_name, s.name as service_name
    FROM transactions t
    JOIN customers c ON c.id = t.customer_id
    JOIN services s ON s.id = t.service_id
    ${where} ORDER BY t.created_at DESC
  `, params);

  const [[summary]] = await pool.query(`
    SELECT COUNT(*) as total_transactions,
      COALESCE(SUM(CASE WHEN payment_status = 'lunas' THEN total END), 0) as total_revenue,
      COUNT(DISTINCT customer_id) as unique_customers
    FROM transactions t ${where}
  `, params);

  const [serviceBreakdown] = await pool.query(`
    SELECT s.name, COUNT(t.id) as count, COALESCE(SUM(t.total), 0) as revenue
    FROM services s LEFT JOIN transactions t ON t.service_id = s.id ${where.replace('t.', 't.')}
    GROUP BY s.id ORDER BY count DESC
  `, params);

  return { transactions, summary, serviceBreakdown, period, from, to };
}

router.get('/summary', authenticate, authorize('admin', 'pemilik'), async (req, res) => {
  try {
    const data = await fetchReportData(req.query.period || 'weekly');
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/export/pdf', authenticate, authorize('admin', 'pemilik'), async (req, res) => {
  try {
    const data = await fetchReportData(req.query.period || 'weekly');
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-aira-laundry-${data.period}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Aira Laundry', { align: 'center' });
    doc.fontSize(12).text(`Laporan ${data.period} (${data.from} s/d ${data.to})`, { align: 'center' });
    doc.moveDown();
    doc.text(`Total Transaksi: ${data.summary.total_transactions}`);
    doc.text(`Total Pendapatan: ${formatCurrency(data.summary.total_revenue)}`);
    doc.text(`Pelanggan Unik: ${data.summary.unique_customers}`);
    doc.moveDown();
    doc.text('Detail Transaksi:', { underline: true });
    doc.moveDown(0.5);

    data.transactions.slice(0, 50).forEach(t => {
      doc.fontSize(9).text(`${t.trx_code} | ${t.customer_name} | ${t.service_name} | ${formatCurrency(t.total)} | ${t.status} | ${t.payment_status}`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal export PDF' });
  }
});

router.get('/export/excel', authenticate, authorize('admin', 'pemilik'), async (req, res) => {
  try {
    const data = await fetchReportData(req.query.period || 'weekly');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan Transaksi');

    sheet.columns = [
      { header: 'Kode TRX', key: 'trx_code', width: 15 },
      { header: 'Pelanggan', key: 'customer_name', width: 20 },
      { header: 'Layanan', key: 'service_name', width: 18 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Pembayaran', key: 'payment_status', width: 12 },
      { header: 'Tanggal', key: 'created_at', width: 18 },
    ];

    data.transactions.forEach(t => sheet.addRow({
      trx_code: t.trx_code,
      customer_name: t.customer_name,
      service_name: t.service_name,
      total: t.total,
      status: t.status,
      payment_status: t.payment_status,
      created_at: new Date(t.created_at).toLocaleDateString('id-ID'),
    }));

    const summarySheet = workbook.addWorksheet('Ringkasan');
    summarySheet.addRow(['Periode', data.period]);
    summarySheet.addRow(['Total Transaksi', data.summary.total_transactions]);
    summarySheet.addRow(['Total Pendapatan', data.summary.total_revenue]);
    summarySheet.addRow(['Pelanggan Unik', data.summary.unique_customers]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-aira-laundry-${data.period}.xlsx`);
    await workbook.xlsx.write(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal export Excel' });
  }
});

router.get('/receipt/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.name as customer_name, c.phone as customer_phone,
             s.name as service_name, s.unit as service_unit
      FROM transactions t
      JOIN customers c ON c.id = t.customer_id
      JOIN services s ON s.id = t.service_id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomor transaksi tidak ditemukan' });
    }

    const t = rows[0];
    const doc = new PDFDocument({ margin: 40, size: [226, 400] });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nota-${t.trx_code}.pdf`);
    doc.pipe(res);

    doc.fontSize(14).text('AIRA LAUNDRY', { align: 'center' });
    doc.fontSize(8).text('Sistem Informasi Manajemen Laundry', { align: 'center' });
    doc.moveDown();
    doc.fontSize(9).text(`No: ${t.trx_code}`);
    doc.text(`Tanggal: ${new Date(t.created_at).toLocaleString('id-ID')}`);
    doc.text(`Pelanggan: ${t.customer_name}`);
    doc.text(`HP: ${t.customer_phone}`);
    doc.moveDown();
    doc.text(`Layanan: ${t.service_name}`);
    if (t.weight > 0) doc.text(`Berat: ${t.weight} kg`);
    if (t.item_count > 0) doc.text(`Jumlah: ${t.item_count} item`);
    doc.text(`Subtotal: ${formatCurrency(t.subtotal)}`);
    if (t.discount > 0) doc.text(`Diskon: -${formatCurrency(t.discount)}`);
    if (t.extra_fee > 0) doc.text(`Biaya Tambahan: ${formatCurrency(t.extra_fee)}`);
    doc.fontSize(11).text(`TOTAL: ${formatCurrency(t.total)}`, { underline: true });
    doc.fontSize(9).text(`Status: ${t.status}`);
    doc.text(`Pembayaran: ${t.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}`);
    if (t.note) doc.text(`Catatan: ${t.note}`);
    doc.moveDown();
    doc.fontSize(8).text('Terima kasih telah menggunakan layanan Aira Laundry!', { align: 'center' });
    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal cetak nota' });
  }
});

export default router;

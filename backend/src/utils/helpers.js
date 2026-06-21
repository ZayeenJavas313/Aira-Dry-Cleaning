import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export async function generateTrxCode(pool) {
  const [rows] = await pool.query(
    "SELECT trx_code FROM transactions WHERE trx_code LIKE 'TRX-%' ORDER BY id DESC LIMIT 1"
  );
  let next = 1;
  if (rows.length > 0) {
    const last = parseInt(rows[0].trx_code.replace('TRX-', ''), 10);
    next = last + 1;
  }
  return `TRX-${String(next).padStart(3, '0')}`;
}

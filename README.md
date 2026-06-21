# Aira Laundry — Sistem Informasi Manajemen Layanan Laundry

Website manajemen laundry modern dengan RBAC (5 role), dashboard analitik, dan antarmuka responsif bertema pastel Statamic.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 4, Shadcn UI, Recharts, Lucide Icons |
| Backend | Node.js Express, JWT Authentication |
| Database | MySQL |
| Laporan | Export PDF (PDFKit), Export Excel (ExcelJS) |

## Fitur Utama

### 5 Role Pengguna (RBAC)
- **Pelanggan** — Registrasi, pesan laundry, pantau status, riwayat transaksi, notifikasi
- **Admin** — Manajemen penuh: pengguna, pelanggan, layanan, transaksi, laporan
- **Kasir** — Input transaksi, pembayaran tunai/transfer, cetak nota
- **Pegawai Laundry** — Update status pengerjaan (7 tahap)
- **Pemilik Usaha** — Dashboard bisnis, analitik, monitoring kinerja

### Status Laundry
`Diterima → Dicuci → Dikeringkan → Disetrika → Dikemas → Selesai → Diambil`

### Fitur Tambahan
- Dark Mode / Light Mode
- Notifikasi real-time (laundry diterima, proses, selesai, pembayaran)
- Pencarian & filter transaksi/pelanggan
- Validasi form
- Export PDF & Excel
- Cetak/unduh nota transaksi

## Instalasi

### Prasyarat
- Node.js 18+
- MySQL 8+

### 1. Clone & Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Setup Database

**Opsi A — SQLite (disarankan, tanpa setup MySQL):**

Database SQLite aktif secara default. Cukup jalankan seed:

```bash
cd backend
npm run seed
```

**Opsi B — MySQL/MariaDB:**

Set `DB_TYPE=mysql` di `backend/.env`, sesuaikan kredensial, lalu seed.

> **Error `auth_gssapi_client` di XAMPP?** MariaDB XAMPP sering memakai plugin autentikasi yang rusak. Solusi:
> 1. Tetap pakai SQLite (`DB_TYPE=sqlite`) — sudah cukup untuk development
> 2. Atau jalankan script perbaikan (sebagai Administrator):
>    ```powershell
>    cd backend
>    powershell -ExecutionPolicy Bypass -File .\scripts\fix-xampp-mysql.ps1
>    ```
> 3. Atau buat user MySQL baru via phpMyAdmin dengan plugin `mysql_native_password`

### 3. Jalankan Aplikasi

```bash
# Terminal 1 — Backend API (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Buka http://localhost:5173

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aira.com | password123 |
| Kasir | kasir@aira.com | password123 |
| Pegawai | pegawai@aira.com | password123 |
| Pemilik | pemilik@aira.com | password123 |
| Pelanggan | pelanggan@aira.com | password123 |

## Struktur Proyek

```
├── backend/
│   ├── database/schema.sql    # Skema MySQL
│   └── src/
│       ├── routes/            # API endpoints
│       ├── middleware/        # JWT auth & RBAC
│       └── seed.js            # Data demo
├── src/
│   ├── app/App.tsx            # Router & layout utama
│   ├── components/            # Layout, notifikasi, UI
│   ├── contexts/              # Auth context
│   ├── lib/                   # API client & types
│   └── pages/                 # Halaman per modul
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi pelanggan |
| POST | `/api/auth/login` | Login JWT |
| GET | `/api/dashboard` | Data dashboard per role |
| GET/POST | `/api/customers` | CRUD pelanggan |
| GET/POST | `/api/services` | CRUD layanan |
| GET/POST | `/api/transactions` | CRUD transaksi |
| PUT | `/api/transactions/:id/status` | Update status laundry |
| PUT | `/api/transactions/:id/payment` | Update pembayaran |
| GET | `/api/notifications` | Notifikasi pengguna |
| GET | `/api/reports/export/pdf` | Export laporan PDF |
| GET | `/api/reports/export/excel` | Export laporan Excel |
| GET | `/api/reports/receipt/:id` | Cetak nota transaksi |

## Lisensi

Proyek ini dibuat untuk keperluan Sistem Informasi Manajemen Layanan Laundry.

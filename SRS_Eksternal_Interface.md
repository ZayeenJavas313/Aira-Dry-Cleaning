# Spesifikasi Kebutuhan Antar Muka Eksternal (External Interface Requirements)
## Aira Dry Cleaning & Laundry — Sistem Informasi Manajemen Laundry

---

## 3. Kebutuhan Antarmuka Eksternal

### 3.1 Antarmuka Pengguna (User Interfaces)

Sistem menyediakan antarmuka berbasis web (web application) yang dibangun menggunakan React 18 dengan TypeScript, Vite 6 sebagai build tool, serta Tailwind CSS 4 dan Material-UI 7 sebagai framework desain. Antarmuka ini diakses melalui peramban web modern pada berbagai perangkat (desktop, tablet, dan ponsel).

#### 3.1.1 Halaman Publik (Landing Page)

| Elemen | Deskripsi |
|--------|-----------|
| **Hero Section** | Menampilkan tagline, deskripsi layanan, tombol CTA "Pesan Sekarang" yang terhubung ke WhatsApp, dan simulasi dashboard. Terdapat navigasi sticky di bagian atas. |
| **Customer Logos** | Menampilkan area/layanan yang dilayani (Demangan, Gondokusuman, dll.) dalam bentuk badge animasi. |
| **Control Panel Features** | Enam kartu layanan: Cuci Kiloan Harian (bestseller), Dry Cleaning Profesional, Cuci Satuan Premium, Detergen Ramah Lingkungan, Setrika & Lipat Rapi, Jaminan Kepuasan. Masing-masing memiliki ikon, deskripsi, dan badge. |
| **Scalability Section (Harga)** | Tampilan tab untuk dua kategori harga: Cuci Kiloan (Paket Kilat 1 Hari, Sedang 2 Hari, Hemat 3 Hari) dan Cuci Satuan (Sprei & Bed Cover, Selimut Tebal, Karpet, Sepatu). Masing-masing menampilkan ikon, deskripsi, dan rentang harga. |
| **Ecosystem Section** | Enam poin informasi: UMKM Asli Yogyakarta, Lokasi Strategis (dengan alamat lengkap), Kontak Ibu Aira, Layanan Kilat, Bahan Premium, Tanya Jawab. Masing-masing dengan ikon dan warna berbeda. |
| **Image Showcase Carousel** | Galeri gambar empat kategori: Sprei & Bedding, Perawatan Sepatu, Dry Cleaning Jas, Item Besar, dengan navigasi dot dan tombol panah. |
| **Testimonial** | Kartu testimoni pelanggan dengan avatar, nama, lokasi, rating bintang, dan kutipan. Dilengkapi tombol navigasi prev/next. |
| **Final CTA** | Bagian ajakan terakhir dengan latar gradien, tombol "Hubungi WhatsApp" yang menonjol. |
| **Footer** | Empat kolom: kolom logo + deskripsi perusahaan, navigasi Layanan, Informasi (dengan detail harga, lokasi, cara memesan, garansi), dan Kontak (WhatsApp, telepon, alamat). Copyright bar di bagian bawah. |

**Resolusi Layar yang Didukung:**
- Desktop: 1280px ke atas (layout 5 kolom)
- Tablet: 768px — 1279px (layout grid menyesuaikan)
- Mobile: 360px — 767px (layout single column, navigasi hamburger)

#### 3.1.2 Halaman Autentikasi

| Halaman | Elemen |
|---------|--------|
| **Login** | Form input email dan password, tombol "Masuk", link ke halaman registrasi, validasi client-side. |
| **Register** | Form input nama, email, password, konfirmasi password, nomor telepon (opsional), alamat (opsional), tombol "Daftar". |

#### 3.1.3 Halaman Dashboard (Akses Terotentikasi)

Dashboard utama setelah login. Konten bervariasi berdasarkan peran (role):

**Role Pelanggan:**
- Statistik: total transaksi, transaksi diproses, transaksi selesai, total pengeluaran
- Riwayat 5 transaksi terbaru

**Role Kasir:**
- Statistik: transaksi hari ini, pendapatan hari ini, transaksi belum dibayar, siap diambil
- Daftar pesanan siap ambil

**Role Pegawai:**
- Statistik: pesanan masuk, sedang diproses, selesai hari ini, siap diambil
- Semua pesanan aktif

**Role Admin & Pemilik:**
- Statistik: total pelanggan, total transaksi, total pegawai, pendapatan bulanan, dalam proses, selesai
- Grafik pendapatan 7 hari terakhir (menggunakan Recharts)
- 5 layanan terpopuler
- 6 transaksi terbaru

#### 3.1.4 Halaman Manajemen (CRUD)

| Halaman | Fitur |
|---------|-------|
| **Pelanggan** | Tabel daftar pelanggan dengan search, tambah, edit, hapus. Form dengan field nama, telepon, email, alamat. |
| **Layanan** | Tabel daftar layanan dengan harga per unit, durasi, kategori. Form dengan field nama, harga, unit (kg/item/pasang), durasi, kategori, status aktif. |
| **Transaksi** | Tabel transaksi dengan filter (status, pembayaran, tanggal, search). Buat transaksi baru (pilih pelanggan, layanan, berat/jumlah, diskon, biaya tambahan). Update status langkah demi langkah (Diterima → Dicuci → Dikeringkan → Disetrika → Dikemas → Selesai → Diambil). Update pembayaran (metode, status). Form lengkap dengan perhitungan otomatis subtotal dan total. |
| **Status Laundry** | Tampilan pipeline status untuk semua transaksi aktif. |
| **Pembayaran** | Manajemen pembayaran dengan filter status. |
| **Laporan** | Tampilan summary dengan filter periode (harian/mingguan/bulanan/tahunan). Tombol ekspor PDF dan Excel. |
| **Pengguna** | Manajemen pengguna (admin/pemilik saja). Tambah, edit, reset password, hapus pengguna. |
| **Profil** | Edit profil (nama, telepon, alamat). Ubah password (password lama, password baru). |

#### 3.1.5 Komponen UI Bersama

Seluruh antarmuka menggunakan komponen UI terstandarisasi dari library Radix UI dan shadcn/ui:

| Komponen | Penggunaan |
|----------|------------|
| Button, Input, Label | Form di seluruh halaman |
| Table | Tampilan data tabular (pelanggan, transaksi, layanan, dll.) |
| Card | Kartu statistik dashboard |
| Dialog | Form tambah/edit data (modal) |
| Sheet | Panel samping untuk detail |
| Select | Dropdown pilihan (role, unit, kategori, filter) |
| Tabs | Navigasi konten bertab (harga kiloan/satuan) |
| Tooltip | Informasi tambahan saat hover |
| Badge | Status transaksi dengan kode warna |
| Carousel | Galeri gambar showcase |
| Sidebar | Navigasi dashboard (sidebar + header) |
| Alert Dialog | Konfirmasi hapus data |
| Dropdown Menu | Menu aksi pada tabel |
| Toast/Sonner | Notifikasi aksi berhasil/gagal |
| Date Picker | Filter rentang tanggal laporan |
| Chart (Recharts) | Grafik pendapatan dashboard |

#### 3.1.6 Desain Responsif

Antarmuka menggunakan grid system Tailwind CSS yang responsif:
- `grid-cols-1` pada mobile
- `grid-cols-2` pada tablet kecil
- `md:grid-cols-3/4/5` pada desktop
- Sidebar dashboard otomatis collapse pada layar kecil
- Navigasi berubah menjadi hamburger menu pada mobile

#### 3.1.7 Aksesibilitas

- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<section>`)
- ARIA labels pada elemen interaktif
- Focus ring indikator keyboard navigation
- `sr-only` text untuk screen reader
- `alt` text pada gambar
- Warna kontras memadai (dark mode footer dengan teks terang)
- Label eksplisit pada semua form input

---

### 3.2 Antarmuka Perangkat Keras (Hardware Interfaces)

#### 3.2.1 Server

Sistem berjalan di atas perangkat server dengan spesifikasi minimum:

| Komponen | Spesifikasi Minimum |
|----------|---------------------|
| Prosesor | Single-core 2.0 GHz (development) / Dual-core 2.5 GHz (production) |
| RAM | 512 MB (development) / 2 GB (production) |
| Penyimpanan | 100 MB ruang kosong untuk aplikasi + database SQLite |
| Koneksi Jaringan | Koneksi internet stabil untuk akses HTTP |

Server dapat dijalankan di:
- **Lokal** (development): laptop/PC dengan Node.js 20+ terinstal
- **Cloud** (production): VPS, Railway, atau platform PaaS pendukung Node.js

#### 3.2.2 Perangkat Klien (Client)

Perangkat yang digunakan untuk mengakses aplikasi:

| Perangkat | Spesifikasi Minimum |
|-----------|---------------------|
| Desktop / Laptop | Prosesor dual-core 1.5 GHz, RAM 4 GB, layar 1366x768 |
| Tablet | Layar 7 inci ke atas, RAM 2 GB |
| Ponsel | Layar 4.7 inci ke atas, RAM 2 GB |

#### 3.2.3 Peramban Web yang Didukung

| Peramban | Versi Minimum |
|----------|---------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari (macOS/iOS) | 15+ |
| Opera | 76+ |

#### 3.2.4 Perangkat Cetak (Printer)

Sistem mendukung pencetakan struk/resi laundry melalui fungsionalitas **PDF generation** di sisi server:

| Fitur | Deskripsi |
|-------|-----------|
| **Resi/Receipt PDF** | Format PDF ukuran thermal (226×400 px) yang dihasilkan oleh library PDFKit |
| **Laporan PDF** | Laporan periodik dengan kop, tabel, ringkasan, dan total pendapatan |
| **Laporan Excel** | File `.xlsx` dengan dua sheet: rekap transaksi + summary |
| **Mekanisme** | Server menghasilkan file PDF/Excel di memori → dikirim sebagai response HTTP → browser mendownload → pengguna mencetak ke printer fisik |

Printer yang digunakan untuk mencetak harus mendukung format PDF standar (printer inkjet/laser umum).

---

### 3.3 Antarmuka Perangkat Lunak (Software Interfaces)

#### 3.3.1 Basis Data

Sistem menggunakan dua mode database yang dapat dikonfigurasi:

| Mode Database | Driver / Library | Koneksi |
|---------------|------------------|---------|
| **SQLite** (default) | `better-sqlite3` v11 | Koneksi langsung ke file lokal (`./data/aira_laundry.db`) via `require()`. Synchronous native binding. Cepat untuk penggunaan tunggal. |
| **MySQL** | `mysql2` v3 | Koneksi TCP ke server MySQL (`localhost:3306`) menggunakan connection pool. Pool dengan konfigurasi: `connectionLimit: 10`, `queueLimit: 0`. |

**Skema Database (SQLite — auto-migrate saat startup):**

| Tabel | Fungsi |
|-------|--------|
| `users` | Data pengguna (id, name, email, password_hash, phone, address, role, is_active, timestamps) |
| `customers` | Data pelanggan (id, user_id, name, phone, email, address, timestamps) |
| `services` | Data layanan (id, name, price, unit, duration, category, is_active) |
| `transactions` | Data transaksi (id, trx_code, customer_id, service_id, weight, item_count, subtotal, discount, extra_fee, total, status, payment_status, payment_method, payment_gateway, note, created_by, timestamps) |
| `status_history` | Riwayat status transaksi (id, transaction_id, status, updated_by, created_at) |
| `notifications` | Notifikasi pengguna (id, user_id, title, message, type, transaction_id, is_read, created_at) |
| `customers_view` | View query performa (opsional / MySQL-specific) |

#### 3.3.2 Runtime

| Komponen | Versi | Fungsi |
|----------|-------|--------|
| **Node.js** | 20+ (LTS) | Runtime JavaScript sisi server untuk Express.js |
| **npm** | 10+ | Package manager untuk instalasi dependensi |

#### 3.3.3 Library Backend

| Library | Versi | Fungsi |
|---------|-------|--------|
| `express` | 4.21 | Framework web HTTP untuk REST API |
| `cors` | 2.8 | Middleware CORS untuk keamanan lintas domain |
| `dotenv` | 16.4 | Load konfigurasi dari file `.env` |
| `bcryptjs` | 2.4 | Hashing password (salt rounds: 10) |
| `jsonwebtoken` | 9.0 | Generate/verify JWT token untuk autentikasi |
| `express-validator` | 7.2 | Validasi input request body |
| `better-sqlite3` | 11.10 | Driver SQLite (synchronous, native) |
| `mysql2` | 3.12 | Driver MySQL (async, pool-based) |
| `pdfkit` | 0.16 | Generate PDF (resi, laporan) |
| `exceljs` | 4.4 | Generate file Excel (.xlsx) |

#### 3.3.4 Library Frontend

| Library | Versi | Fungsi |
|---------|-------|--------|
| `react` | 18.3 | Library UI komponen |
| `react-dom` | 18.3 | Render React ke DOM |
| `react-router` | 7.13 | Routing SPA client-side |
| `@mui/material` | 7.3 | Komponen UI Material Design (icons, styled) |
| `tailwindcss` | 4.1 | Utility CSS framework untuk styling |
| `@radix-ui/*` | ~1.2 | Komponen UI primitif headless (dialog, select, tabs, dll.) |
| `lucide-react` | 0.487 | Ikon vector |
| `motion` | 12.23 | Animasi dan transisi UI |
| `recharts` | 2.15 | Grafik dan chart dashboard |
| `date-fns` | 3.6 | Manipulasi tanggal |
| `react-hook-form` | 7.55 | Manajemen form |
| `sonner` | 2.0 | Toast notifications |
| `embla-carousel-react` | 8.6 | Carousel komponen |
| `class-variance-authority` | 0.7 | Variasi kelas utilitas |
| `clsx` / `tailwind-merge` | ~2.1 / ~3.2 | Utility class management |
| `cmdk` | 1.1 | Command menu |
| `vaul` | 1.1 | Drawer komponen |

#### 3.3.5 Build Tools

| Alat | Versi | Fungsi |
|------|-------|--------|
| `vite` | 6.3 | Build tool dan dev server (HMR) |
| `@vitejs/plugin-react` | 4.7 | Plugin Vite untuk React (Fast Refresh) |
| `@tailwindcss/vite` | 4.1 | Plugin Vite untuk Tailwind CSS |
| `typescript` | ~5.x | Type checking dan kompilasi TypeScript |

#### 3.3.6 Antarmuka dengan Sistem Eksternal

| Sistem Eksternal | Interface | Deskripsi |
|------------------|-----------|-----------|
| **WhatsApp API** | URL `https://wa.me/6285743999911` | Link navigasi (deep link) untuk menghubungi nomor WhatsApp. Dibuka di tab baru dengan `target="_blank"`. |
| **Telepon** | `tel:085743999911` | Protokol `tel:` untuk melakukan panggilan telepon langsung dari perangkat mobile. |
| **Google Maps** | Link ke peta lokasi (iframe/deep link) | Menampilkan alamat workshop di Jl. Bimo Kurdo No. 10, Demangan, Yogyakarta. |

---

### 3.4 Antarmuka Komunikasi (Communication Interfaces)

#### 3.4.1 Protokol HTTP/HTTPS

Seluruh komunikasi antara frontend dan backend dilakukan melalui protokol **HTTP/1.1** (dan mendukung **HTTP/2** pada production):

| Aspek | Spesifikasi |
|-------|-------------|
| **Protokol** | HTTP/HTTPS (RESTful API) |
| **Format Data** | JSON (Content-Type: `application/json`) |
| **Encoding** | UTF-8 |
| **Metode HTTP** | GET, POST, PUT, DELETE |
| **Struktur URL** | `{base_url}/api/{resource}[/{id}][?params]` |
| **Base URL (dev)** | `http://localhost:3001/api` |
| **Base URL (production)** | Tergantung deployment (Vercel/Railway) |

#### 3.4.2 REST API Endpoint

**Kategori Endpoint:**

| Grup | Prefix | Metode | Autentikasi |
|------|--------|--------|-------------|
| Health Check | `GET /api/health` | GET | Tidak |
| Autentikasi | `/api/auth/*` | POST, GET, PUT | Bervariasi |
| Dashboard | `/api/dashboard` | GET | JWT Token |
| Pelanggan | `/api/customers/*` | GET, POST, PUT, DELETE | JWT Token + Role |
| Layanan | `/api/services/*` | GET, POST, PUT, DELETE | JWT Token + Role |
| Transaksi | `/api/transactions/*` | GET, POST, PUT, DELETE | JWT Token + Role |
| Pengguna | `/api/users/*` | GET, POST, PUT, DELETE | JWT Token + Role |
| Notifikasi | `/api/notifications/*` | GET, PUT | JWT Token |
| Laporan | `/api/reports/*` | GET | JWT Token + Role |

**Daftar Lengkap Endpoint REST API:**

| Method | Endpoint | Deskripsi | Autentikasi | Role |
|--------|----------|-----------|-------------|------|
| GET | `/api/health` | Cek status server | — | — |
| POST | `/api/auth/register` | Registrasi pengguna baru | — | — |
| POST | `/api/auth/login` | Login pengguna | — | — |
| GET | `/api/auth/me` | Ambil data user saat ini | JWT | Semua |
| PUT | `/api/auth/profile` | Update profil | JWT | Semua |
| PUT | `/api/auth/change-password` | Ubah password | JWT | Semua |
| GET | `/api/dashboard` | Statistik dashboard | JWT | Semua (berbeda per role) |
| GET | `/api/customers` | Daftar pelanggan | JWT | admin, kasir, pemilik |
| GET | `/api/customers/:id` | Detail pelanggan | JWT | Semua |
| POST | `/api/customers` | Tambah pelanggan | JWT | admin, kasir |
| PUT | `/api/customers/:id` | Edit pelanggan | JWT | admin, kasir |
| DELETE | `/api/customers/:id` | Hapus pelanggan | JWT | admin |
| GET | `/api/services` | Daftar layanan | JWT | Semua |
| POST | `/api/services` | Tambah layanan | JWT | admin |
| PUT | `/api/services/:id` | Edit layanan | JWT | admin |
| DELETE | `/api/services/:id` | Hapus layanan | JWT | admin |
| GET | `/api/transactions` | Daftar transaksi | JWT | Semua |
| GET | `/api/transactions/:id` | Detail transaksi | JWT | Semua |
| POST | `/api/transactions` | Buat transaksi | JWT | admin, kasir, pelanggan |
| PUT | `/api/transactions/:id` | Edit transaksi | JWT | admin, kasir |
| PUT | `/api/transactions/:id/status` | Update status laundry | JWT | admin, pegawai |
| PUT | `/api/transactions/:id/payment` | Update pembayaran | JWT | admin, kasir, pelanggan |
| DELETE | `/api/transactions/:id` | Hapus transaksi | JWT | admin |
| GET | `/api/users` | Daftar pengguna | JWT | admin, pemilik |
| POST | `/api/users` | Tambah pengguna | JWT | admin |
| PUT | `/api/users/:id` | Edit pengguna | JWT | admin |
| PUT | `/api/users/:id/reset-password` | Reset password | JWT | admin |
| DELETE | `/api/users/:id` | Hapus pengguna | JWT | admin |
| GET | `/api/notifications` | Daftar notifikasi | JWT | Semua |
| GET | `/api/notifications/unread-count` | Jumlah notifikasi belum dibaca | JWT | Semua |
| PUT | `/api/notifications/:id/read` | Tandai sudah dibaca | JWT | Semua |
| PUT | `/api/notifications/read-all` | Tandai semua sudah dibaca | JWT | Semua |
| GET | `/api/reports/summary` | Summary laporan | JWT | admin, pemilik |
| GET | `/api/reports/export/pdf` | Ekspor PDF | JWT | admin, pemilik |
| GET | `/api/reports/export/excel` | Ekspor Excel | JWT | admin, pemilik |
| GET | `/api/reports/receipt/:id` | Cetak resi | JWT | Semua |

#### 3.4.3 Autentikasi dan Keamanan

| Aspek | Implementasi |
|-------|--------------|
| **Mekanisme** | JSON Web Token (JWT) |
| **Header** | `Authorization: Bearer {token}` |
| **Token Storage (Client)** | `localStorage` dengan key `aira_token` |
| **Algoritma** | HS256 (HMAC-SHA256) |
| **Expiry** | 7 hari (dikonfigurasi via `JWT_EXPIRES_IN`) |
| **Secret** | Dikonfigurasi via environment variable `JWT_SECRET` |

**Alur Autentikasi:**
1. User mengirim kredensial (email + password) ke `POST /api/auth/login`
2. Server memverifikasi bcrypt hash, menghasilkan JWT token, mengembalikan ke client
3. Client menyimpan token di `localStorage`
4. Setiap request berikutnya menyertakan token di header `Authorization`
5. Middleware `authenticate` memverifikasi token di setiap endpoint yang diproteksi
6. Middleware `authorize` memeriksa role user untuk endpoint tertentu

#### 3.4.4 Middleware

| Middleware | Fungsi | Lokasi File |
|------------|--------|-------------|
| `cors()` | Mengizinkan origin tertentu (localhost:5173, localhost:5174, dll.) dengan `credentials: true` | `backend/src/index.js` |
| `express.json()` | Parse JSON body request | `backend/src/index.js` |
| `authenticate` | Verifikasi JWT token dari header Authorization | `backend/src/middleware/auth.js` |
| `authorize(...roles)` | Cek apakah role user termasuk dalam daftar yang diizinkan | `backend/src/middleware/auth.js` |
| `validate` | Eksekusi hasil validasi `express-validator` | `backend/src/utils/helpers.js` |
| Error handler | Tangkap error 500, kirim response JSON | `backend/src/index.js` |

#### 3.4.5 CORS Configuration

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 'http://localhost:5174',
    'http://127.0.0.1:5173', 'http://127.0.0.1:5174',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

#### 3.4.6 Proxy Development (Vite)

Pada mode development, Vite dev server berjalan di port 5173 dan mengalihkan request `/api/*` ke backend di port 3001:

```typescript
// vite.config.ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

#### 3.4.7 Format Response API

**Response Sukses:**
```json
{
  "success": true,
  "message": "Pesan sukses (opsional)",
  "data": { ... }
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": [ ... ]
}
```

#### 3.4.8 Validasi Input

Semua endpoint yang menerima input dari client menggunakan `express-validator` untuk validasi sisi server:

| Validasi | Contoh |
|----------|--------|
| Required field | `body('name').notEmpty()` |
| Format email | `body('email').isEmail()` |
| Panjang minimal | `body('password').isLength({ min: 6 })` |
| Rentang numerik | `body('price').isFloat({ min: 0 })` |
| Enum value | `body('unit').isIn(['kg', 'item', 'pasang'])` |
| Optional | `body('address').optional()` |

#### 3.4.9 Komunikasi Database

| Mode | Koneksi | Query |
|------|---------|-------|
| **SQLite** (default) | Synchronous via `better-sqlite3` `db.prepare(sql).run()` / `.all()` / `.get()` | Query langsung tanpa pool. Auto-migrate tabel saat startup. |
| **MySQL** | Asynchronous via `mysql2` `pool.query(sql, params)` → Promise | Pool connection dengan limit 10 koneksi. Parameterized query untuk keamanan SQL injection. |

#### 3.4.10 Deployment

| Platform | File Konfigurasi | Catatan |
|----------|-----------------|---------|
| **Vercel** | `vercel.json` | Frontend SPA di-deploy ke Vercel. Backend dapat di-deploy terpisah ke PaaS lain (Railway, Render, dll.) atau tetap di VPS. |
| **Backend** | — | Express.js server dijalankan dengan `node src/index.js`. Port dikonfigurasi via env `PORT` (default 3001). |

#### 3.4.11 Diagram Alur Komunikasi

```
[Browser Client]
     │
     ├── Vite Dev Server (port 5173) ──proxy──→ Express API (port 3001)
     │                                            │
     │    (development)                           ├── SQLite (file: ./data/*.db)
     │                                            └── MySQL (localhost:3306) [opsional]
     │
     ├── Production (Vercel) ───HTTP──→ Express API (Railway/VPS)
     │                                            │
     │    (production)                            ├── SQLite (file: ./data/*.db)
     │                                            └── MySQL (managed cloud) [opsional]
     │
     ├── WhatsApp (deep link) ───→ wa.me
     ├── Telepon (deep link) ───→ tel:
     └── Download PDF/Excel ←── Response Blob (application/pdf, application/vnd.openxmlformats)
```

---

*Dokumen ini disusun sebagai bagian dari Laporan Projek Akhir — Sistem Informasi Manajemen Aira Dry Cleaning & Laundry.*

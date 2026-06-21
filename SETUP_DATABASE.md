# Setup Database Permanen & Environment Variables Vercel

## 1. Buat Database MySQL di Railway (Gratis)

1. Buka https://railway.app → **Sign up with GitHub**
2. Klik **New Project** → Pilih **Provision MySQL**
3. Tunggu ~1 menit sampai MySQL siap (status `Deployed`)
4. Klik service MySQL → tab **Connect**
5. Railway otomatis menyediakan env vars. Salin nilai berikut:
   - `MYSQL_HOST` → (hostname, misal `containers-us-west-xxx.railway.app`)
   - `MYSQL_PORT` → (biasanya `3306` atau port random seperti `7654`)
   - `MYSQL_USER` → (biasanya `root`)
   - `MYSQL_PASSWORD` → (password acak)
   - `MYSQL_DATABASE` → (biasanya `railway`)

> **Note**: Railway MySQL bisa diakses dari luar. Port-nya mungkin random, pakai nilai yang diberikan Railway.

---

## 2. Set Environment Variables di Vercel

1. Buka https://vercel.com → pilih project **Aira Laundry**
2. Masuk ke **Settings** → **Environment Variables**
3. Tambahkan variable berikut:

| Name | Value |
|------|-------|
| `DB_TYPE` | `mysql` |
| `DB_HOST` | (isi dari `MYSQL_HOST` Railway) |
| `DB_PORT` | (isi dari `MYSQL_PORT` Railway, biasanya `3306`) |
| `DB_USER` | (isi dari `MYSQL_USER` Railway, biasanya `root`) |
| `DB_PASSWORD` | (isi dari `MYSQL_PASSWORD` Railway) |
| `DB_NAME` | (isi dari `MYSQL_DATABASE` Railway, biasanya `railway`) |
| `JWT_SECRET` | (buat string acak, misal `aira-secret-2024`) |
| `JWT_EXPIRES_IN` | `7d` |

4. Pilih environment **Production** saat menambahkan
5. Klik **Save**

---

## 3. Redeploy ke Vercel

1. Buka tab **Deployments**
2. Klik **Redeploy** pada deployment terakhir
   (Atau trigger deployment baru dengan push ke GitHub)
3. Tunggu sampai selesai (~2-3 menit)
4. Buka URL Vercel dan coba login:
   - Email: `admin@aira.com`
   - Password: `password123`

> **Auto-seed**: Saat pertama kali jalan, backend otomatis mendeteksi database kosong dan menjalankan seed data (user + layanan + sample transaksi).

---

## 4. Verifikasi

Cek endpoint health:
```
https://[project-name].vercel.app/api/health
```
Response: `{"success":true,"message":"Aira Laundry API is running"}`

---

## Troubleshooting

**Error "connect ECONNREFUSED"**
- Pastikan Railway MySQL sudah deployed (status hijau)
- Cek port di Railway, mungkin bukan 3306
- Railway MySQL mungkin perlu public networking diaktifkan

**Error "ER_ACCESS_DENIED"**
- Cek username dan password di Vercel env vars
- Railway MySQL kadang generate user random, bukan root

**Error "Unknown database"**
- Cek `DB_NAME` — Railway biasanya pakai `railway`
- Buat database manual jika perlu

# Setup Database Permanen & Environment Variables Vercel

## 1. Buat Database MySQL Serverless di TiDB (Gratis)

1. Buka https://tidbcloud.com → **Sign up** (bisa pakai GitHub/Google)
2. Setelah login, klik **Create Cluster** → pilih **Serverless Tier** (Free)
3. Pilih region terdekat (misal `Singapore` atau `Tokyo`)
4. Klik **Create** → tunggu ~3 menit sampai cluster aktif
5. Setelah aktif, klik **Connect** → pilih **Connect with General Network**
6. Klik **Create password** → simpaan password yang muncul
7. Dapatkan connection details:
   - **Host**: `gateway01.xxx.shared.tidbcloud.com`
   - **Port**: `4000`
   - **Username**: `xxx.root`
   - **Password**: (password yang dibuat)
   - **Database**: `test` (bisa dibuat sendiri)

> **Kenapa TiDB?** MySQL-compatible (zero code change), serverless, free tier 5GB, tanpa kartu kredit.

---

## 2. Set Environment Variables di Vercel

1. Buka https://vercel.com → pilih project **Aira Laundry**
2. Masuk ke **Settings** → **Environment Variables**
3. Tambahkan variable berikut (pilih environment **Production**):

| Name | Value |
|------|-------|
| `DB_TYPE` | `mysql` |
| `DB_HOST` | (host dari TiDB, misal `gateway01.xxx.shared.tidbcloud.com`) |
| `DB_PORT` | `4000` |
| `DB_USER` | (username dari TiDB, misal `xxx.root`) |
| `DB_PASSWORD` | (password dari TiDB) |
| `DB_NAME` | `test` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | (string acak, misal `aira-secret-2024-xyz`) |
| `JWT_EXPIRES_IN` | `7d` |

4. Klik **Save**

---

## 3. Redeploy ke Vercel

1. Buka tab **Deployments**
2. Klik **Redeploy** pada deployment terakhir
3. Tunggu sampai selesai (~2-3 menit)
4. Buka URL Vercel dan coba login:
   - Email: `admin@aira.com`
   - Password: `password123`

> **Auto-seed**: Saat pertama kali jalan, backend otomatis seed data jika database kosong.

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
- Pastikan cluster TiDB sudah aktif (tunggu hingga status **Ready**)
- Cek host dan port (TiDB pakai port `4000`, bukan 3306)

**Error "ER_ACCESS_DENIED"**
- Cek username dan password — TiDB username format `xxx.root`
- Password hanya ditampilkan sekali saat create, reset jika lupa

**Error "SSL required"**
- Pastikan `DB_SSL=true` sudah di Vercel env vars
- TiDB Serverless WAJIB koneksi SSL

**Error "Unknown database"**
- Database default TiDB adalah `test`
- Bisa buat database baru via TiDB Web Console

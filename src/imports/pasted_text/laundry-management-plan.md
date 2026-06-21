# Prompt Pengembangan Website Sistem Informasi Manajemen Layanan Laundry Aira Laundry

Bantu saya membangun sebuah Website Sistem Informasi Manajemen Layanan Laundry bernama **Aira Laundry** menggunakan teknologi web modern dengan desain profesional, responsif, dan mudah digunakan.

## Deskripsi Sistem

Sistem ini digunakan untuk mengelola seluruh aktivitas operasional laundry mulai dari pelanggan melakukan pemesanan hingga proses pelaporan usaha. Sistem harus memiliki tampilan modern, bersih, user-friendly, dan dapat diakses melalui desktop, tablet, maupun smartphone.

Website menggunakan konsep **Role-Based Access Control (RBAC)** dengan 5 jenis pengguna:

1. Pelanggan
2. Admin
3. Kasir
4. Pegawai Laundry
5. Pemilik Usaha

Setiap pengguna memiliki hak akses berbeda sesuai tugas dan tanggung jawabnya.

---

# 1. Antarmuka Pelanggan

Antarmuka pelanggan digunakan untuk memudahkan pelanggan dalam melakukan pemesanan dan memantau status laundry secara mandiri.

### Fitur Pelanggan

* Registrasi akun
* Login dan logout
* Dashboard pelanggan
* Melihat profil pelanggan
* Mengubah data profil
* Melihat daftar layanan laundry
* Membuat pesanan laundry
* Melihat riwayat transaksi
* Melihat status pengerjaan laundry secara real-time
* Melihat detail transaksi
* Melihat informasi pembayaran
* Mengunduh atau mencetak nota transaksi
* Notifikasi ketika laundry selesai
* Fitur pencarian transaksi

### Dashboard Pelanggan

Tampilkan:

* Jumlah transaksi
* Laundry yang sedang diproses
* Laundry yang selesai
* Total pengeluaran pelanggan
* Status laundry terbaru

---

# 2. Antarmuka Admin

Antarmuka admin digunakan untuk mengelola seluruh data utama dalam sistem.

### Hak Akses Admin

Admin memiliki akses penuh terhadap seluruh modul sistem.

### Fitur Admin

#### Manajemen Pengguna

* Tambah pengguna
* Edit pengguna
* Hapus pengguna
* Reset password
* Kelola role pengguna

#### Manajemen Pelanggan

* Tambah pelanggan
* Edit pelanggan
* Hapus pelanggan
* Cari pelanggan

#### Manajemen Layanan Laundry

* Tambah layanan
* Edit layanan
* Hapus layanan
* Atur harga layanan
* Atur estimasi pengerjaan

#### Manajemen Transaksi

* Melihat seluruh transaksi
* Edit transaksi
* Hapus transaksi
* Detail transaksi

#### Manajemen Laporan

* Laporan harian
* Laporan mingguan
* Laporan bulanan
* Laporan tahunan
* Export PDF
* Export Excel

### Dashboard Admin

Tampilkan statistik:

* Total pelanggan
* Total transaksi
* Total pegawai
* Total pendapatan
* Laundry sedang diproses
* Laundry selesai
* Grafik transaksi
* Grafik pendapatan

---

# 3. Antarmuka Kasir

Antarmuka kasir digunakan untuk mendukung proses transaksi layanan laundry.

### Fitur Kasir

* Input transaksi baru
* Pilih pelanggan
* Tambah pelanggan baru
* Pilih layanan laundry
* Input berat cucian (kg)
* Input jumlah item
* Perhitungan otomatis total biaya
* Input diskon
* Input biaya tambahan
* Status pembayaran
* Pembayaran tunai
* Pembayaran transfer
* Cetak nota
* Kirim nota digital

### Dashboard Kasir

Menampilkan:

* Jumlah transaksi hari ini
* Pendapatan hari ini
* Transaksi belum lunas
* Laundry siap diambil

---

# 4. Antarmuka Pegawai Laundry

Antarmuka pegawai digunakan untuk mengelola proses pengerjaan laundry.

### Fitur Pegawai

* Melihat daftar pesanan
* Melihat detail pesanan
* Mengubah status pengerjaan
* Melihat jadwal pekerjaan
* Melihat catatan khusus pelanggan

### Tahapan Status Laundry

1. Diterima
2. Dicuci
3. Dikeringkan
4. Disetrika
5. Dikemas
6. Selesai
7. Diambil

### Dashboard Pegawai

Menampilkan:

* Jumlah laundry masuk
* Laundry sedang dikerjakan
* Laundry selesai
* Laundry siap diambil

---

# 5. Antarmuka Pemilik Usaha

Antarmuka pemilik digunakan untuk memantau perkembangan bisnis laundry.

### Fitur Pemilik

* Dashboard bisnis
* Monitoring transaksi
* Monitoring pendapatan
* Monitoring pelanggan
* Monitoring layanan terlaris
* Monitoring kinerja pegawai
* Laporan operasional

### Dashboard Pemilik

Tampilkan:

#### Ringkasan Bisnis

* Total pendapatan
* Total transaksi
* Total pelanggan
* Total pegawai

#### Grafik Analitik

* Grafik pendapatan harian
* Grafik pendapatan bulanan
* Grafik transaksi
* Grafik layanan terlaris
* Grafik pertumbuhan pelanggan

#### Laporan

* Laporan transaksi
* Laporan pendapatan
* Laporan pelanggan
* Laporan layanan
* Export PDF
* Export Excel

---

# Struktur Menu Sistem

## Menu Utama

* Dashboard
* Pelanggan
* Layanan Laundry
* Transaksi
* Status Laundry
* Pembayaran
* Laporan
* Pengguna
* Pengaturan Akun

---

# Fitur Tambahan

### Notifikasi

* Laundry diterima
* Laundry sedang diproses
* Laundry selesai
* Pembayaran berhasil

### Pencarian dan Filter

* Cari pelanggan
* Cari transaksi
* Filter tanggal
* Filter status
* Filter layanan

### Validasi Form

Sistem harus menampilkan pesan validasi ketika terjadi kesalahan input seperti:

* Data pelanggan belum lengkap
* Nomor transaksi tidak ditemukan
* Email sudah digunakan
* Password tidak sesuai
* Berat cucian tidak boleh kosong
* Harga tidak valid
* Kolom wajib belum diisi

---

# Desain UI/UX

Gunakan desain modern dan profesional dengan: [Statamic — the answer to your frustrating CMS problems.](https://statamic.com/)

* Tema warna pastel seperti web statamic
* Layout dashboard modern
* Sidebar navigation
* Top navbar
* Card statistik
* Data table interaktif
* Grafik menggunakan Chart.js
* Ikon menggunakan Lucide atau Font Awesome
* Responsive Mobile First Design
* Dark Mode dan Light Mode

---

# Teknologi yang Digunakan

Frontend:

* React.js / Next.js
* Tailwind CSS
* Shadcn UI

Backend:

* Laravel atau Node.js Express

Database:

* MySQL

Authentication:

* JWT Authentication

Laporan:

* Export PDF
* Export Excel

---

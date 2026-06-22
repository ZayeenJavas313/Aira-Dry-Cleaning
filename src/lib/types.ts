export type Role = 'pelanggan' | 'admin' | 'kasir' | 'pegawai' | 'pemilik';

export type Page =
  | 'dashboard' | 'pelanggan' | 'layanan' | 'transaksi'
  | 'status' | 'pembayaran' | 'laporan' | 'pengguna' | 'profil'
  | 'pesan';

export type LaundryStatus =
  | 'Diterima' | 'Dicuci' | 'Dikeringkan' | 'Disetrika'
  | 'Dikemas' | 'Selesai' | 'Diambil';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  customer_id?: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  transaction_count?: number;
  joined_at?: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  unit: 'kg' | 'item' | 'pasang';
  duration: string;
  category: string;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  trx_code: string;
  customer_id: number;
  customer_name?: string;
  customer_phone?: string;
  service_id: number;
  service_name?: string;
  service_unit?: string;
  weight: number;
  item_count: number;
  subtotal: number;
  discount: number;
  extra_fee: number;
  total: number;
  status: LaundryStatus;
  payment_status: 'belum' | 'lunas';
  payment_method?: string;
  payment_gateway?: string;
  note?: string;
  created_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const STATUSES: LaundryStatus[] = [
  'Diterima', 'Dicuci', 'Dikeringkan', 'Disetrika', 'Dikemas', 'Selesai', 'Diambil',
];

export const ROLE_LABELS: Record<Role, string> = {
  pelanggan: 'Pelanggan',
  admin: 'Administrator',
  kasir: 'Kasir',
  pegawai: 'Pegawai Laundry',
  pemilik: 'Pemilik Usaha',
};

export const ROLE_BG: Record<Role, string> = {
  pelanggan: 'bg-blue-400',
  admin: 'bg-rose-400',
  kasir: 'bg-emerald-400',
  pegawai: 'bg-amber-400',
  pemilik: 'bg-violet-400',
};

export const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  pelanggan: 'Manajemen Pelanggan',
  layanan: 'Layanan Laundry',
  transaksi: 'Manajemen Transaksi',
  status: 'Status Laundry',
  pembayaran: 'Pembayaran',
  laporan: 'Laporan & Analitik',
  pengguna: 'Manajemen Pengguna',
  profil: 'Profil Saya',
  pesan: 'Pesan Laundry',
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: LaundryStatus) {
  const colors: Record<LaundryStatus, string> = {
    Diterima: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    Dicuci: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    Dikeringkan: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    Disetrika: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    Dikemas: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    Selesai: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    Diambil: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[status];
}

export function getNavItems(role: Role) {
  const all = [
    { id: 'dashboard' as Page, label: 'Dashboard' },
    { id: 'pesan' as Page, label: 'Pesan Laundry' },
    { id: 'pelanggan' as Page, label: 'Pelanggan' },
    { id: 'layanan' as Page, label: 'Layanan' },
    { id: 'transaksi' as Page, label: 'Transaksi' },
    { id: 'status' as Page, label: 'Status Laundry' },
    { id: 'pembayaran' as Page, label: 'Pembayaran' },
    { id: 'laporan' as Page, label: 'Laporan' },
    { id: 'pengguna' as Page, label: 'Pengguna' },
    { id: 'profil' as Page, label: 'Profil Saya' },
  ];
  const access: Record<Role, Page[]> = {
    pelanggan: ['dashboard', 'pesan', 'transaksi', 'status', 'pembayaran', 'profil'],
    admin: ['dashboard', 'pelanggan', 'layanan', 'transaksi', 'status', 'pembayaran', 'laporan', 'pengguna', 'profil'],
    kasir: ['dashboard', 'pelanggan', 'transaksi', 'status', 'pembayaran', 'profil'],
    pegawai: ['dashboard', 'transaksi', 'status', 'profil'],
    pemilik: ['dashboard', 'laporan', 'transaksi', 'status', 'pelanggan', 'layanan', 'pengguna', 'profil'],
  };
  return all.filter(item => access[role].includes(item.id));
}

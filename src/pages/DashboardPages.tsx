import { useState, useEffect, useMemo } from 'react';
import {
  Users, Receipt, DollarSign, UserCheck, Package, Clock, CheckCircle,
  Truck, AlertCircle, Plus, Printer, TrendingUp, Star, Shirt,
  Search, Eye, Edit2, Trash2, Download, ShoppingCart,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import {
  formatCurrency, getStatusColor, STATUSES, ROLE_BG, ROLE_LABELS,
  type Role, type Transaction, type Customer, type Service,
} from '../lib/types';
import { Badge, StatCard, TableShell, LoadingSpinner } from '../components/ui-primitives';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { toast } from 'sonner';

const CHART_COLORS = ['#a78bfa', '#f472b6', '#67e8f9', '#fbbf24', '#86efac'];

// â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function DashboardPage({ onNavigate }: { onNavigate?: (p: Page) => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => setData(res.data))
      .catch(() => toast.error('Gagal memuat dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data || !user) return null;

  const role = user.role;
  const stats = data.stats as Record<string, number>;

  if (role === 'pelanggan') {
    const recent = (data.recent as Transaction[]) || [];
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-violet-500 to-violet-300 rounded-2xl p-6 text-white">
          <p className="text-white/80 text-sm font-medium mb-1">Selamat datang kembali 👋</p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-white/80 text-sm">Pelanggan Aira Laundry</p>
        </div>
        <button onClick={() => onNavigate?.('pesan')}
          className="w-full bg-white text-violet-700 rounded-xl py-4 px-5 font-bold text-base shadow-sm hover:bg-violet-50 transition-all flex items-center justify-center gap-3">
          <ShoppingCart size={22} />
          Pesan Laundry Sekarang
        </button>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Transaksi" value={stats.total_transactions || 0} icon={<Receipt size={19} className="text-violet-600" />} color="bg-violet-50 dark:bg-violet-950/50" />
          <StatCard title="Sedang Diproses" value={stats.processing || 0} icon={<Clock size={19} className="text-amber-600" />} color="bg-amber-50 dark:bg-amber-950/50" />
          <StatCard title="Selesai" value={stats.completed || 0} icon={<CheckCircle size={19} className="text-green-600" />} color="bg-green-50 dark:bg-green-950/50" />
          <StatCard title="Total Pengeluaran" value={formatCurrency(stats.total_spent || 0)} icon={<DollarSign size={19} className="text-pink-500" />} color="bg-pink-50 dark:bg-pink-950/30" />
        </div>
        <TrxTable transactions={recent} columns={['trx_code', 'service_name', 'total', 'status', 'created_at']} />
      </div>
    );
  }

  if (role === 'kasir') {
    const ready = (data.ready as Transaction[]) || [];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Transaksi Hari Ini" value={stats.today_transactions || 0} icon={<Receipt size={19} className="text-violet-600" />} color="bg-violet-50 dark:bg-violet-950/30" />
          <StatCard title="Pendapatan Hari Ini" value={formatCurrency(stats.today_revenue || 0)} icon={<DollarSign size={19} className="text-emerald-600" />} color="bg-emerald-50 dark:bg-emerald-950/30" />
          <StatCard title="Belum Lunas" value={stats.unpaid || 0} icon={<AlertCircle size={19} className="text-amber-600" />} color="bg-amber-50 dark:bg-amber-950/30" />
          <StatCard title="Siap Diambil" value={stats.ready_pickup || 0} icon={<Package size={19} className="text-pink-500" />} color="bg-pink-50 dark:bg-pink-950/30" />
        </div>
        <KasirTransactionForm onCreated={() => api.getDashboard().then(r => setData(r.data))} />
        {ready.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border"><h3 className="font-bold">Siap Diambil ({ready.length})</h3></div>
            <div className="divide-y divide-border">
              {ready.map(t => (
                <div key={t.id} className="px-5 py-3 flex justify-between">
                  <div><p className="font-semibold text-sm">{t.customer_name}</p><p className="text-xs text-muted-foreground">{t.trx_code}</p></div>
                  <p className="font-bold text-sm">{formatCurrency(t.total)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (role === 'pegawai') {
    const orders = (data.orders as Transaction[]) || [];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Laundry Masuk" value={stats.incoming || 0} icon={<Package size={19} className="text-violet-600" />} color="bg-violet-50 dark:bg-violet-950/30" />
          <StatCard title="Sedang Dikerjakan" value={stats.in_progress || 0} icon={<Clock size={19} className="text-amber-600" />} color="bg-amber-50 dark:bg-amber-950/30" />
          <StatCard title="Selesai Hari Ini" value={stats.completed_today || 0} icon={<CheckCircle size={19} className="text-green-600" />} color="bg-green-50 dark:bg-green-950/30" />
          <StatCard title="Siap Diambil" value={stats.ready_pickup || 0} icon={<Truck size={19} className="text-pink-500" />} color="bg-pink-50 dark:bg-pink-950/30" />
        </div>
        <PegawaiOrderTable orders={orders} onUpdate={() => api.getDashboard().then(r => setData(r.data))} />
      </div>
    );
  }

  const weeklyRevenue = (data.weeklyRevenue as { day: string; revenue: number; transactions: number }[]) || [];
  const servicePopular = (data.servicePopular as { name: string; count: number }[]) || [];
  const recentTrx = (data.recentTrx as Transaction[]) || [];
  const pieData = servicePopular.map((s, i) => ({ name: s.name, value: s.count, color: CHART_COLORS[i % CHART_COLORS.length] }));
  const totalPopular = pieData.reduce((a, s) => a + s.value, 0) || 1;

  if (role === 'pemilik') {
    const monthlyRevenue = (data.monthlyRevenue as { month: string; revenue: number }[]) || [];
    const employeePerf = (data.employeePerf as { name: string; role: string; orders_handled: number; completed: number }[]) || [];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Pendapatan" value={formatCurrency((data.yearly_revenue as number) || stats.monthly_revenue || 0)} icon={<DollarSign size={19} className="text-emerald-600" />} trend={18} color="bg-emerald-50 dark:bg-emerald-950/30" />
          <StatCard title="Total Transaksi" value={stats.total_transactions || 0} icon={<Receipt size={19} className="text-violet-600" />} color="bg-violet-50 dark:bg-violet-950/30" />
          <StatCard title="Total Pelanggan" value={stats.total_customers || 0} icon={<Users size={19} className="text-pink-500" />} color="bg-pink-50 dark:bg-pink-950/30" />
          <StatCard title="Total Pegawai" value={stats.total_employees || 0} icon={<UserCheck size={19} className="text-sky-600" />} color="bg-sky-50 dark:bg-sky-950/30" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Pendapatan Bulanan">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Pendapatan']} />
                <Bar dataKey="revenue" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Transaksi Harian">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="transactions" stroke="#f472b6" strokeWidth={2.5} fill="#f472b633" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">Kinerja Pegawai</h3>
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {employeePerf.map(emp => (
              <div key={emp.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-bold">{emp.name[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role} â€¢ {emp.completed}/{emp.orders_handled} selesai</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500"><Star size={11} fill="currentColor" /><span className="text-xs font-bold">{emp.orders_handled > 0 ? Math.round(emp.completed / emp.orders_handled * 100) : 0}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pelanggan" value={stats.total_customers || 0} icon={<Users size={19} className="text-violet-600" />} trend={12} color="bg-violet-50 dark:bg-violet-950/30" />
        <StatCard title="Total Transaksi" value={stats.total_transactions || 0} icon={<Receipt size={19} className="text-pink-500" />} trend={8} color="bg-pink-50 dark:bg-pink-950/30" />
        <StatCard title="Total Pegawai" value={stats.total_employees || 0} icon={<UserCheck size={19} className="text-sky-600" />} color="bg-sky-50 dark:bg-sky-950/30" />
        <StatCard title="Pendapatan Bulan Ini" value={formatCurrency(stats.monthly_revenue || 0)} icon={<DollarSign size={19} className="text-emerald-600" />} trend={5} color="bg-emerald-50 dark:bg-emerald-950/30" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Pendapatan Minggu Ini" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), 'Pendapatan']} />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2.5} fill="#a78bfa22" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Layanan Terpopuler">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                <span className="font-semibold">{Math.round(s.value / totalPopular * 100)}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
      <TrxTable transactions={recentTrx} />
    </div>
  );
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-xl p-5 border border-border shadow-sm ${className}`}>
      <h3 className="font-bold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TrxTable({ transactions, columns }: { transactions: Transaction[]; columns?: string[] }) {
  return (
    <TableShell total={transactions.length} shown={transactions.length}>
      <thead><tr className="bg-muted/60">
        {(columns || ['trx_code', 'customer_name', 'service_name', 'total', 'status', 'payment_status']).map(h => (
          <th key={h} className="text-left px-5 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h.replace(/_/g, ' ')}</th>
        ))}
      </tr></thead>
      <tbody>
        {transactions.map(t => (
          <tr key={t.id} className="border-t border-border hover:bg-muted/30">
            <td className="px-5 py-3.5 font-mono text-[11px] text-violet-600 font-bold">{t.trx_code}</td>
            {!columns && <td className="px-5 py-3.5 text-sm font-semibold">{t.customer_name}</td>}
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.service_name}</td>
            <td className="px-5 py-3.5 font-bold text-sm">{formatCurrency(t.total)}</td>
            <td className="px-5 py-3.5"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
            {!columns && <td className="px-5 py-3.5"><Badge className={t.payment_status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>{t.payment_status === 'lunas' ? 'Lunas' : 'Belum'}</Badge></td>}
            {columns?.includes('created_at') && <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>}
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function KasirTransactionForm({ onCreated }: { onCreated: () => void }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ customer_id: '', service_id: '', weight: '', item_count: '', discount: '', extra_fee: '', note: '', payment_method: 'tunai' as 'tunai' | 'transfer' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([api.getCustomers(), api.getServices()]).then(([c, s]) => {
      setCustomers(c.data);
      setServices(s.data.filter((x: Service) => x.is_active));
    });
  }, []);

  const selectedService = services.find(s => s.id === parseInt(form.service_id));
  const weight = parseFloat(form.weight) || 0;
  const itemCount = parseInt(form.item_count) || 0;
  const discount = parseFloat(form.discount) || 0;
  const extraFee = parseFloat(form.extra_fee) || 0;
  const multiplier = selectedService?.unit === 'kg' ? weight : (itemCount || 1);
  const total = selectedService ? selectedService.price * multiplier - discount + extraFee : 0;

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!form.customer_id) e.customer_id = 'Pelanggan wajib dipilih';
    if (!form.service_id) e.service_id = 'Layanan wajib dipilih';
    if (selectedService?.unit === 'kg' && weight <= 0) e.weight = 'Berat cucian tidak boleh kosong';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      await api.createTransaction({
        customer_id: parseInt(form.customer_id),
        service_id: parseInt(form.service_id),
        weight, item_count: itemCount, discount, extra_fee: extraFee,
        note: form.note, payment_method: form.payment_method,
        payment_status: 'belum',
      });
      toast.success('Transaksi berhasil dibuat');
      setForm({ customer_id: '', service_id: '', weight: '', item_count: '', discount: '', extra_fee: '', note: '', payment_method: 'tunai' });
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat transaksi');
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-bold mb-5">Input Transaksi Baru</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Pilih Pelanggan *</label>
          <select value={form.customer_id} onChange={e => setForm(p => ({ ...p, customer_id: e.target.value }))}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400 ${errors.customer_id ? 'border-red-400' : 'border-border'}`}>
            <option value="">-- Pilih Pelanggan --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} â€” {c.phone}</option>)}
          </select>
          {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Layanan *</label>
          <select value={form.service_id} onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400 ${errors.service_id ? 'border-red-400' : 'border-border'}`}>
            <option value="">-- Pilih Layanan --</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name} â€” {formatCurrency(s.price)}/{s.unit}</option>)}
          </select>
        </div>
        {selectedService?.unit === 'kg' && (
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Berat (kg) *</label>
            <input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} step="0.5" min="0"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400 ${errors.weight ? 'border-red-400' : 'border-border'}`} />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>
        )}
        {selectedService && selectedService.unit !== 'kg' && (
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Jumlah Item</label>
            <input type="number" value={form.item_count} onChange={e => setForm(p => ({ ...p, item_count: e.target.value }))} min="1"
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
        )}
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Diskon (Rp)</label>
          <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} min="0"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Biaya Tambahan (Rp)</label>
          <input type="number" value={form.extra_fee} onChange={e => setForm(p => ({ ...p, extra_fee: e.target.value }))} min="0"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-1.5 block">Catatan Khusus</label>
          <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Misal: pisahkan baju merah..."
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
        </div>
      </div>
      {total > 0 && (
        <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 border border-violet-200 dark:border-violet-800 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Estimasi Total</span>
            <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-4">
        <button onClick={submit} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
          <Plus size={16} />Buat Transaksi
        </button>
      </div>
    </div>
  );
}

function PegawaiOrderTable({ orders, onUpdate }: { orders: Transaction[]; onUpdate: () => void }) {
  const updateStatus = async (id: number, currentStatus: string) => {
    const idx = STATUSES.indexOf(currentStatus as typeof STATUSES[number]);
    // Jangan izinkan mengubah menjadi status 'Diambil', stop di 'Selesai' (index 5)
    if (idx >= 5) return;
    const next = STATUSES[Math.min(idx + 1, 5)];
    try {
      await api.updateStatus(id, next);
      toast.success(`Status diperbarui menjadi: ${next}`);
      onUpdate();
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  return (
    <TableShell total={orders.length} shown={orders.length}>
      <thead><tr className="bg-muted/60">
        {['ID / Pelanggan', 'Layanan', 'Status', 'Catatan', 'Aksi'].map(h => (
          <th key={h} className="text-left px-5 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h}</th>
        ))}
      </tr></thead>
      <tbody>
        {orders.map(t => (
          <tr key={t.id} className="border-t border-border hover:bg-muted/30">
            <td className="px-5 py-3.5">
              <div className="font-mono text-[11px] text-violet-600 font-bold">{t.trx_code}</div>
              <div className="font-semibold text-sm">{t.customer_name}</div>
            </td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.service_name}{t.weight > 0 ? ` (${t.weight}kg)` : ''}</td>
            <td className="px-5 py-3.5"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
            <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-32 truncate">{t.note || 'â€”'}</td>
            <td className="px-5 py-3.5">
              {t.status !== 'Selesai' && t.status !== 'Diambil' && (
                <button onClick={() => updateStatus(t.id, t.status)}
                  className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1.5 rounded-lg font-semibold">
                  Update â†’
                </button>
              )}
              {t.status === 'Selesai' && <Badge className="bg-green-100 text-green-700">Siap Diambil</Badge>}
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

// ─── Pesan Page (Customer Booking) ──────────────────────────────────────────────
export function PesanPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [form, setForm] = useState({ weight: '', item_count: '1', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successTrx, setSuccessTrx] = useState<string | null>(null);

  const loadServices = () => {
    setLoading(true);
    api.getServices().then(res => setServices(res.data.filter((s: Service) => s.is_active))).finally(() => setLoading(false));
  };

  useEffect(() => { loadServices(); }, []);

  const weight = parseFloat(form.weight) || 0;
  const itemCount = parseInt(form.item_count) || 1;
  const multiplier = selectedService?.unit === 'kg' ? weight : itemCount;
  const total = selectedService ? selectedService.price * multiplier : 0;

  const handleSelectService = (s: Service) => {
    setSelectedService(s);
    setForm({ weight: '', item_count: '1', note: '' });
    setSuccessTrx(null);
  };

  const handleSubmit = async () => {
    if (!selectedService) return;
    if (selectedService.unit === 'kg' && weight <= 0) {
      toast.error('Masukkan berat cucian');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createTransaction({
        customer_id: user!.customer_id!,
        service_id: selectedService.id,
        weight, item_count: itemCount, discount: 0, extra_fee: 0,
        note: form.note || undefined,
        payment_status: 'belum',
      });
      setSuccessTrx(res.data.trx_code);
      setSelectedService(null);
      setForm({ weight: '', item_count: '1', note: '' });
      toast.success('Pesanan berhasil dibuat!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat pesanan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (successTrx) {
    return (
      <div className="max-w-lg mx-auto mt-10 text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Pesanan Berhasil!</h2>
          <p className="text-muted-foreground text-sm mt-1">Kode transaksi:</p>
          <p className="text-2xl font-mono font-bold text-violet-600 mt-1">{successTrx}</p>
        </div>
        <p className="text-sm text-muted-foreground">Silakan antar cucian Anda ke Aira Laundry terdekat</p>
        <button onClick={() => setSuccessTrx(null)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          Pesan Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Pesan Laundry</h2>
        <p className="text-sm text-muted-foreground mt-1">Pilih layanan dan isi detail cucian Anda</p>
      </div>

      <div className="space-y-2">
        {services.map(s => (
          <label key={s.id}
            onClick={() => handleSelectService(s)}
            className={`flex items-center gap-4 bg-card border rounded-xl p-4 cursor-pointer transition-all ${
              selectedService?.id === s.id ? 'ring-2 ring-violet-400 border-violet-300' : 'border-border hover:border-violet-200'
            }`}>
            <input type="radio" name="service" checked={selectedService?.id === s.id} readOnly className="accent-violet-600" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.category} &middot; {s.duration}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-violet-600">{formatCurrency(s.price)}</p>
              <p className="text-[11px] text-muted-foreground">/{s.unit}</p>
            </div>
          </label>
        ))}
      </div>

      {selectedService && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          {selectedService.unit === 'kg' ? (
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Berat Cucian (kg) *</label>
              <input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                step="0.5" min="0" placeholder="Contoh: 2.5"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Jumlah Item</label>
              <input type="number" value={form.item_count} onChange={e => setForm(p => ({ ...p, item_count: e.target.value }))}
                min="1" placeholder="Jumlah item"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          )}
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Catatan (opsional)</label>
            <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Misal: pisahkan baju putih dan warna..."
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
          </div>

          {total > 0 && (
            <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 border border-violet-200 dark:border-violet-800 -mx-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Estimasi Total</span>
                <span className="text-xl font-bold text-violet-700 dark:text-violet-300">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
            {submitting ? 'Memproses...' : 'Pesan Sekarang'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Transaksi Page ──────────────────────────────────────────────────────────────
export function TransaksiPage({ role }: { role: Role }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTrx, setEditingTrx] = useState<any>(null);
  const [paymentTrx, setPaymentTrx] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ discount: '', extra_fee: '', note: '', weight: '', item_count: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.getTransactions({
      search: search || undefined,
      status: filterStatus === 'all' ? undefined : filterStatus,
    }).then(res => setTransactions(res.data))
      .catch(() => toast.error('Gagal memuat transaksi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const filtered = useMemo(() => transactions, [transactions]);

  const handleEdit = (t: any) => {
    setEditingTrx(t);
    setForm({ discount: t.discount.toString(), extra_fee: t.extra_fee.toString(), note: t.note || '', weight: t.weight.toString(), item_count: t.item_count?.toString() || '' });
    setShowModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.updateTransaction(editingTrx.id, {
        discount: parseFloat(form.discount) || 0,
        extra_fee: parseFloat(form.extra_fee) || 0,
        note: form.note,
        weight: parseFloat(form.weight) || undefined,
        item_count: parseInt(form.item_count) || undefined
      });
      toast.success('Transaksi berhasil diperbarui');
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()}
            placeholder="Cari ID atau nama pelanggan..." className="flex-1 text-sm bg-transparent outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm outline-none">
          <option value="all">Semua Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {role === 'kasir' || role === 'admin' ? (
          <button onClick={() => toast.info('Gunakan menu Dashboard untuk menambah transaksi baru')} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 justify-center">
            <Plus size={16} /> Transaksi Baru
          </button>
        ) : null}
      </div>
      <TableShell total={transactions.length} shown={filtered.length}>
        <thead><tr className="bg-muted/60">
          {['Kode', 'Pelanggan', 'Layanan', 'Total', 'Status', 'Bayar', 'Tanggal', 'Aksi'].map(h => (
            <th key={h} className="text-left px-5 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-5 py-3.5 font-mono text-[11px] text-violet-600 font-bold">{t.trx_code}</td>
              <td className="px-5 py-3.5"><div className="font-semibold text-sm">{t.customer_name}</div><div className="text-xs text-muted-foreground">{t.customer_phone}</div></td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.service_name}</td>
              <td className="px-5 py-3.5 font-bold text-sm">{formatCurrency(t.total)}</td>
              <td className="px-5 py-3.5"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
              <td className="px-5 py-3.5"><Badge className={t.payment_status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>{t.payment_status === 'lunas' ? 'Lunas' : 'Belum'}</Badge></td>
              <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
              <td className="px-5 py-3.5">
                <div className="flex gap-1">
                  <button className="p-1.5 text-muted-foreground hover:text-violet-600 rounded-lg"><Eye size={13} /></button>
                  {t.payment_status === 'belum' && <button onClick={() => setPaymentTrx(t)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Bayar"><DollarSign size={13} /></button>}
                  {(role === 'admin' || role === 'kasir') && <button onClick={() => handleEdit(t)} className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg"><Edit2 size={13} /></button>}
                  {(role === 'admin') && <button onClick={async () => { if(confirm('Hapus transaksi ini?')) { await api.deleteTransaction(t.id); load(); } }} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg"><Trash2 size={13} /></button>}
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground text-sm">Tidak ada transaksi</td></tr>}
        </tbody>
      </TableShell>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Transaksi {editingTrx?.trx_code}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="edit-trx-form" onSubmit={handleSubmitEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Berat Cucian (kg)</label>
                  <input type="number" step="0.1" min="0" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" disabled={editingTrx?.service_unit !== 'kg'} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Jumlah Item</label>
                  <input type="number" min="0" value={form.item_count} onChange={e => setForm({...form, item_count: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" disabled={editingTrx?.service_unit === 'kg'} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Diskon (Rp)</label>
                  <input type="number" min="0" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Biaya Tambahan (Rp)</label>
                  <input type="number" min="0" value={form.extra_fee} onChange={e => setForm({...form, extra_fee: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Catatan</label>
                  <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} type="button" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl">Batal</button>
              <button form="edit-trx-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50">
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentTrx && (
        <PaymentGatewayModal
          transaction={paymentTrx}
          open={!!paymentTrx}
          onClose={() => setPaymentTrx(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}

// â”€â”€â”€ Pelanggan Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PelangganPage({ role }: { role: Role }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCustomers = () => {
    setLoading(true);
    api.getCustomers(search).then(res => setCustomers(res.data)).catch(() => toast.error('Gagal memuat pelanggan')).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleEdit = (c: any) => {
    setEditingCustomer(c);
    setForm({ name: c.name, phone: c.phone, email: c.email || '', address: c.address || '' });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setForm({ name: '', phone: '', email: '', address: '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus pelanggan ini?')) {
      try {
        await api.deleteCustomer(id);
        toast.success('Pelanggan berhasil dihapus');
        loadCustomers();
      } catch (err: any) {
        toast.error(err.message || 'Gagal menghapus pelanggan');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, form);
        toast.success('Pelanggan berhasil diperbarui');
      } else {
        await api.createCustomer(form);
        toast.success('Pelanggan berhasil ditambahkan');
      }
      setShowModal(false);
      loadCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan pelanggan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, HP, atau email..." className="flex-1 text-sm bg-transparent outline-none" />
        </div>
        {(role === 'admin' || role === 'kasir') && (
          <button onClick={handleAdd} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 justify-center">
            <Plus size={16} /> Tambah Pelanggan
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map(c => (
          <div key={c.id} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center font-bold">{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{c.name}</h4>
                <p className="text-xs text-muted-foreground">ID: {c.id}</p>
              </div>
              <Badge className="bg-violet-100 text-violet-700">{c.transaction_count || 0} trx</Badge>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div>dY"z {c.phone}</div>
              {c.email && <div>o%,? {c.email}</div>}
              {c.address && <div>dY"? {c.address}</div>}
            </div>
            {(role === 'admin' || role === 'kasir') && (
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button onClick={() => handleEdit(c)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Edit2 size={13} /> Edit</button>
                {role === 'admin' && (
                  <button onClick={() => handleDelete(c.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"><Trash2 size={13} /> Hapus</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Lengkap *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nomor HP *</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Alamat</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} type="button" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl">Batal</button>
              <button form="customer-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50">
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Layanan Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function LayananPage({ role }: { role: Role }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: 'Kiloan', price: '', unit: 'kg', duration: '1 Hari', is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServices = () => {
    setLoading(true);
    api.getServices().then(res => setServices(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (s: any) => {
    setEditingService(s);
    setForm({ name: s.name, category: s.category, price: s.price.toString(), unit: s.unit, duration: s.duration, is_active: s.is_active });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setForm({ name: '', category: 'Kiloan', price: '', unit: 'kg', duration: '1 Hari', is_active: true });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus layanan ini?')) {
      try {
        await api.deleteService(id);
        toast.success('Layanan berhasil dihapus');
        loadServices();
      } catch (err: any) {
        toast.error(err.message || 'Gagal menghapus layanan');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0 };
      if (editingService) {
        await api.updateService(editingService.id, payload);
        toast.success('Layanan berhasil diperbarui');
      } else {
        await api.createService(payload);
        toast.success('Layanan berhasil ditambahkan');
      }
      setShowModal(false);
      loadServices();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan layanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {(role === 'admin') && (
        <div className="flex justify-end">
          <button onClick={handleAdd} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> Tambah Layanan
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {services.map(s => (
          <div key={s.id} className={`bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${!s.is_active ? 'opacity-60' : 'border-border'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-violet-50 rounded-xl"><Shirt size={19} className="text-violet-600" /></div>
              <Badge className={s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>{s.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
            </div>
            <h4 className="font-bold text-sm mb-0.5">{s.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">Kategori: {s.category}</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Harga</span><span className="font-bold text-violet-600">{formatCurrency(s.price)}/{s.unit}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Estimasi</span><span className="text-sm font-medium">{s.duration}</span></div>
            </div>
            {(role === 'admin') && (
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button onClick={() => handleEdit(s)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Edit2 size={13} /> Edit</button>
                {role === 'admin' && (
                  <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"><Trash2 size={13} /> Hapus</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Layanan *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Kategori *</label>
                  <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400">
                    <option value="Kiloan">Kiloan</option>
                    <option value="Satuan">Satuan</option>
                    <option value="Paket">Paket</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Harga *</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Unit *</label>
                  <select required value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400">
                    <option value="kg">kg</option>
                    <option value="item">item</option>
                    <option value="pasang">pasang</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Estimasi Durasi *</label>
                  <input required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="Misal: 1 Hari, 3 Jam" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="is_active_service" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded text-violet-600 focus:ring-violet-500" />
                  <label htmlFor="is_active_service" className="text-sm font-semibold">Layanan Aktif</label>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} type="button" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl">Batal</button>
              <button form="service-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50">
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Status Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function StatusPage({ role }: { role: Role }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const canUpdate = ['admin', 'kasir', 'pegawai', 'pemilik'].includes(role);

  const load = () => {
    setLoading(true);
    api.getTransactions({ status: filter === 'all' ? undefined : filter })
      .then(res => setTransactions(res.data.filter((t: Transaction) => t.status !== 'Diambil')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.updateStatus(id, status);
      toast.success(`Status diperbarui menjadi: ${status}`);
      load();
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilter('all')} className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ${filter === 'all' ? 'bg-violet-600 text-white' : 'bg-card border border-border text-muted-foreground'}`}>Semua</button>
        {STATUSES.filter(s => s !== 'Diambil').map(status => (
          <button key={status} onClick={() => setFilter(status)} className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold ${filter === status ? 'ring-2 ring-violet-400 ' + getStatusColor(status) : getStatusColor(status)}`}>{status}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {transactions.map(t => (
          <div key={t.id} className="bg-card rounded-xl border border-border shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-violet-600 font-bold">{t.trx_code}</span>
              <Badge className={getStatusColor(t.status)}>{t.status}</Badge>
            </div>
            <h4 className="font-bold text-sm">{t.customer_name}</h4>
            <p className="text-sm text-muted-foreground">{t.service_name}{t.weight > 0 ? ` • ${t.weight} kg` : ''}</p>
            {t.note && <div className="mt-2 text-xs bg-muted rounded-lg px-3 py-1.5">📝 {t.note}</div>}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <span className="font-bold">{formatCurrency(t.total)}</span>
              <Badge className={t.payment_status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>{t.payment_status === 'lunas' ? 'Lunas' : 'Belum Bayar'}</Badge>
            </div>
            {canUpdate && (
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Status</span>
                <select
                  value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                  className="flex-1 bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer appearance-none text-center py-1"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} disabled={s === 'Diambil'}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ Laporan Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function LaporanPage() {
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getReportSummary(period).then(res => setData(res.data)).finally(() => setLoading(false));
  }, [period]);

  const summary = data?.summary as Record<string, number> | undefined;
  const transactions = (data?.transactions as Transaction[]) || [];

  const exportFile = async (type: 'pdf' | 'excel') => {
    try {
      const ext = type === 'pdf' ? 'pdf' : 'xlsx';
      await api.downloadFile(`/reports/export/${type}?period=${period}`, `laporan-${period}.${ext}`);
      toast.success('File berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh file');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex bg-card border border-border rounded-xl p-1 gap-1">
          {[['daily', 'Harian'], ['weekly', 'Mingguan'], ['monthly', 'Bulanan'], ['yearly', 'Tahunan']].map(([val, label]) => (
            <button key={val} onClick={() => setPeriod(val)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${period === val ? 'bg-violet-600 text-white' : 'text-muted-foreground'}`}>{label}</button>
          ))}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={() => exportFile('pdf')} className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-xl text-sm hover:bg-muted"><Download size={14} />Export PDF</button>
          <button onClick={() => exportFile('excel')} className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-xl text-sm hover:bg-muted"><Download size={14} />Export Excel</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Pendapatan" value={formatCurrency(summary?.total_revenue || 0)} icon={<DollarSign size={19} className="text-emerald-600" />} color="bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard title="Total Transaksi" value={summary?.total_transactions || 0} icon={<Receipt size={19} className="text-violet-600" />} color="bg-violet-50 dark:bg-violet-950/30" />
        <StatCard title="Pelanggan Unik" value={summary?.unique_customers || 0} icon={<Users size={19} className="text-pink-500" />} color="bg-pink-50 dark:bg-pink-950/30" />
      </div>
      <TrxTable transactions={transactions.slice(0, 20)} />
    </div>
  );
}

// â”€â”€â”€ Pengguna Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PenggunaPage() {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; phone: string; address: string; role: Role; is_active: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'kasir' as Role, is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    api.getUsers().then(res => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', phone: user.phone || '', address: user.address || '', role: user.role, is_active: user.is_active });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', phone: '', address: '', role: 'kasir', is_active: true });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await api.deleteUser(id);
        toast.success('Pengguna berhasil dihapus');
        loadUsers();
      } catch (err: any) {
        toast.error(err.message || 'Gagal menghapus pengguna');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const payload: any = { ...form };
        if (!payload.password) delete payload.password;
        await api.updateUser(editingUser.id, payload);
        toast.success('Pengguna berhasil diperbarui');
      } else {
        if (!form.password) {
          toast.error('Password wajib diisi untuk pengguna baru');
          setIsSubmitting(false);
          return;
        }
        await api.createUser(form);
        toast.success('Pengguna berhasil ditambahkan');
      }
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleAdd} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      <TableShell total={users.length} shown={users.length}>
        <thead><tr className="bg-muted/60">
          {['Pengguna', 'Role', 'Status', 'Aksi'].map(h => (
            <th key={h} className="text-left px-5 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${ROLE_BG[u.role]}`}>{u.name[0]}</div>
                  <div><div className="font-semibold text-sm">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                </div>
              </td>
              <td className="px-5 py-3.5"><Badge className={`${ROLE_BG[u.role]} text-white`}>{ROLE_LABELS[u.role]}</Badge></td>
              <td className="px-5 py-3.5"><div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-gray-300'}`} /><span className="text-xs">{u.is_active ? 'Aktif' : 'Nonaktif'}</span></div></td>
              <td className="px-5 py-3.5">
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(u)} className="p-1.5 hover:text-blue-600 rounded-lg"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:text-red-500 rounded-lg"><Trash2 size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Lengkap *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{editingUser ? 'Password (kosongkan jika tidak diubah)' : 'Password *'}</label>
                  <input type="password" required={!editingUser} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" minLength={6} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nomor HP</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Alamat</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role *</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-violet-400">
                    <option value="kasir">Kasir</option>
                    <option value="pegawai">Pegawai Laundry</option>
                    <option value="admin">Admin</option>
                    <option value="pemilik">Pemilik Usaha</option>
                    <option value="pelanggan">Pelanggan</option>
                  </select>
                </div>
                {editingUser && (
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded text-violet-600 focus:ring-violet-500" />
                    <label htmlFor="is_active" className="text-sm font-semibold">Akun Aktif</label>
                  </div>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} type="button" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl">Batal</button>
              <button form="user-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50">
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Profil Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ProfilPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || '', address: user.address || '' });
  }, [user]);

  const saveProfile = async () => {
    try {
      await api.updateProfile(form);
      await refreshUser();
      toast.success('Profil berhasil diperbarui');
    } catch {
      toast.error('Gagal memperbarui profil');
    }
  };

  const changePassword = async () => {
    if (passwords.new_password !== passwords.confirm) {
      setMsg('Password tidak sesuai');
      return;
    }
    try {
      await api.changePassword({ old_password: passwords.old_password, new_password: passwords.new_password });
      toast.success('Password berhasil diubah');
      setPasswords({ old_password: '', new_password: '', confirm: '' });
      setMsg('');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Gagal mengubah password');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${ROLE_BG[user.role]}`}>{user.name[0]}</div>
          <div><h3 className="text-lg font-bold">{user.name}</h3><Badge className={`${ROLE_BG[user.role]} text-white mt-1.5`}>{ROLE_LABELS[user.role]}</Badge></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['name', 'phone', 'address'] as const).map(key => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
              <label className="text-xs text-muted-foreground font-semibold block mb-1.5 uppercase">{key === 'name' ? 'Nama Lengkap' : key === 'phone' ? 'Nomor HP' : 'Alamat'}</label>
              <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          ))}
          <div><label className="text-xs text-muted-foreground font-semibold block mb-1.5 uppercase">Email</label><input value={user.email} disabled className="w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm opacity-60" /></div>
        </div>
        <button onClick={saveProfile} className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Simpan Perubahan</button>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="font-bold mb-4">Ubah Password</h3>
        {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>}
        <div className="space-y-3">
          {(['old_password', 'new_password', 'confirm'] as const).map(key => (
            <div key={key}>
              <label className="text-xs text-muted-foreground font-semibold block mb-1.5 uppercase">{key === 'old_password' ? 'Password Lama' : key === 'new_password' ? 'Password Baru' : 'Konfirmasi Password'}</label>
              <input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          ))}
          <button onClick={changePassword} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Update Password</button>
        </div>
      </div>
    </div>
  );
}

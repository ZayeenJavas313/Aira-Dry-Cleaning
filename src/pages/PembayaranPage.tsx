import { useState, useEffect } from 'react';
import { Search, DollarSign, CreditCard, Banknote, Download, Printer, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import { formatCurrency, getStatusColor, type Transaction } from '../lib/types';
import { Badge, TableShell, LoadingSpinner } from '../components/ui-primitives';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { toast } from 'sonner';

const GATEWAY_LABELS: Record<string, string> = {
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  va_bca: 'VA BCA',
  va_mandiri: 'VA Mandiri',
  va_bni: 'VA BNI',
};

export function PembayaranPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'belum' | 'lunas'>('all');
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  const load = () => {
    setLoading(true);
    api.getTransactions({ search: search || undefined, payment_status: filter === 'all' ? undefined : filter })
      .then(res => setTransactions(res.data))
      .catch(() => toast.error('Gagal memuat data pembayaran'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const downloadReceipt = async (id: number, trxCode: string) => {
    try {
      await api.downloadFile(`/reports/receipt/${id}`, `nota-${trxCode}.pdf`);
    } catch {
      toast.error('Gagal mengunduh nota');
    }
  };

  const filtered = transactions.filter(t =>
    !search || t.trx_code.toLowerCase().includes(search.toLowerCase()) ||
    t.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const unpaidTotal = filtered.filter(t => t.payment_status === 'belum').reduce((a, t) => a + t.total, 0);
  const paidTotal = filtered.filter(t => t.payment_status === 'lunas').reduce((a, t) => a + t.total, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-emerald-600" />
            <span className="text-sm text-muted-foreground font-medium">Total Lunas</span>
          </div>
          <div className="text-xl font-bold text-foreground">{formatCurrency(paidTotal)}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-amber-600" />
            <span className="text-sm text-muted-foreground font-medium">Belum Lunas</span>
          </div>
          <div className="text-xl font-bold text-foreground">{formatCurrency(unpaidTotal)}</div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Banknote size={18} className="text-violet-600" />
            <span className="text-sm text-muted-foreground font-medium">Transaksi Belum Bayar</span>
          </div>
          <div className="text-xl font-bold text-foreground">{filtered.filter(t => t.payment_status === 'belum').length}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()}
            placeholder="Cari kode transaksi atau pelanggan..."
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
          className="bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none">
          <option value="all">Semua Status</option>
          <option value="belum">Belum Lunas</option>
          <option value="lunas">Lunas</option>
        </select>
      </div>

      <TableShell total={transactions.length} shown={filtered.length}>
        <thead>
          <tr className="bg-muted/60">
            {['Kode TRX', 'Pelanggan', 'Total', 'Status Laundry', 'Pembayaran', 'Metode', 'Aksi'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 font-mono text-[11px] text-violet-600 font-bold">{t.trx_code}</td>
              <td className="px-5 py-3.5">
                <div className="font-semibold text-sm text-foreground">{t.customer_name}</div>
                <div className="text-xs text-muted-foreground">{t.customer_phone}</div>
              </td>
              <td className="px-5 py-3.5 font-bold text-sm text-foreground">{formatCurrency(t.total)}</td>
              <td className="px-5 py-3.5"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
              <td className="px-5 py-3.5">
                <Badge className={t.payment_status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>
                  {t.payment_status === 'lunas' ? 'Lunas' : 'Belum'}
                </Badge>
              </td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground capitalize">
                {t.payment_gateway ? (
                  <span className="inline-flex items-center gap-1">
                    <Wallet size={12} className="text-violet-500" />
                    {GATEWAY_LABELS[t.payment_gateway] || t.payment_method || '—'}
                  </span>
                ) : t.payment_method || '—'}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  {t.payment_status === 'belum' && (
                    <button onClick={() => setSelectedTrx(t)}
                      className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1">
                      <Wallet size={11} /> Bayar
                    </button>
                  )}
                  <button onClick={() => downloadReceipt(t.id, t.trx_code)} title="Unduh Nota"
                    className="p-1.5 text-muted-foreground hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                    <Download size={13} />
                  </button>
                  <button onClick={() => window.print()} title="Cetak"
                    className="p-1.5 text-muted-foreground hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                    <Printer size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground text-sm">Tidak ada data pembayaran</td></tr>
          )}
        </tbody>
      </TableShell>

      {selectedTrx && (
        <PaymentGatewayModal
          transaction={selectedTrx}
          open={!!selectedTrx}
          onClose={() => setSelectedTrx(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}

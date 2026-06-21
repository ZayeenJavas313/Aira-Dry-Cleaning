import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share,
  Plus,
  Copy,
  Sparkles,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Grid,
  Shirt,
  TrendingUp,
} from 'lucide-react';
import { Logo } from './Logo';

/* ------------------------------------------------------------------ */
/*  ScaledDashboard – renders children at a fixed width and scales    */
/* ------------------------------------------------------------------ */

const DESIGN_WIDTH = 896;

function ScaledDashboard({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const recalc = useCallback(() => {
    if (!outerRef.current || !innerRef.current) return;
    const containerWidth = outerRef.current.offsetWidth;
    const s = containerWidth / DESIGN_WIDTH;
    setScale(s);
    setHeight(innerRef.current.offsetHeight * s);
  }, []);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <div ref={outerRef} style={{ height }} className="relative overflow-hidden">
      <div
        ref={innerRef}
        style={{
          width: DESIGN_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar nav items                                                 */
/* ------------------------------------------------------------------ */

const sidebarNav = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: ShoppingBag, label: 'Transaksi', active: false },
  { icon: Users, label: 'Pelanggan', active: false },
  { icon: Shirt, label: 'Layanan', active: false },
  { icon: TrendingUp, label: 'Laporan', active: false },
];

const recentOrders = [
  { name: 'Budi Santoso', service: 'Cuci Kiloan 1 Hari', status: 'done' },
  { name: 'Siti Rahayu', service: 'Dry Cleaning Jas', status: 'process' },
  { name: 'Andi Prasetyo', service: 'Cuci Sprei', status: 'done' },
  { name: 'Maya Dewi', service: 'Cuci Kiloan 2 Hari', status: 'process' },
];

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */

const stats = [
  { label: 'TRANSAKSI', value: '1,284', sub: 'Bulan ini' },
  { label: 'PELANGGAN', value: '387', sub: 'Pelanggan aktif' },
  { label: 'PENDAPATAN', value: '18,5jt', sub: 'Bulan Juni 2026' },
  { label: 'RATING', value: '4.9', sub: 'Dari 520 review' },
];

/* ------------------------------------------------------------------ */
/*  Service category cards                                            */
/* ------------------------------------------------------------------ */

const services = [
  { name: 'Cuci Kiloan', desc: 'Cuci pakaian sehari-hari bersih wangi', price: 'Rp 7.000/kg' },
  { name: 'Cuci Satuan', desc: 'Sprei, Selimut, Bed Cover, Karpet, Sepatu', price: 'Rp 15.000+' },
  { name: 'Dry Cleaning', desc: 'Perawatan khusus tekstil sensitif/jas', price: 'Rp 25.000+' },
];

/* ------------------------------------------------------------------ */
/*  Transaction table                                                 */
/* ------------------------------------------------------------------ */

const transactionRows = [
  { customer: 'Budi Santoso', service: 'Cuci Kiloan 1 Hari', weight: '3.5 kg', total: 'Rp 24.500', status: 'Selesai' },
  { customer: 'Siti Rahayu', service: 'Dry Cleaning Jas', weight: '1 pcs', total: 'Rp 35.000', status: 'Proses' },
  { customer: 'Andi Prasetyo', service: 'Cuci Sprei King', weight: '1 pcs', total: 'Rp 25.000', status: 'Proses' },
  { customer: 'Maya Dewi', service: 'Cuci Kiloan 2 Hari', weight: '5.0 kg', total: 'Rp 30.000', status: 'Selesai' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function DashboardMockup() {
  return (
    <ScaledDashboard>
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left">
        {/* Title bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
            </div>

            {/* Nav icons */}
            <div className="flex items-center gap-2 ml-2">
              <PanelLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            </div>

            {/* URL bar */}
            <div className="flex-1 flex justify-center">
              <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 flex items-center gap-1.5">
                <Monitor className="w-3 h-3 text-white/40" />
                airalaundry.id
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-white/40" />
              <Share className="w-3.5 h-3.5 text-white/40" />
              <Plus className="w-3.5 h-3.5 text-white/40" />
              <Copy className="w-3.5 h-3.5 text-white/40" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex min-h-[480px]">
          {/* Sidebar */}
          <div className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col">
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-4">
              <Logo className="w-4 h-4 text-violet-400" />
              <Grid className="w-3.5 h-3.5 text-white/30" />
            </div>

            {/* Workspace badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded bg-violet-600 flex items-center justify-center text-[8px] font-bold text-white">
                A
              </div>
              <span className="text-[10px] text-white/80">Aira Laundry</span>
            </div>

            {/* Nav items */}
            <div className="space-y-1 mb-5">
              {sidebarNav.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] transition-colors ${
                    item.active
                      ? 'bg-violet-600/20 text-violet-450'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="mt-auto">
              <p className="text-[8px] text-white/30 uppercase tracking-wider mb-2">Pesanan Terbaru</p>
              <div className="space-y-1.5">
                {recentOrders.map((order) => (
                  <div key={order.name} className="flex items-start gap-1.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ color: order.status === 'done' ? 'rgba(40,200,64,0.7)' : 'rgba(254,188,46,0.7)' }}>
                      <svg viewBox="0 0 6 6" fill="currentColor" className="w-1.5 h-1.5"><circle cx="3" cy="3" r="3" /></svg>
                    </span>
                    <div className="min-w-0">
                      <span className="text-[9px] text-white/60 leading-tight block truncate">{order.name}</span>
                      <span className="text-[8px] text-white/35 leading-tight block truncate">{order.service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Aira Laundry</p>
                  <p className="text-[10px] text-white/45">Jl. Bimo Kurdo No. 10, Demangan, Yogyakarta</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors">
                <Sparkles className="w-3 h-3" />
                Transaksi Baru
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-5">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-3">
                  <p className="text-[8px] tracking-wider text-white/35 uppercase mb-1">{stat.label}</p>
                  <p className="text-xl font-medium text-white">{stat.value}</p>
                  <p className="text-[9px] text-white/40 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Service cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 px-4 py-3"
                >
                  <p className="text-[11px] text-white/80 font-medium">{svc.name}</p>
                  <p className="text-[9px] text-white/40 mt-0.5">{svc.desc}</p>
                  <p className="text-[10px] text-violet-400 mt-1.5 font-medium">{svc.price}</p>
                </div>
              ))}
            </div>

            {/* Transaction table */}
            <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/5">
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Transaksi Terbaru</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[8px] text-white/30 uppercase tracking-wider px-4 py-2 font-medium">Pelanggan</th>
                    <th className="text-left text-[8px] text-white/30 uppercase tracking-wider px-4 py-2 font-medium">Layanan</th>
                    <th className="text-left text-[8px] text-white/30 uppercase tracking-wider px-4 py-2 font-medium">Berat/Qty</th>
                    <th className="text-left text-[8px] text-white/30 uppercase tracking-wider px-4 py-2 font-medium">Total</th>
                    <th className="text-left text-[8px] text-white/30 uppercase tracking-wider px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionRows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-b-0">
                      <td className="text-[10px] text-white/70 px-4 py-2.5">{row.customer}</td>
                      <td className="text-[10px] text-white/50 px-4 py-2.5">{row.service}</td>
                      <td className="text-[10px] text-white/50 px-4 py-2.5">{row.weight}</td>
                      <td className="text-[10px] text-white/60 px-4 py-2.5 font-medium">{row.total}</td>
                      <td className="text-[10px] px-4 py-2.5">
                        <span className={
                          row.status === 'Draft'
                            ? 'text-[#febc2e]/80'
                            : row.status === 'Published'
                            ? 'text-[#3b82f6]/80'
                            : 'text-[#28c840]/80'
                        }>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ScaledDashboard>
  );
}

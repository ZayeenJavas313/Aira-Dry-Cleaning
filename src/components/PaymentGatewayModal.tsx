import { useState, useEffect } from 'react';
import { X, CircleCheck, CreditCard, Smartphone, Building2, QrCode, Wallet, Banknote } from 'lucide-react';
import { formatCurrency, type Transaction } from '../lib/types';
import { api } from '../lib/api';
import { toast } from 'sonner';

type GatewayMethod = 'qris' | 'gopay' | 'ovo' | 'dana' | 'va_bca' | 'va_mandiri' | 'va_bni';

interface GatewayOption {
  id: GatewayMethod;
  label: string;
  icon: typeof CreditCard;
  color: string;
  group: 'qris' | 'ewallet' | 'va' | 'tunai';
}

const GATEWAYS: GatewayOption[] = [
  { id: 'qris', label: 'QRIS', icon: QrCode, color: '#7C3AED', group: 'qris' },
  { id: 'gopay', label: 'GoPay', icon: Wallet, color: '#00AAFF', group: 'ewallet' },
  { id: 'ovo', label: 'OVO', icon: Wallet, color: '#4B21B0', group: 'ewallet' },
  { id: 'dana', label: 'DANA', icon: Wallet, color: '#0086D4', group: 'ewallet' },
  { id: 'va_bca', label: 'BCA Virtual Account', icon: Building2, color: '#0066AE', group: 'va' },
  { id: 'va_mandiri', label: 'Mandiri Virtual Account', icon: Building2, color: '#F0682A', group: 'va' },
  { id: 'va_bni', label: 'BNI Virtual Account', icon: Building2, color: '#FF6600', group: 'va' },
];

function generateVANumber(bank: string, trxId: number): string {
  const prefix = bank === 'va_bca' ? '88008' : bank === 'va_mandiri' ? '45120' : '88080';
  const id = String(trxId).padStart(6, '0');
  return `${prefix}${id}${Math.floor(100 + Math.random() * 899)}`;
}

function generateQRContent(trxCode: string, total: number): string {
  const nmid = 'ID1020210888' + trxCode.slice(-4);
  const fee = total.toString();
  return `00020101021126640015ID.${nmid}0303${fee}51440018ID.CO.QRIS-WWW${fee}53033605802ID5909LAUNDRY6007JAKARTA6304A1B2`;
}

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
            i <= current ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>{i + 1}</div>
          <span className={`text-xs font-medium ${i <= current ? 'text-violet-700' : 'text-gray-300'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-6 h-px ${i < current ? 'bg-violet-600' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

interface Props {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentGatewayModal({ transaction, open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<GatewayOption | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [vaNumber, setVANumber] = useState('');
  const [qrExpiry, setQrExpiry] = useState(300);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setSelected(null);
      setConfirming(false);
      setPaymentDone(false);
      setQrExpiry(300);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !selected || selected.group === 'tunai') return;
    if (selected.group === 'va') {
      setVANumber(generateVANumber(selected.id, transaction.id));
    }
    setQrExpiry(300);
    const timer = setInterval(() => {
      setQrExpiry(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, selected, transaction.id]);

  const handleSelect = (gw: GatewayOption) => {
    setSelected(gw);
    setStep(1);
    setConfirming(false);
    setPaymentDone(false);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const methodLabel = selected!.group === 'tunai' ? 'tunai' : selected!.group === 'va' ? 'Virtual Account' : selected!.group === 'ewallet' ? selected!.label : 'QRIS';
      await api.updatePayment(transaction.id, {
        payment_status: 'lunas',
        payment_method: methodLabel,
        payment_gateway: selected!.id,
      });
      setPaymentDone(true);
      setStep(2);
      toast.success('Pembayaran berhasil!');
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch {
      toast.error('Gagal memproses pembayaran');
    } finally {
      setConfirming(false);
    }
  };

  const handlePayLater = () => {
    toast.success('Pembayaran akan dilakukan nanti');
    onClose();
  };

  if (!open) return null;

  const steps = ['Pilih Metode', 'Konfirmasi', 'Selesai'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Payment Gateway</h2>
            <p className="text-xs text-gray-400 mt-0.5">Transaksi: <span className="text-violet-600 font-mono font-bold">{transaction.trx_code}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <StepIndicator current={step} steps={steps} />
        </div>

        <div className="px-5 pb-5">
          {/* Step 0: Payment Method Selection */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Total Pembayaran</p>
              <div className="text-2xl font-bold text-violet-700">{formatCurrency(transaction.total)}</div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">QRIS</p>
                <div className="grid grid-cols-1 gap-2">
                  {GATEWAYS.filter(g => g.group === 'qris').map(gw => (
                    <button key={gw.id} onClick={() => handleSelect(gw)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-left">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: gw.color + '15' }}>
                        <gw.icon size={20} style={{ color: gw.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{gw.label}</div>
                        <div className="text-xs text-gray-400">Scan QR code untuk membayar</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">E-Wallet</p>
                <div className="grid grid-cols-3 gap-2">
                  {GATEWAYS.filter(g => g.group === 'ewallet').map(gw => (
                    <button key={gw.id} onClick={() => handleSelect(gw)}
                      className="flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50/50 transition-all">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: gw.color + '15' }}>
                        <gw.icon size={20} style={{ color: gw.color }} />
                      </div>
                      <span className="font-semibold text-xs text-gray-700">{gw.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Virtual Account</p>
                <div className="grid grid-cols-1 gap-2">
                  {GATEWAYS.filter(g => g.group === 'va').map(gw => (
                    <button key={gw.id} onClick={() => handleSelect(gw)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-left">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: gw.color + '15' }}>
                        <gw.icon size={20} style={{ color: gw.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{gw.label}</div>
                        <div className="text-xs text-gray-400">Transfer ke nomor virtual account</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <button onClick={() => handleSelect({ id: 'tunai' as GatewayMethod, label: 'Tunai', icon: Banknote, color: '#10B981', group: 'tunai' })}
                  className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all w-full text-left">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50">
                    <Banknote size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Tunai (Bayar Langsung)</div>
                    <div className="text-xs text-gray-400">Pembayaran di kasir</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Confirmation / Payment Details */}
          {step === 1 && selected && (
            <div className="space-y-5">
              {selected.group === 'qris' && (
                <div className="text-center space-y-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-100 inline-block mx-auto">
                    <div className="w-48 h-48 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg flex items-center justify-center mx-auto border border-gray-100">
                      <div className="text-center">
                        <QrCode size={140} className="text-gray-900 mx-auto" />
                        <div className="text-[8px] text-gray-400 mt-1 font-mono">ID1020210888</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Scan QRIS ini dengan aplikasi pembayaran</p>
                    <div className="text-sm font-semibold text-gray-700">Total: {formatCurrency(transaction.total)}</div>
                    <div className="text-xs text-amber-600 mt-2 flex items-center justify-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Kode QR berlaku {Math.floor(qrExpiry / 60)}:{String(qrExpiry % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              )}

              {selected.group === 'ewallet' && (
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto`} style={{ backgroundColor: selected.color + '15' }}>
                    <Smartphone size={40} style={{ color: selected.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{selected.label}</p>
                    <p className="text-xs text-gray-400 mt-1">Pembayaran melalui aplikasi {selected.label}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Pembayaran</span>
                      <span className="font-bold text-gray-800">{formatCurrency(transaction.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Kode Transaksi</span>
                      <span className="font-mono font-bold text-violet-600">{transaction.trx_code}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    Menunggu pembayaran...
                  </div>
                </div>
              )}

              {selected.group === 'va' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: selected.color + '15' }}>
                      <Building2 size={24} style={{ color: selected.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selected.label}</p>
                      <p className="text-xs text-gray-400">Transfer ke nomor Virtual Account berikut</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 text-center space-y-3">
                    <p className="text-xs text-gray-400 font-medium">Nomor Virtual Account</p>
                    <p className="text-2xl font-bold tracking-widest text-gray-900 font-mono select-all"
                      style={{ letterSpacing: '0.15em' }}>{vaNumber}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Transfer</span>
                      <span className="font-bold text-gray-800">{formatCurrency(transaction.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Batas Pembayaran</span>
                      <span className="text-gray-600">{Math.floor(qrExpiry / 60)}:{String(qrExpiry % 60).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              )}

              {selected.group === 'tunai' && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                    <Banknote size={40} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Pembayaran Tunai</p>
                    <p className="text-xs text-gray-400 mt-1">Pembayaran langsung di kasir laundry</p>
                  </div>
                  <div className="bg-emerald-50/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-gray-800">{formatCurrency(transaction.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pelanggan</span>
                      <span className="font-semibold text-gray-700">{transaction.customer_name}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Kembali
                </button>
                <button onClick={handleConfirm} disabled={confirming}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {confirming ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                  ) : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Success */}
          {step === 2 && (
            <div className="text-center space-y-5 py-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CircleCheck size={44} className="text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</p>
                <p className="text-sm text-gray-400 mt-1">
                  {transaction.trx_code} — {formatCurrency(transaction.total)}
                </p>
              </div>
              <div className="bg-violet-50 rounded-xl p-4 inline-block mx-auto">
                <p className="text-xs text-violet-500 font-medium">{selected?.label || 'Pembayaran'}</p>
              </div>
              <p className="text-xs text-gray-400">Mengalihkan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

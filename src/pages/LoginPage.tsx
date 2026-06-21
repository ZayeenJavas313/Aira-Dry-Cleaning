import { useState } from 'react';
import { Link } from 'react-router';
import { Shirt, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAuth, ApiError } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../lib/types';

const DEMO_ACCOUNTS = [
  { email: 'admin@aira.com', role: 'admin', label: 'Admin' },
  { email: 'kasir@aira.com', role: 'kasir', label: 'Kasir' },
  { email: 'pegawai@aira.com', role: 'pegawai', label: 'Pegawai' },
  { email: 'pemilik@aira.com', role: 'pemilik', label: 'Pemilik' },
  { email: 'pelanggan@aira.com', role: 'pelanggan', label: 'Pelanggan' },
];

export function LoginPage({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@aira.com');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-pink-300/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-300/50">
            <Shirt size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Aira Laundry</h1>
          <p className="text-muted-foreground text-sm mt-1.5 font-medium">Sistem Informasi Manajemen Laundry</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-2xl shadow-violet-100/50 dark:shadow-none p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 text-foreground transition-shadow" />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-border bg-input-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-400 text-foreground transition-shadow" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-2 block uppercase tracking-wide">Akun Demo</label>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.role} type="button" onClick={() => selectDemo(acc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    email === acc.email
                      ? 'bg-violet-100 dark:bg-violet-950 border-violet-300 text-violet-700 dark:text-violet-300'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl py-3.5 font-bold text-sm transition-all shadow-sm">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">Daftar sekarang</Link>
          </p>
        </form>

        <div className="flex justify-center mt-5">
          <button onClick={onToggleDark} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
      </div>
    </div>
  );
}

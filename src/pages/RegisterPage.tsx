import { useState } from 'react';
import { Link } from 'react-router';
import { Shirt, Sun, Moon } from 'lucide-react';
import { useAuth, ApiError } from '../contexts/AuthContext';

export function RegisterPage({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!form.password) e.password = 'Password wajib diisi';
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (form.password !== form.confirm) e.confirm = 'Password tidak sesuai';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        address: form.address || undefined,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors?.length) {
          const fieldErrors: Record<string, string> = {};
          err.errors.forEach(e => { fieldErrors[e.field] = e.message; });
          setErrors(fieldErrors);
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', required = false) => (
    <div>
      <label className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input type={type} value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={`w-full rounded-xl border bg-input-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 text-foreground transition-shadow ${
          errors[key] ? 'border-red-400' : 'border-border'
        }`} />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-pink-300/15 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
            <Shirt size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Daftar Akun</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat akun pelanggan Aira Laundry</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-xl p-6 space-y-4">
          {serverError && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-xl">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('name', 'Nama Lengkap', 'text', true)}
            {field('phone', 'Nomor HP')}
          </div>
          {field('email', 'Email', 'email', true)}
          {field('address', 'Alamat')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('password', 'Password', 'password', true)}
            {field('confirm', 'Konfirmasi Password', 'password', true)}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl py-3.5 font-bold text-sm transition-all shadow-sm">
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Masuk</Link>
          </p>
        </form>

        <div className="flex justify-center mt-4">
          <button onClick={onToggleDark} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
      </div>
    </div>
  );
}

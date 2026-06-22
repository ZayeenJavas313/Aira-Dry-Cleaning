import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Logo } from './Logo';

const navLinks = [
  { label: 'Layanan', href: '#layanan' },
  { label: 'Harga Kiloan', href: '#harga-kiloan' },
  { label: 'Layanan Satuan', href: '#layanan-satuan' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Kontak', href: '#kontak' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="animate-fade-down fixed top-0 left-0 right-0 z-50 bg-white/95 sm:bg-white/80 backdrop-blur-lg border-b border-zinc-100">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo + Brand */}
        <a href="/" className="text-violet-600 shrink-0 flex items-center gap-2 justify-self-start">
          <Logo className="w-7 h-7 text-violet-600" />
          <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-zinc-950 font-display">
            Aira Dry Cleaning & Laundry
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 justify-self-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-zinc-700 hover:text-violet-600 transition-colors flex items-center gap-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: Login & CTA buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 justify-self-end">
          <a
            href="/login"
            className="flex items-center gap-1 text-zinc-700 hover:text-violet-600 text-[13px] sm:text-[14px] font-semibold px-2 sm:px-4 py-2 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4 text-violet-600" />
            <span className="hidden sm:inline">Login</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute left-4 right-4 top-full rounded-2xl bg-white/95 backdrop-blur-xl ring-1 ring-zinc-200 px-5 py-4 mt-2 shadow-xl animate-fade-up md:hidden z-30">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-[16px] font-medium text-zinc-700 hover:text-violet-600 transition-colors ${
                i < navLinks.length - 1 ? 'border-b border-zinc-100' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100">
            <a
              href="/login"
              className="flex items-center justify-center gap-2 py-3 text-[16px] font-semibold text-zinc-700 hover:text-violet-600 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <LogIn className="w-5 h-5 text-violet-600" />
              Masuk / Login
            </a>

          </div>
        </div>
      )}
    </nav>
  );
}

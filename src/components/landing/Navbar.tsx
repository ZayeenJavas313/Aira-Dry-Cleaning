import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Logo } from './Logo';

const navLinks = [
  { label: 'Layanan', href: '#layanan', hasDropdown: false },
  { label: 'Harga Kiloan', href: '#harga-kiloan', hasDropdown: false },
  { label: 'Layanan Satuan', href: '#layanan-satuan', hasDropdown: false },
  { label: 'Lokasi Kami', href: '#lokasi', hasDropdown: false },
  { label: 'Kontak Ibu Aira', href: '#kontak', hasDropdown: false },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-6 sm:px-8 py-5">
        {/* Logo + Brand */}
        <a href="/" className="text-violet-600 shrink-0 flex items-center gap-2">
          <Logo className="w-6 h-6 text-violet-600" />
          <span className="text-lg font-bold tracking-tight text-zinc-950 font-display">
            Aira Dry Cleaning & Laundry
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="flex items-center gap-1 text-zinc-700 hover:text-violet-600 text-[14px] font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4 text-violet-600" />
            <span>Login</span>
          </a>
          <a
            href="https://wa.me/6285743999911?text=Halo%20Aira%20Laundry%2C%20saya%20ingin%20memesan%20layanan%20laundry"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-600 text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-violet-700 transition-colors shadow-sm"
          >
            Pesan via WA
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
            <a
              href="https://wa.me/6285743999911?text=Halo%20Aira%20Laundry%2C%20saya%20ingin%20memesan%20layanan%20laundry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-3 text-[16px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

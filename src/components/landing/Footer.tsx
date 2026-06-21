import { Logo } from './Logo';

export function Footer() {
  const footerSections = [
    {
      title: 'Layanan',
      links: [
        { label: 'Cuci Kiloan Harian', href: '#layanan' },
        { label: 'Cuci Satuan Premium', href: '#layanan-satuan' },
        { label: 'Dry Cleaning Khusus', href: '#layanan' },
        { label: 'Setrika Uap Boiler', href: '#layanan' },
      ],
    },
    {
      title: 'Informasi',
      links: [
        { label: 'Tarif & Harga', href: '#harga-kiloan' },
        { label: 'Lokasi Google Maps', href: '#lokasi' },
        { label: 'Cara Memesan', href: '#layanan' },
        { label: 'Garansi Cuci Ulang', href: '#kontak' },
      ],
    },
    {
      title: 'Kontak Kami',
      links: [
        { label: 'WhatsApp Ibu Aira', href: 'https://wa.me/6285743999911' },
        { label: 'Telepon Langsung', href: 'tel:085743999911' },
        { label: 'Alamat Workshop', href: '#lokasi' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2">
            <a href="/" className="text-white flex items-center gap-2 mb-4">
              <Logo className="w-6 h-6 text-violet-400" />
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Aira Laundry
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Jasa pencucian pakaian dan perawatan tekstil UMKM tepercaya di Yogyakarta. Bersih Sempurna, Wangi Tahan Lama.
            </p>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Aira Dry Cleaning & Laundry Yogyakarta. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#layanan" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#kontak" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

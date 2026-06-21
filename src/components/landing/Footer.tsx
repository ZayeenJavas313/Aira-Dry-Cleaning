import { Logo } from './Logo';

function isExternalLink(href: string) {
  return href.startsWith('http') || href.startsWith('https');
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Layanan',
      titleId: 'footer-layanan',
      links: [
        { label: 'Cuci Kiloan Harian', href: '#layanan' },
        { label: 'Cuci Satuan Premium', href: '#layanan-satuan' },
        { label: 'Dry Cleaning Khusus', href: '#layanan' },
        { label: 'Setrika Uap Boiler', href: '#layanan' },
      ],
    },
    {
      title: 'Informasi',
      titleId: 'footer-informasi',
      type: 'info',
      items: [
        {
          label: 'Tarif & Harga',
          href: '#harga-kiloan',
          detail: (
            <div className="space-y-0.5 mt-1 text-[11px] text-slate-500 leading-relaxed">
              <p>Cuci Reguler Rp 5.000/kg</p>
              <p>Cuci Express Rp 10.000/kg</p>
              <p>Dry Cleaning Rp 25.000/item</p>
              <p>Setrika Uap Rp 3.000/kg</p>
            </div>
          ),
        },
        {
          label: 'Lokasi Workshop',
          href: '#lokasi',
          detail: (
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Jl. Bimo Kurdo No. 10, Demangan,<br />
              Gondokusuman, Yogyakarta
            </p>
          ),
        },
        {
          label: 'Cara Memesan',
          href: '#layanan',
          detail: (
            <ol className="mt-1 text-[11px] text-slate-500 leading-relaxed list-decimal list-inside">
              <li>Hubungi via WhatsApp</li>
              <li>Gratis jemput & antar</li>
              <li>Cuci + setrika premium</li>
            </ol>
          ),
        },
        {
          label: 'Garansi Cuci Ulang',
          href: '#kontak',
          detail: (
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Gratis cuci ulang jika hasil kurang memuaskan.
            </p>
          ),
        },
      ],
    },
    {
      title: 'Kontak Kami',
      titleId: 'footer-kontak',
      links: [
        { label: 'WhatsApp Ibu Aira', href: 'https://wa.me/6285743999911' },
        { label: 'Telepon Langsung', href: 'tel:085743999911' },
        { label: 'Alamat Workshop', href: '#lokasi' },
      ],
    },
  ];

  return (
    <footer aria-label="Footer Aira Laundry" className="bg-slate-900 text-slate-400 py-16 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2">
            <a href="/" className="text-white flex items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded" aria-label="Aira Laundry - Beranda">
              <Logo className="w-6 h-6 text-violet-400" aria-hidden="true" />
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
            <nav key={section.title} aria-labelledby={section.titleId}>
              <h4 id={section.titleId} className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                {section.title}
              </h4>
              {section.type === 'info' ? (
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                      >
                        {item.label}
                      </a>
                      {item.detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                        {...(isExternalLink(link.href) && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `${link.label} (buka di tab baru)`,
                        })}
                      >
                        {link.label}
                        {isExternalLink(link.href) && (
                          <span className="sr-only">(buka di tab baru)</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {currentYear} Aira Dry Cleaning &amp; Laundry Yogyakarta. All rights reserved. Created by <a href="https://ahmadnaim.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded">JavasZayeen-AhmadNaim</a>.</p>
          <nav aria-label="Footer navigasi bawah" className="flex gap-6">
            <a href="#layanan" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded">Kebijakan Privasi</a>
            <a href="#kontak" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded">Syarat &amp; Ketentuan</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

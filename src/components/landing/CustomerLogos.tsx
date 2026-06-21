interface LogoItem {
  name: string;
  svgPath: React.ReactNode;
}

export function CustomerLogos() {
  const logos: LogoItem[] = [
    {
      name: 'Yogyakarta',
      svgPath: (
        <text x="50%" y="60%" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold">
          Demangan
        </text>
      ),
    },
    {
      name: 'UMKM',
      svgPath: (
        <text x="50%" y="60%" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold" fontStyle="italic">
          Gondokusuman
        </text>
      ),
    },
    {
      name: 'DryClean',
      svgPath: (
        <text x="50%" y="60%" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="bold">
          Dry Cleaning
        </text>
      ),
    },
    {
      name: 'Kiloan',
      svgPath: (
        <text x="50%" y="60%" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="semibold">
          Cuci Kiloan
        </text>
      ),
    },
    {
      name: 'Satuan',
      svgPath: (
        <text x="50%" y="60%" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="extrabold">
          Satuan
        </text>
      ),
    },
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-100 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Melayani Kebutuhan Perawatan Pakaian Area Yogyakarta
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div key={logo.name} className="logo-grid-item w-32 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all duration-300">
              <svg className="w-full h-full" viewBox="0 0 120 40">
                {logo.svgPath}
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

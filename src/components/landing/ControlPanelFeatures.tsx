import { Clock, Shirt, Sparkles, Heart, Check, Smile } from 'lucide-react';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  illustration: string;
}

export function ControlPanelFeatures() {
  const features: FeatureCard[] = [
    {
      title: 'Cuci Kiloan Harian',
      description: 'Layanan cuci pakaian sehari-hari secara kiloan. Bersih, rapi, harum, dan siap pakai dengan proses sterilisasi terbaik.',
      icon: Clock,
      badge: 'Bestseller',
      illustration: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      title: 'Dry Cleaning Profesional',
      description: 'Layanan cuci kering (dry cleaning) eksklusif menggunakan pelarut khusus ramah serat kain untuk pakaian formal, kebaya, atau jas.',
      icon: Sparkles,
      badge: 'Penanganan Khusus',
      illustration: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      title: 'Cuci Satuan Premium',
      description: 'Pembersihan khusus untuk item berukuran besar atau bahan sensitif seperti sprei king-size, selimut tebal, bed cover, karpet, hingga sepatu kesayangan.',
      icon: Shirt,
      badge: 'Item Spesial',
      illustration: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&h=400&q=80',
    },
    {
      title: 'Detergen Ramah Lingkungan',
      description: 'Kami menggunakan formula pembersih bersertifikasi yang aman bagi serat kain, lembut di kulit sensitif, dan ramah bagi ekosistem.',
      icon: Heart,
      illustration: 'https://images.unsplash.com/photo-1751606803218-67f4b896fc4e?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      title: 'Setrika & Lipat Rapi',
      description: 'Pakaian tidak hanya bersih tetapi disetrika menggunakan mesin uap boiler bertekanan tinggi untuk hasil lipatan licin maksimal bebas kerutan.',
      icon: Check,
      illustration: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      title: 'Jaminan Kepuasan Pelanggan',
      description: 'Kami berkomitmen memberikan pelayanan terbaik. Jika Anda kurang puas dengan hasilnya, kami siap memberikan garansi cuci ulang gratis.',
      icon: Smile,
      illustration: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&h=260&q=80',
    },
  ];

  return (
    <section id="layanan" className="bg-slate-50 py-20 border-b border-slate-100 relative z-10 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Layanan Terbaik dari <br/>Aira Dry Cleaning & Laundry
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Kami mengutamakan kualitas kebersihan, kecepatan, serta kepuasan Anda dalam merawat setiap helai pakaian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  {feature.badge && (
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="bg-slate-100 h-44 overflow-hidden border-t border-slate-150 relative">
                <img
                  src={feature.illustration}
                  alt={feature.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22260%22 fill=%22%23f1f5f9%22/%3E'; }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { ShoppingBag, Star, CheckCircle2 } from 'lucide-react';

export function ScalabilitySection() {
  const [activeTab, setActiveTab] = useState<'kiloan' | 'satuan'>('kiloan');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'layanan-satuan') setActiveTab('satuan');
    else if (hash === 'harga-kiloan') setActiveTab('kiloan');
  }, []);

  return (
    <section id="harga-kiloan" className="bg-white py-20 border-b border-slate-100 relative z-10 scroll-mt-24">
      <div id="layanan-satuan" className="absolute -top-20" />
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Paket Fleksibel.
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Sesuaikan kebutuhan pencucian Anda dengan skema paket cuci kiloan harian atau cuci satuan untuk barang berharga Anda.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1.5 rounded-full flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('kiloan')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'kiloan'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-violet-600" />
              <span>Cuci Kiloan</span>
            </button>
            <button
              onClick={() => setActiveTab('satuan')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'satuan'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-4 h-4 text-pink-600" />
              <span>Cuci Satuan</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div>
            {activeTab === 'kiloan' ? (
              <div>
                <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Cuci Kiloan Harian
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-4 mb-4">
                  Solusi Praktis & Ekonomis
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Cocok untuk pakaian kasual sehari-hari, pakaian kerja, kaos, celana, dan pakaian dalam. Anda dapat menentukan waktu pengerjaan yang diinginkan:
                </p>
                <ul className="space-y-3">
                  {[
                    'Paket Kilat (1 Hari) - Pakaian cepat selesai',
                    'Paket Sedang (2 Hari) - Pilihan seimbang',
                    'Paket Hemat (3 Hari) - Harga super terjangkau',
                    'Menggunakan detergen anti-bakteri dan pewangi premium',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Cuci Satuan Premium
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-4 mb-4">
                  Perawatan Khusus Item Khusus
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Layanan khusus untuk membersihkan dan merawat tekstil berukuran besar, tebal, atau memerlukan teknik penanganan khusus agar tidak merusak bahan:
                </p>
                <ul className="space-y-3">
                  {[
                    'Sprei & Bed Cover - Bersih wangi bebas tungau',
                    'Selimut Tebal - Kering sempurna & lembut kembali',
                    'Karpet Rumah - Pembersihan debu & noda optimal',
                    'Cuci Sepatu - Mengembalikan kesegaran warna sepatu Anda',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Image based on active tab */}
          <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-200 h-80">
            <img
              src={activeTab === 'kiloan'
                ? 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&h=400&q=80'
                : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&h=400&q=80'}
              alt={activeTab === 'kiloan' ? 'Cuci Kiloan' : 'Cuci Satuan'}
              className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

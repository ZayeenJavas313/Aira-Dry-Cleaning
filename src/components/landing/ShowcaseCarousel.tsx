import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ShowcaseItem {
  title: string;
  category: string;
  image: string;
  url: string;
}

export function ShowcaseCarousel() {
  const [index, setIndex] = useState(0);

  const items: ShowcaseItem[] = [
    {
      title: 'Cuci & Sterilisasi Kasur / Bed Cover',
      category: 'Sprei & Bedding',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&h=380&q=80',
      url: 'https://wa.me/6285743999911',
    },
    {
      title: 'Pembersihan Noda Sepatu Premium',
      category: 'Perawatan Sepatu',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=380&q=80',
      url: 'https://wa.me/6285743999911',
    },
    {
      title: 'Dry Cleaning Jas & Pakaian Formal',
      category: 'Dry Cleaning',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&h=380&q=80',
      url: 'https://wa.me/6285743999911',
    },
    {
      title: 'Karpet & Sajadah Masjid Bersih Higienis',
      category: 'Item Besar',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&h=380&q=80',
      url: 'https://wa.me/6285743999911',
    },
  ];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white py-20 border-b border-slate-100 relative overflow-hidden z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Hasil Cuci Kami.
            </h2>
            <p className="text-slate-600 mt-2 text-base sm:text-lg">
              Kami memperlakukan setiap pakaian dan kain berharga Anda dengan standar kebersihan tertinggi.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-700 shadow-sm"
              aria-label="Previous Showcase"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-700 shadow-sm"
              aria-label="Next Showcase"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel items wrapper */}
        <div className="relative">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((item, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10">
                  <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22380%22 fill=%22%23f1f5f9%22/%3E'; }}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-4 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      Setiap pengerjaan dilakukan oleh staf berpengalaman dengan kontrol kualitas yang ketat, menjamin noda membandel hilang tanpa merusak serat kain atau melunturkan warna asli pakaian Anda.
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-violet-700 transition-all shadow-sm"
                    >
                      <span>Tanya Layanan Ini</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-1.5 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === i ? 'bg-violet-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

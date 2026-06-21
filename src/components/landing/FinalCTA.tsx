import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="bg-white py-24 border-b border-slate-100 relative overflow-hidden z-10">
      {/* Visual background gradient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-violet-50/70 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-50/60 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-2xl mx-auto">
          Dapatkan pakaian bersih <br className="hidden sm:inline" />
          dan <span className="font-serif-accent font-normal italic text-violet-600">sempurna.</span>
        </h2>
        
        <p className="text-slate-600 mt-6 text-base sm:text-xl max-w-xl mx-auto leading-relaxed">
          Daftarkan akun pelanggan Anda sekarang untuk memantau status cucian Anda secara real-time dari panel pelanggan Aira Laundry.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/register"
            className="bg-violet-600 text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-violet-700 hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>Daftar Akun Gratis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://wa.me/6285743999911"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-slate-800 text-base font-semibold px-8 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

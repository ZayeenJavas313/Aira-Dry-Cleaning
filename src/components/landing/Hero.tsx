import { Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';
import { Navbar } from './Navbar';
import { DashboardMockup } from './DashboardMockup';

export function Hero() {
  return (
    <section className="landing-page relative overflow-hidden bg-zinc-50 flex flex-col pt-16">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-100/40 blur-[120px]" />
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-pink-100/30 blur-[100px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-16 sm:pt-24 pb-8">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#fff1f2] border border-[#ffe4e6] rounded-full px-4.5 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span className="text-[13px] text-zinc-800 font-semibold">
            UMKM Terpercaya di Yogyakarta
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold tracking-tight text-zinc-900 text-4xl sm:text-6xl lg:text-[76px] leading-[1.08] max-w-3xl">
          <span className="block animate-fade-up font-serif-accent font-normal italic text-violet-600">Bersih Sempurna.</span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            Wangi Tahan Lama.
          </span>
        </h1>

        {/* Description */}
        <p className="animate-fade-up [animation-delay:220ms] mt-8 text-zinc-600 text-base sm:text-xl leading-relaxed max-w-2xl">
          Aira Dry Cleaning & Laundry menghadirkan layanan perawatan tekstil profesional untuk keluarga Anda di Yogyakarta. Kami melayani cuci kiloan express harian, cuci satuan berkualitas tinggi, hingga perawatan dry cleaning eksklusif.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up [animation-delay:340ms] mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/login"
            className="bg-violet-600 text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-violet-700 hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span>Pesan / Order Sekarang</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://wa.me/6285743999911?text=Halo%20Aira%20Laundry%2C%20saya%20ingin%20memesan%20layanan%20laundry"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-zinc-800 text-base font-semibold px-8 py-3.5 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <span>Pesan via WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="animate-hero-rise [animation-delay:500ms] relative z-10 w-[92%] sm:w-[84%] lg:w-[72%] max-w-5xl mx-auto shrink-0 -mb-16 sm:-mb-24 lg:-mb-32">
        <DashboardMockup />
      </div>

      {/* Spacer to push next content down */}
      <div className="h-24 sm:h-36 lg:h-44" />
    </section>
  );
}

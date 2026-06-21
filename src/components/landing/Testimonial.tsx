export function Testimonial() {
  return (
    <section className="bg-slate-50 py-24 border-b border-slate-100 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Quote symbol */}
        <span className="text-6xl sm:text-7xl font-serif-accent text-pink-600 opacity-20 block line-height-none mb-4 select-none">
          “
        </span>
        
        {/* Quote statement */}
        <blockquote className="text-xl sm:text-3xl font-display font-medium text-slate-900 leading-relaxed tracking-tight max-w-3xl mx-auto">
          Pakaian kerja saya selalu rapi, wangi tahan lama, dan setrikaannya sangat licin. Layanan 1 hari dari Aira Laundry sangat membantu saya yang sibuk bekerja. Pelayanannya ramah sekali!
        </blockquote>

        {/* Author Details */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80"
              alt="Riana Saputri"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 fill=%22%23e2e8f0%22/%3E'; }}
            />
          </div>
          <div className="text-left text-center sm:text-left">
            <p className="text-base font-bold text-slate-950">Riana Saputri</p>
            <p className="text-sm text-slate-500 font-medium">Pelanggan Setia Aira Laundry, Demangan</p>
          </div>
        </div>
      </div>
    </section>
  );
}

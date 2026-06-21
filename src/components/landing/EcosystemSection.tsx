import { Heart, MapPin, Phone, HelpCircle, Star, Sparkles } from 'lucide-react';

interface EcosystemItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  linkText: string;
  color: string;
}

export function EcosystemSection() {
  const items: EcosystemItem[] = [
    {
      title: 'UMKM Asli Yogyakarta',
      description: 'Aira Laundry berkomitmen memajukan perekonomian lokal dengan menyediakan lapangan pekerjaan dan melayani kebutuhan warga Demangan serta mahasiswa di sekitarnya.',
      icon: Heart,
      linkText: 'Tentang Kami',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      title: 'Lokasi Strategis & Mudah Dijangkau',
      description: 'Workshop kami beralamat di Jl. Bimo Kurdo No. 10, Demangan, Kec. Gondokusuman, Kota Yogyakarta. Lokasi kami sangat mudah diakses dari berbagai penjuru kota.',
      icon: MapPin,
      linkText: 'Petunjuk Arah Maps',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Kontak Ibu Aira',
      description: 'Ada pertanyaan seputar noda membandel atau request khusus? Hubungi Ibu Aira langsung di nomor 0857-4399-9911 untuk pelayanan ramah dan cepat.',
      icon: Phone,
      linkText: 'Hubungi via WhatsApp',
      color: 'text-sky-600 bg-sky-50',
    },
    {
      title: 'Layanan Kilat 1 Hari',
      description: 'Butuh pakaian bersih secepatnya? Nikmati layanan Express 1 Hari kami untuk cuci kiloan harian, ideal untuk Anda yang memiliki mobilitas tinggi.',
      icon: Sparkles,
      linkText: 'Lihat Ketentuan',
      color: 'text-pink-600 bg-pink-50',
    },
    {
      title: 'Bahan Tambahan Premium',
      description: 'Setiap cucian menggunakan detergen anti-bakteri, pelembut konsentrat, serta disetrika rapi dengan setrika uap boiler sehingga serat pakaian tetap terjaga.',
      icon: Star,
      linkText: 'Detail Bahan Pencuci',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Tanya Jawab & Bantuan',
      description: 'Kami siap membantu memberikan panduan perawatan untuk jenis kain tertentu seperti sutra, kebaya payet, jas wool, atau jenis sepatu kulit Anda.',
      icon: HelpCircle,
      linkText: 'Hubungi Customer Care',
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <section className="bg-slate-50 py-20 border-b border-slate-100 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Memilih Aira Laundry?
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Kami memadukan pelayanan personal UMKM yang ramah dengan standar kebersihan pencucian yang tinggi untuk setiap pakaian berharga Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => {
            const sectionId = item.title === 'Lokasi Strategis & Mudah Dijangkau' ? 'lokasi' : item.title === 'Kontak Ibu Aira' ? 'kontak' : undefined;
            return (
            <div
              key={item.title}
              id={sectionId}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow scroll-mt-20"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>
              <div>
                <a
                  href="https://wa.me/6285743999911"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{item.linkText}</span>
                  <span className="text-xs">→</span>
                </a>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

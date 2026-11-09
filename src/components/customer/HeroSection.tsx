import React from 'react';
import { ArrowRight, Sparkles, MapPin, Award, Compass } from 'lucide-react';
import { ASSET_IMAGES } from '../../data/mockData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onOpenBranches: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOpenBranches,
}) => {
  return (
    <section id="beranda" className="relative pt-6 pb-20 md:py-24 overflow-hidden">
      {/* Background soft ambient warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFEB] to-[#FAF7F2] -z-10" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-[#C59A6F]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet, clean kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#7C6353]">
              <span>Specialty Coffee Roastery</span>
              <span aria-hidden="true">·</span>
              <span>Tepian Sungai Delta</span>
              <span aria-hidden="true">·</span>
              <span>Sejak 2021</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-6xl font-bold text-[#261912] leading-[1.12] tracking-tight text-balance">
                Menemukan Ketenangan di Setiap Tegukan Tepi Delta
              </h1>
              <p className="text-base sm:text-lg text-[#5A483D] font-normal leading-relaxed max-w-2xl">
                Nikmati aroma biji kopi pilihan nusantara yang disangrai dengan presisi, disajikan di tengah suasana arsitektur hangat dan pemandangan perairan delta yang menyejukkan jiwa.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#FAF7F2] bg-[#261912] hover:bg-[#3D291E] rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
              >
                <span>Lihat Menu Pilihan</span>
                <ArrowRight className="w-4 h-4 text-[#C59A6F]" />
              </button>
              <button
                onClick={onOpenBranches}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#261912] bg-[#EFE9E1] hover:bg-[#E5DDD4] rounded-xl transition-colors border border-[#DDD3C7]"
              >
                <MapPin className="w-4 h-4 text-[#8C7A6B]" />
                <span>Kunjungi 3 Cabang</span>
              </button>
            </div>

            {/* Adjacent Proof Highlights (Quantitative Rigor) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DFD8]">
              <div>
                <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#261912] tabular-nums">
                  100%
                </p>
                <p className="text-xs text-[#7A695D] mt-0.5">Biji Arabika Asli Nusantara</p>
              </div>
              <div>
                <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#261912] tabular-nums">
                  18 Jam
                </p>
                <p className="text-xs text-[#7A695D] mt-0.5">Slow Drip Cold Brew Ekstraksi</p>
              </div>
              <div>
                <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#261912] tabular-nums">
                  3 Lokasi
                </p>
                <p className="text-xs text-[#7A695D] mt-0.5">Tepian Sungai Bersertifikasi</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E0D5CA] bg-[#FAF7F2] aspect-[4/3] lg:aspect-[5/4]">
              <img
                src={ASSET_IMAGES.heroLatte}
                alt="Secangkir kopi latte art Kopi Tepi Delta dengan latar pemandangan sungai"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Subtle scrim for media info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet caption inside image */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#EFE9E1]">Artisanal Swan Cafe Latte</p>
                  <p className="text-[11px] text-[#C4B7AC]">Single Origin Flores Bajawa Roast</p>
                </div>
                <span className="text-xs font-mono font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded border border-white/20">
                  Rp 34.000
                </span>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-5 -left-5 bg-[#FAF7F2] p-4 rounded-xl shadow-lg border border-[#E8DFD8] hidden sm:flex items-center gap-3 max-w-xs">
              <div className="w-10 h-10 rounded-lg bg-[#261912] text-[#C59A6F] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#261912]">Delta Sunset Hour</p>
                <p className="text-[#7A695D]">Setiap 16:30 - 18:30 WIB · Disc 20%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

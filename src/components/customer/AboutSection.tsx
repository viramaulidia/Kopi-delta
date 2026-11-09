import React from 'react';
import { ASSET_IMAGES } from '../../data/mockData';
import { Coffee, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Layout */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md border border-[#E8DFD8] aspect-[4/5] sm:mt-6">
              <img
                src={ASSET_IMAGES.cafeAmbience}
                alt="Suasana interior hangat dan riverside view Kopi Tepi Delta"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-[#E8DFD8] aspect-[4/5] sm:-mt-6">
              <img
                src={ASSET_IMAGES.manualBrew}
                alt="Proses seduh manual V60 barista Kopi Tepi Delta"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Prose Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
              <Coffee className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Filosofi & Kisah Kami</span>
            </div>

            <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#261912] tracking-tight leading-tight">
              Di Mana Aliran Tenang Bertemu Seduhan Terbaik
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5A483D] leading-relaxed">
              <p>
                Lahir dari kerinduan akan ruang singgah yang menenangkan di tengah ritme perkotaan yang cepat, <strong className="font-semibold text-[#261912]">Kopi Tepi Delta</strong> didirikan tepat di tepian pertemuan sungai delta yang teduh.
              </p>
              <p>
                Bagi kami, secangkir kopi bukan sekadar pendorong energi, melainkan medium kontemplasi dan percakapan bermakna. Kami bermitra langsung dengan kelompok petani kopi nusantara dari dataran tinggi Aceh Gayo, Kintamani Bali, hingga Bajawa Flores untuk menghadirkan biji arabika terbaik dengan profil sangrai yang terjaga kemurniannya.
              </p>
              <p>
                Setiap gerai kami didesain dengan filosofi arsitektur bernafas alami: elemen kayu jati, pencahayaan alami jendela besar, serta semilir angin tepian sungai yang menghadirkan rasa hangat bagai di rumah sendiri.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DFD8]">
              <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E8DFD8]">
                <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
                  Direct Trade Etis
                </h4>
                <p className="text-xs text-[#6C5B50] mt-1 leading-normal">
                  Memastikan petani lokal mendapatkan nilai pantas untuk setiap kilogram ceri kopi yang dipanen tangan.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E8DFD8]">
                <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
                  Zero Waste Roastery
                </h4>
                <p className="text-xs text-[#6C5B50] mt-1 leading-normal">
                  Ampas kopi dan kulit ceri (cascara) diolah kembali menjadi pupuk kompos dan minuman teh cascara khas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

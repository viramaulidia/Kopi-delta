import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, Check, Navigation } from 'lucide-react';
import { Branch } from '../../types';

interface BranchSectionProps {
  branches: Branch[];
}

export const BranchSection: React.FC<BranchSectionProps> = ({ branches }) => {
  return (
    <section id="cabang" className="py-20 bg-[#F5EFEB] border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            <MapPin className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>Kunjungi Ruang Singgah Kami</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#261912] tracking-tight">
            Tiga Lokasi Cabang Kopi Tepi Delta
          </h2>
          <p className="text-sm text-[#6C5B50] leading-relaxed">
            Masing-masing cabang memiliki karakter arsitektur tersendiri, namun tetap mengusung suasana tepian air yang tenang dan aroma kopi yang memikat.
          </p>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-[#E0D5CA] p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-5">
                {/* Branch Number & City */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
                  <span className="text-xs font-semibold text-[#8C7A6B]">
                    Cabang 0{index + 1}
                  </span>
                  <span className="text-xs font-medium text-[#261912] bg-[#EFE9E1] px-2.5 py-0.5 rounded">
                    {branch.city}
                  </span>
                </div>

                {/* Name & Address */}
                <div>
                  <h3 className="font-serif-brand text-xl font-bold text-[#261912] leading-snug">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-[#6C5B50] mt-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-[#7A695D] leading-relaxed">
                  {branch.description}
                </p>

                {/* Hours & Phone */}
                <div className="space-y-2 text-xs text-[#6C5B50] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE4DC]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8C7A6B] shrink-0" />
                    <span className="tabular-nums font-medium">{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#8C7A6B] shrink-0" />
                    <span className="tabular-nums">{branch.phone}</span>
                  </div>
                </div>

                {/* Features list */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B] mb-2">
                    Fasilitas & Suasana
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#5A483D]">
                    {branch.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#FAF7F2] bg-[#261912] hover:bg-[#3D291E] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>Petunjuk Arah Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

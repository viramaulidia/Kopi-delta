import React, { useState } from 'react';
import { Tag, Copy, Check, ArrowRight, Clock, Percent } from 'lucide-react';
import { Promo } from '../../types';

interface PromoSectionProps {
  promos: Promo[];
  onApplyPromo: (code: string) => void;
}

export const PromoSection: React.FC<PromoSectionProps> = ({ promos, onApplyPromo }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="promo" className="py-20 bg-[#F5EFEB] border-y border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
              <Tag className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Penawaran Terbatas</span>
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-4xl font-bold text-[#261912] tracking-tight">
              Promo Spesial Kopi Tepi Delta
            </h2>
            <p className="text-sm text-[#6C5B50] leading-relaxed">
              Nikmati racikan kopi terbaik kami dengan penawaran istimewa untuk momen bersantai sore, sarapan pagi, atau kumpul bersama teman.
            </p>
          </div>
          <div className="text-xs text-[#8C7A6B] bg-[#EAE2D8] px-3.5 py-2 rounded-lg self-start md:self-end">
            *Dapat digunakan saat pemesanan langsung maupun online
          </div>
        </div>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border border-[#E0D5CA] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Subtle top accent strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#261912]" />

              <div className="space-y-4">
                {/* Promo Code Chip */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-[#F5EFEB] px-3 py-1.5 rounded-lg border border-[#DDD3C7]">
                    <span className="font-mono text-xs font-bold text-[#261912] tracking-wider">
                      {promo.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(promo.code)}
                      className="text-[#8C7A6B] hover:text-[#261912] transition-colors"
                      title="Salin Kode Promo"
                    >
                      {copiedCode === promo.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] font-medium text-[#8C7A6B] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>s/d {promo.validUntil}</span>
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-[#6C5B50] mt-1.5 leading-relaxed">
                    {promo.discountDescription}
                  </p>
                </div>

                {/* Terms */}
                <div className="pt-2 text-[11px] text-[#8C7A6B] border-t border-[#F2ECE4]">
                  <span>Min. Transaksi: </span>
                  <span className="font-mono font-medium text-[#261912]">
                    Rp {promo.minPurchase.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => onApplyPromo(promo.code)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#261912] bg-[#EFE9E1] hover:bg-[#261912] hover:text-white transition-all flex items-center justify-center gap-1.5 border border-[#DDD3C7]"
                >
                  <span>Gunakan Promo Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

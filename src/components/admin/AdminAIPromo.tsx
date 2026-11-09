import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Plus, Tag, TrendingUp, Layers } from 'lucide-react';
import { Promo } from '../../types';

interface AdminAIPromoProps {
  promos: Promo[];
  onTogglePromo: (promoId: string) => void;
  onAddPromo: (promo: Promo) => void;
}

export const AdminAIPromo: React.FC<AdminAIPromoProps> = ({
  promos,
  onTogglePromo,
  onAddPromo,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const aiPresetIdeas = [
    {
      title: 'Hujan Sore Hangat: Hot Manual Brew + Cinnamon Roll',
      code: 'RAINYW早已',
      cleanCode: 'RAINYBREW',
      discountType: 'fixed' as const,
      discountValue: 12000,
      minPurchase: 45000,
      targetAudience: 'Tamu yang singgah saat hujan sore (14:30 - 17:00)',
      estimatedUplift: '+28% Penjualan Manual Brew',
      rationale: 'Hujan menurunkan pesanan minuman dingin sebesar 42%. Paket ini mengalihkan pesanan ke margin tinggi seduhan manual.',
    },
    {
      title: 'Work From Delta: Free Refill Americano untuk Pembelian Pastry',
      code: 'WORKDELTA',
      cleanCode: 'WORKDELTA',
      discountType: 'fixed' as const,
      discountValue: 15000,
      minPurchase: 55000,
      targetAudience: 'Digital Nomad di sesi pagi (09:00 - 12:00 WIB)',
      estimatedUplift: '+32% Okupansi Meja Pagi',
      rationale: 'Mengisi kapasitas meja kosong sebelum jam makan siang dengan tamu yang memesan kudapan.',
    },
    {
      title: 'Riverside Acoustic Night: Buy 2 Signature Cold Brew Get 1 Pastry',
      code: 'NIGHTPASTRY',
      cleanCode: 'NIGHTPASTRY',
      discountType: 'bundle' as const,
      discountValue: 30000,
      minPurchase: 72000,
      targetAudience: 'Pasangan & grup teman di akhir pekan',
      estimatedUplift: '+22% Basket Size (AOV)',
      rationale: 'Mendorong pembelian ganda minuman signature sekaligus menghabiskan stok pastry harian segar.',
    },
  ];

  const handleApplyPreset = (idea: typeof aiPresetIdeas[0]) => {
    // Check if promo already exists
    const exists = promos.find((p) => p.code === idea.cleanCode);
    if (exists) {
      setSuccessNotice(`Promo ${idea.cleanCode} sudah aktif di website pelanggan.`);
      setTimeout(() => setSuccessNotice(null), 3000);
      return;
    }

    const newPromo: Promo = {
      id: `promo-${Date.now()}`,
      code: idea.cleanCode,
      title: idea.title,
      discountDescription: `Hemat Rp ${idea.discountValue.toLocaleString('id-ID')} dengan minimal pembelian Rp ${idea.minPurchase.toLocaleString('id-ID')}.`,
      discountType: idea.discountType,
      discountValue: idea.discountValue,
      minPurchase: idea.minPurchase,
      validUntil: '31 Desember 2026',
      isActive: true,
      targetAudience: idea.targetAudience,
      estimatedUplift: idea.estimatedUplift,
    };

    onAddPromo(newPromo);
    setSuccessNotice(`Promo "${idea.cleanCode}" berhasil diterbitkan ke Website Pelanggan!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const generatedCode = 'DELTA' + Math.floor(100 + Math.random() * 900);
      const generatedPromo: Promo = {
        id: `promo-${Date.now()}`,
        code: generatedCode,
        title: `Edisi Khusus: ${customPrompt}`,
        discountDescription: `Diskon Rp 15.000 untuk perayaan momen ${customPrompt}.`,
        discountType: 'fixed',
        discountValue: 15000,
        minPurchase: 60000,
        validUntil: '15 Januari 2027',
        isActive: true,
        targetAudience: 'Pelanggan komunitas & penikmat kopi musiman',
        estimatedUplift: '+20% Traksi Komunitas',
      };

      onAddPromo(generatedPromo);
      setIsGenerating(false);
      setCustomPrompt('');
      setSuccessNotice(`AI telah merumuskan dan menerbitkan promo "${generatedCode}" ke Website Pelanggan!`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#261912] text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C59A6F]">
          <Sparkles className="w-4 h-4 text-[#C59A6F]" />
          <span>Mesin Rekomendasi Promosi AI</span>
        </div>
        <h3 className="font-serif-brand text-2xl font-bold text-[#FAF7F2]">
          Optimasi Pendapatan Berdasarkan Celah Waktu & Kebiasaan Tamu
        </h3>
        <p className="text-xs text-[#C4B7AC] leading-relaxed max-w-2xl">
          Sistem menganalisis data penjualan harian untuk menemukan jam sepi dan stok berlebih, kemudian merumuskan paket promosi dengan potensi kenaikan omset tertinggi.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* AI Suggested Campaigns */}
      <div className="space-y-4">
        <h4 className="font-serif-brand text-xl font-bold text-[#261912]">
          Rekomendasi Kampanye Promosi Minggu Ini
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiPresetIdeas.map((idea, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8DFD8] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#261912] bg-[#FAF7F2] px-2.5 py-1 rounded border border-[#DDD3C7]">
                    {idea.cleanCode}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {idea.estimatedUplift}
                  </span>
                </div>

                <h5 className="font-serif-brand text-lg font-bold text-[#261912] leading-snug">
                  {idea.title}
                </h5>

                <div className="space-y-1.5 text-xs text-[#6C5B50]">
                  <p>
                    <strong className="text-[#261912]">Target:</strong> {idea.targetAudience}
                  </p>
                  <p className="text-[#7A695D] italic bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EDE4DC]">
                    &ldquo;{idea.rationale}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(idea)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#261912] hover:bg-[#3D291E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>Terapkan ke Website Pelanggan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom AI Prompt Generator */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="pb-2 border-b border-[#F2ECE4]">
          <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
            Rumuskan Promo Baru dengan Konsep Khusus
          </h4>
          <p className="text-xs text-[#7A695D]">
            Ketikkan tema acara (misal: "Hari Kopi Sedunia", "Paket Musim Hujan", "Komunitas Sepeda Pagi")
          </p>
        </div>

        <form onSubmit={handleGenerateCustom} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Contoh: Paket ngopi sore komunitas fotografi tepi sungai..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#261912]"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E] transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>{isGenerating ? 'Merumuskan Promo...' : 'Generate & Terbitkan Promo'}</span>
          </button>
        </form>
      </div>

      {/* Live Active Promos in Customer App */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
          <div>
            <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
              Status Promo Aktif di Website Pelanggan
            </h4>
            <p className="text-xs text-[#7A695D]">
              Semua promo yang aktif di sini langsung muncul dan dapat digunakan oleh pembeli
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#261912]">
            {promos.filter((p) => p.isActive).length} Aktif
          </span>
        </div>

        <div className="divide-y divide-[#F2ECE4]">
          {promos.map((promo) => (
            <div key={promo.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#261912] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#DDD3C7]">
                    {promo.code}
                  </span>
                  <span className="font-semibold text-[#261912]">{promo.title}</span>
                </div>
                <p className="text-[11px] text-[#7A695D] mt-1">{promo.discountDescription}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onTogglePromo(promo.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    promo.isActive
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

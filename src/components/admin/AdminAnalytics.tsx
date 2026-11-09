import React from 'react';
import { Users, Clock, Coffee, Heart, ArrowUpRight, Award } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const segments = [
    { name: 'Pelanggan Setia (Loyal Regulars)', percentage: 48, count: '142 orang', avgSpend: 'Rp 68.000 / visit', desc: 'Datang 3-4x seminggu, gemar kopi susu aren & cold brew' },
    { name: 'Weekend Riverside Explorers', percentage: 28, count: '82 orang', avgSpend: 'Rp 112.000 / visit', desc: 'Datang bersama keluarga/teman, memesan pastry & makanan gurih' },
    { name: 'Digital Nomads / WFC', percentage: 16, count: '47 orang', avgSpend: 'Rp 54.000 / visit', desc: 'Duduk 3-5 jam di meja dengan colokan, memesan manual brew & latte' },
    { name: 'Pelanggan Baru (First Timer)', percentage: 8, count: '24 orang', avgSpend: 'Rp 42.000 / visit', desc: 'Pertama kali berkunjung dari rekomendasi media sosial' },
  ];

  const peakHours = [
    { time: '07:00 - 09:00', label: 'Morning Commuter Rush', traffic: 72, note: 'Takeaway kopi susu & espresso' },
    { time: '09:00 - 12:00', label: 'Work From Cafe (WFC)', traffic: 65, note: 'Manual brew V60 & meeting pods' },
    { time: '12:00 - 14:00', label: 'Lunch Break & Pastry', traffic: 58, note: 'Truffle fries & light meal' },
    { time: '14:00 - 16:30', label: 'Afternoon Slump', traffic: 42, note: 'Jam sepi (target promo khusus)' },
    { time: '16:30 - 19:30', label: 'Delta Sunset Hour (Peak)', traffic: 98, note: 'Puncak okupansi outdoor riverside' },
    { time: '19:30 - 23:00', label: 'Night Hangout & Chill', traffic: 84, note: 'Live acoustic session & mocktail' },
  ];

  const tastePreferences = [
    { category: 'Profil Sangrai (Roast)', optionA: 'Medium Roast (Caramel, Nutty)', pctA: 64, optionB: 'Light Roast (Floral, Fruity)', pctB: 36 },
    { category: 'Pilihan Susu (Milk Choice)', optionA: 'Fresh Milk Sapi Lokal', pctA: 68, optionB: 'Plant-Based (Oat & Almond Milk)', pctB: 32 },
    { category: 'Tingkat Kemanisan (Sweetness)', optionA: 'Less Sugar (50%) & Gula Aren', pctA: 59, optionB: 'Normal Sugar / Sirup', pctB: 41 },
    { category: 'Format Sajian', optionA: 'Iced / Cold Drink', pctA: 78, optionB: 'Hot Ceramic Cup', pctB: 22 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
          <span className="text-xs text-[#8C7A6B]">Tingkat Retensi Pelanggan (30 Hari)</span>
          <p className="font-mono text-3xl font-bold text-[#261912] tabular-nums mt-1">
            68.4%
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            +5.2% dibanding bulan lalu
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
          <span className="text-xs text-[#8C7A6B]">Customer Lifetime Value (CLV Rata-rata)</span>
          <p className="font-mono text-3xl font-bold text-[#261912] tabular-nums mt-1">
            Rp 740.000
          </p>
          <p className="text-xs text-[#7A695D] mt-1">
            Rata-rata 14.2 kunjungan per pelanggan aktif
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
          <span className="text-xs text-[#8C7A6B]">NPS (Net Promoter Score) Rasa & Suasana</span>
          <p className="font-mono text-3xl font-bold text-[#261912] tabular-nums mt-1">
            +84
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            Kategori Excellent (Survei 320 tamu)
          </p>
        </div>
      </div>

      {/* Customer Segmentation Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-5">
        <div className="pb-3 border-b border-[#F2ECE4]">
          <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
            Segmentasi Kohort Pelanggan Kopi Tepi Delta
          </h3>
          <p className="text-xs text-[#7A695D]">
            Klasifikasi berdasarkan frekuensi kunjungan dan pola belanja mingguan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((seg, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#261912]">{seg.name}</span>
                <span className="font-mono text-xs font-bold text-[#261912] tabular-nums">
                  {seg.percentage}%
                </span>
              </div>
              <div className="w-full bg-[#E0D5CA] h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${seg.percentage}%` }}
                  className="bg-[#261912] h-full rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] pt-1">
                <span>{seg.count}</span>
                <span className="font-mono font-medium text-[#261912]">{seg.avgSpend}</span>
              </div>
              <p className="text-[11px] text-[#7A695D] italic">{seg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Heat Map */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Peta Jam Sibuk & Okupansi Meja (Peak Hours)
            </h3>
            <p className="text-xs text-[#7A695D]">
              Intensitas kedatangan tamu sepanjang jam operasional 07:00 – 23:00 WIB
            </p>
          </div>
          <span className="text-xs text-[#8C7A6B] font-mono">Berdasarkan data 30 hari</span>
        </div>

        <div className="space-y-3">
          {peakHours.map((ph, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-28 font-mono text-xs font-semibold text-[#261912] tabular-nums shrink-0">
                {ph.time}
              </div>
              <div className="flex-1 bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E8DFD8] flex items-center gap-3">
                <div className="w-full bg-[#E5DDD4] h-2.5 rounded-full overflow-hidden flex-1">
                  <div
                    style={{ width: `${ph.traffic}%` }}
                    className={`h-full rounded-full transition-all ${
                      ph.traffic >= 90
                        ? 'bg-[#C59A6F]'
                        : ph.traffic >= 65
                        ? 'bg-[#261912]'
                        : 'bg-[#8C7A6B]'
                    }`}
                  />
                </div>
                <span className="w-12 text-right font-mono text-xs font-bold text-[#261912] tabular-nums shrink-0">
                  {ph.traffic}%
                </span>
                <span className="text-[11px] text-[#7A695D] hidden md:inline shrink-0 w-60 text-right">
                  {ph.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flavor & Roast Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-5">
        <div className="pb-3 border-b border-[#F2ECE4]">
          <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
            Preferensi Rasa & Kebiasaan Konsumsi Tamu
          </h3>
          <p className="text-xs text-[#7A695D]">
            Wawasan untuk menyelaraskan kurasi biji sangrai dan ketersediaan bahan baku
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tastePreferences.map((tp, idx) => (
            <div key={idx} className="space-y-2 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
              <span className="text-xs font-semibold text-[#261912] block">
                {tp.category}
              </span>
              <div className="flex items-center justify-between text-xs text-[#5A483D]">
                <span>{tp.optionA}</span>
                <span className="font-mono font-bold tabular-nums">{tp.pctA}%</span>
              </div>
              <div className="w-full bg-[#E0D5CA] h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${tp.pctA}%` }} className="bg-[#261912] h-full" />
                <div style={{ width: `${tp.pctB}%` }} className="bg-[#C59A6F] h-full" />
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A695D]">
                <span>{tp.optionB}</span>
                <span className="font-mono font-bold tabular-nums">{tp.pctB}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

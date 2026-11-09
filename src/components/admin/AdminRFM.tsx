import React, { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  Repeat,
  DollarSign,
  Award,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Send,
  Coffee,
} from 'lucide-react';
import { Order, Customer, RFMCustomer, RFMSegmentType } from '../../types';
import { calculateRFM } from '../../utils/rfmAnalytics';

interface AdminRFMProps {
  orders: Order[];
  customers: Customer[];
  adminWhatsappPhone: string;
  onNavigateToContextual?: () => void;
}

export const AdminRFM: React.FC<AdminRFMProps> = ({
  orders,
  customers,
  adminWhatsappPhone,
  onNavigateToContextual,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessageModal, setActiveMessageModal] = useState<RFMCustomer | null>(null);

  // Calculate RFM dynamically from the exact same orders and customers data
  const { rfmCustomers, segmentSummaries, totalMonetary, avgFrequency, avgMonetary } =
    useMemo(() => {
      return calculateRFM(orders, customers, '2026-11-05');
    }, [orders, customers]);

  // Filtered RFM customer list
  const filteredCustomers = useMemo(() => {
    return rfmCustomers.filter((c) => {
      const matchSegment = selectedSegment === 'Semua' || c.segment === selectedSegment;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.favoriteMenu.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSegment && matchSearch;
    });
  }, [rfmCustomers, selectedSegment, searchQuery]);

  // WhatsApp personalized message generator based on RFM segment
  const generatePersonalizedMessage = (cust: RFMCustomer) => {
    let msg = `Halo Kak ${cust.name}! `;
    switch (cust.segment) {
      case 'Pelanggan Loyal':
        msg += `Terima kasih banyak telah menjadi sahabat setia Kopi Tepi Delta (${cust.frequency}x berkunjung!). Sebagai apresiasi loyalitas Kakak, kami mengundang Kakak untuk menikmati *Free Upsize* dan cicipan gratis biji sangrai baru di cabang ${cust.preferredBranch}. Tunjukkan pesan ini ke barista kami ya! ✨`;
        break;
      case 'Pelanggan Potensial':
        msg += `Terima kasih sering mampir ke Kopi Tepi Delta! Nikmati *Diskon Spesial 20%* untuk pesanan menu favorit Kakak (${cust.favoriteMenu}) pada kunjungan berikutnya di ${cust.preferredBranch}. Sampai jumpa di tepian delta! ☕`;
        break;
      case 'Pelanggan Baru':
        msg += `Terima kasih telah berkunjung ke Kopi Tepi Delta beberapa hari lalu! Kami ingin memberikan *Voucher Potongan Rp 15.000* untuk kunjungan kedua Kakak. Yuk nikmati suasana sore sungai yang tenang lagi bersama kami! 🌿`;
        break;
      case 'Perlu Perhatian':
        msg += `Kami rindu kehadiran Kakak di Kopi Tepi Delta! Sudah sekitar ${cust.recencyDays} hari Kakak belum mampir. Khusus untuk Kakak, nikmati *Gratis 1 Almond Croissant* untuk setiap pembelian menu kopi di cabang ${cust.preferredBranch}. Ditunggu ya Kak! 🥐☕`;
        break;
      case 'Beresiko Churn':
        msg += `Sudah lama sekali tidak berjumpa di Kopi Tepi Delta! Kami punya banyak racikan menu baru yang menanti Kakak. Nikmati *Diskon Spesial 25%* dengan kode *WELCOMEBACKDELTA*. Mari kembali bersantai di tepian sungai! 🌊`;
        break;
    }
    return encodeURIComponent(msg);
  };

  return (
    <div className="space-y-8">
      {/* Conceptual Header Banner */}
      <div className="bg-[#1C120C] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl shadow-xl border border-[#3A261A] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C59A6F]">
              <Sparkles className="w-4 h-4 text-[#C59A6F]" />
              <span>Metodologi Data-Driven Marketing</span>
              <span className="font-mono bg-[#2E1E15] px-2 py-0.5 rounded text-white text-[10px]">
                Data Simulasi ({orders.length} Transaksi)
              </span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
              Analisis Segmentasi Pelanggan RFM
            </h2>
            <p className="text-xs text-[#C4B7AC] leading-relaxed max-w-2xl">
              Metode RFM mengelompokkan pelanggan berdasarkan 3 pilar perilaku nyata: <strong>Recency</strong> (kapan terakhir bertransaksi), <strong>Frequency</strong> (seberapa sering bertransaksi), dan <strong>Monetary</strong> (total nominal uang yang dibelanjakan).
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="bg-[#2E1E15] p-4 rounded-2xl border border-[#4D3222] text-xs space-y-1.5">
              <div className="flex justify-between gap-4">
                <span className="text-[#8C7A6B]">Total Database:</span>
                <span className="font-mono font-bold text-white tabular-nums">{rfmCustomers.length} Pelanggan</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#8C7A6B]">Rata-rata Kunjungan:</span>
                <span className="font-mono font-bold text-white tabular-nums">{avgFrequency}x / orang</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#8C7A6B]">Rata-rata Belanja:</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">Rp {avgMonetary.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {onNavigateToContextual && (
              <button
                onClick={onNavigateToContextual}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#C59A6F] text-[#1C120C] text-xs font-bold hover:bg-[#D5AA7F] transition-colors shadow-xs cursor-pointer"
              >
                <span>Buka Contextual Marketing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Pillars Explanatory Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#332117] text-xs">
          <div className="flex items-start gap-3 bg-[#2A1B12] p-3.5 rounded-xl border border-[#442E20]">
            <Clock className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">R — Recency (Kebaruan)</p>
              <p className="text-[11px] text-[#A8988C] mt-0.5">
                Kapan terakhir pelanggan bertransaksi. Pelanggan yang baru saja datang lebih berpeluang merespons promosi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#2A1B12] p-3.5 rounded-xl border border-[#442E20]">
            <Repeat className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">F — Frequency (Frekuensi)</p>
              <p className="text-[11px] text-[#A8988C] mt-0.5">
                Seberapa sering pelanggan datang bertransaksi. Menunjukkan tingkat keterikatan dan kebiasaan ngopi di cafe.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#2A1B12] p-3.5 rounded-xl border border-[#442E20]">
            <DollarSign className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">M — Monetary (Moneter)</p>
              <p className="text-[11px] text-[#A8988C] mt-0.5">
                Total uang yang dibelanjakan pelanggan. Mengidentifikasi pembeli bernilai tinggi (*high-value spenders*).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 RFM SEGMENT CARDS (Summary & Strategy Playbooks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
            Distribusi Segmen Pelanggan & Strategi Pemasaran
          </h3>
          <span className="text-xs text-[#8C7A6B] font-mono">
            5 Segmen Perilaku Konsumen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {segmentSummaries.map((sum, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedSegment(selectedSegment === sum.segment ? 'Semua' : sum.segment)}
              className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                selectedSegment === sum.segment
                  ? 'border-[#261912] ring-2 ring-[#261912]/20'
                  : 'border-[#E8DFD8]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${sum.badgeColor}`}>
                    {sum.segment}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#261912] tabular-nums">
                    {sum.percentage}%
                  </span>
                </div>

                <div>
                  <p className="font-mono text-2xl font-bold text-[#261912] tabular-nums">
                    {sum.count} <span className="text-xs font-normal text-[#8C7A6B]">orang</span>
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 tabular-nums mt-0.5">
                    Rp {sum.totalMonetary.toLocaleString('id-ID')}
                  </p>
                </div>

                <p className="text-[11px] text-[#7A695D] leading-relaxed">
                  {sum.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F2ECE4]">
                <p className="text-[10px] font-semibold text-[#8C7A6B] uppercase mb-1">
                  Aksi Pemasaran:
                </p>
                <p className="text-[11px] text-[#261912] font-medium leading-normal bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE4DC]">
                  {sum.marketingAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFM CUSTOMERS TABLE WITH FILTER & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden space-y-4">
        {/* Table Header & Segment Filter */}
        <div className="p-6 border-b border-[#F2ECE4] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Tabel Matriks RFM Pelanggan Kopi Tepi Delta
            </h3>
            <p className="text-xs text-[#7A695D]">
              Menampilkan {filteredCustomers.length} pelanggan ({selectedSegment === 'Semua' ? 'Seluruh Segmen' : `Filter: ${selectedSegment}`})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, WA, menu..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#261912] focus:outline-none"
              />
            </div>

            {/* Segment Selector Tabs */}
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
            >
              <option value="Semua">Semua Segmen ({rfmCustomers.length})</option>
              <option value="Pelanggan Loyal">Pelanggan Loyal</option>
              <option value="Pelanggan Potensial">Pelanggan Potensial</option>
              <option value="Pelanggan Baru">Pelanggan Baru</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
              <option value="Beresiko Churn">Beresiko Churn</option>
            </select>
          </div>
        </div>

        {/* Detailed RFM Table */}
        <div className="overflow-x-auto px-6 pb-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4 text-center">Recency (R)</th>
                <th className="py-3 px-4 text-center">Frequency (F)</th>
                <th className="py-3 px-4 text-right">Monetary (M)</th>
                <th className="py-3 px-4 text-center">Skor RFM</th>
                <th className="py-3 px-4">Segmen Konsumen</th>
                <th className="py-3 px-4">Menu & Cabang Favorit</th>
                <th className="py-3 px-4 text-center">Tindakan Promosi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C7A6B]">
                    Tidak ada pelanggan yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const segColor =
                    cust.segment === 'Pelanggan Loyal'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : cust.segment === 'Pelanggan Potensial'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : cust.segment === 'Pelanggan Baru'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : cust.segment === 'Perlu Perhatian'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-rose-100 text-rose-900 border-rose-300';

                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Pelanggan */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#261912]">{cust.name}</div>
                        <div className="text-[10px] font-mono text-[#8C7A6B]">{cust.phone}</div>
                      </td>

                      {/* Recency */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-mono font-bold text-[#261912] tabular-nums">
                          {cust.recencyDays} hari lalu
                        </div>
                        <div className="text-[10px] text-[#8C7A6B] tabular-nums font-mono">
                          {cust.lastOrderDate}
                        </div>
                      </td>

                      {/* Frequency */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#261912] tabular-nums">
                        {cust.frequency}x order
                      </td>

                      {/* Monetary */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#261912] tabular-nums whitespace-nowrap">
                        Rp {cust.monetary.toLocaleString('id-ID')}
                      </td>

                      {/* Skor RFM */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-xs font-bold bg-[#FAF7F2] border border-[#DDD3C7] px-2 py-0.5 rounded text-[#261912]">
                          {cust.rScore}-{cust.fScore}-{cust.mScore}
                        </span>
                      </td>

                      {/* Segmen Konsumen */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${segColor}`}>
                          {cust.segment}
                        </span>
                      </td>

                      {/* Menu & Cabang Favorit */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#261912] truncate max-w-[150px]">
                          {cust.favoriteMenu}
                        </div>
                        <div className="text-[10px] text-[#8C7A6B] truncate max-w-[150px]">
                          {cust.preferredBranch}
                        </div>
                      </td>

                      {/* Tindakan Promosi */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveMessageModal(cust)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD3C7] text-[11px] font-medium text-[#261912] hover:bg-[#261912] hover:text-white transition-colors whitespace-nowrap"
                          title="Lihat pesan promo WhatsApp personal"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Kirim Promo</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personalized WhatsApp Campaign Preview Modal */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8DFD8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD8]">
              <div>
                <span className="text-[10px] font-mono text-[#8C7A6B] uppercase">Kampanye Personal Data-Driven</span>
                <h4 className="font-serif-brand text-xl font-bold text-[#261912]">
                  Pesan Promo untuk {activeMessageModal.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveMessageModal(null)}
                className="p-1 rounded-lg hover:bg-[#EFE9E1]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-[#E8DFD8]">
                <div>
                  <span className="text-[#8C7A6B] block">Segmen RFM:</span>
                  <span className="font-bold text-[#261912]">{activeMessageModal.segment}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Skor RFM:</span>
                  <span className="font-mono font-bold text-[#261912]">{activeMessageModal.rfmScore} (R{activeMessageModal.rScore}-F{activeMessageModal.fScore}-M{activeMessageModal.mScore})</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Minuman Favorit:</span>
                  <span className="text-[#261912]">{activeMessageModal.favoriteMenu}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Cabang Terakhir:</span>
                  <span className="text-[#261912]">{activeMessageModal.preferredBranch}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#261912] mb-1.5">
                  Format Pesan WhatsApp yang Telah Dioptimasi untuk Segmen Ini:
                </label>
                <div className="bg-[#EFE9E1] p-4 rounded-xl border border-[#DDD3C7] text-xs font-sans text-[#261912] leading-relaxed whitespace-pre-wrap">
                  {decodeURIComponent(generatePersonalizedMessage(activeMessageModal))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveMessageModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDD3C7] bg-white text-[#5A483D] text-xs font-semibold"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${activeMessageModal.phone.replace(/\D/g, '')}?text=${generatePersonalizedMessage(activeMessageModal)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka di WhatsApp Pelanggan</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

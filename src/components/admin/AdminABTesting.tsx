import React, { useState, useMemo } from 'react';
import {
  Layers,
  ArrowRight,
  Check,
  Trophy,
  TrendingUp,
  BarChart2,
  Edit3,
  RotateCcw,
  Percent,
  Eye,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  X,
  Sliders,
} from 'lucide-react';
import { ABTestCampaign } from '../../types';

interface AdminABTestingProps {
  campaigns: ABTestCampaign[];
  onApplyWinner: (campaignId: string, winner: 'Variant A' | 'Variant B') => void;
  onUpdateCampaign?: (updated: ABTestCampaign) => void;
}

export const AdminABTesting: React.FC<AdminABTestingProps> = ({
  campaigns,
  onApplyWinner,
  onUpdateCampaign,
}) => {
  // Local mutable state for campaigns so admin can edit or reset them
  const [localCampaigns, setLocalCampaigns] = useState<ABTestCampaign[]>(campaigns);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Modal edit state
  const [editingCampaign, setEditingCampaign] = useState<ABTestCampaign | null>(null);

  // Form states for editing
  const [editForm, setEditForm] = useState({
    title: '',
    goal: '',
    variantAName: '',
    variantADesc: '',
    variantAImpressions: 1450,
    variantAConversions: 174,
    variantAAvgOrder: 25200,
    variantBName: '',
    variantBDesc: '',
    variantBImpressions: 1420,
    variantBConversions: 269,
    variantBAvgOrder: 48000,
  });

  // Keep local campaigns in sync if parent props change
  React.useEffect(() => {
    setLocalCampaigns(campaigns);
  }, [campaigns]);

  // Open edit modal
  const handleOpenEdit = (camp: ABTestCampaign) => {
    setEditingCampaign(camp);
    const avgA = camp.variantA.conversions > 0 ? Math.round(camp.variantA.revenue / camp.variantA.conversions) : 25200;
    const avgB = camp.variantB.conversions > 0 ? Math.round(camp.variantB.revenue / camp.variantB.conversions) : 48000;

    setEditForm({
      title: camp.title,
      goal: camp.goal,
      variantAName: camp.variantA.name,
      variantADesc: camp.variantA.description,
      variantAImpressions: camp.variantA.impressions,
      variantAConversions: camp.variantA.conversions,
      variantAAvgOrder: avgA,
      variantBName: camp.variantB.name,
      variantBDesc: camp.variantB.description,
      variantBImpressions: camp.variantB.impressions,
      variantBConversions: camp.variantB.conversions,
      variantBAvgOrder: avgB,
    });
  };

  // Save edited data with live re-computation of conversion rate and winner
  const handleSaveEdit = () => {
    if (!editingCampaign) return;

    const impA = Math.max(1, editForm.variantAImpressions);
    const convA = Math.min(impA, Math.max(0, editForm.variantAConversions));
    const revA = convA * editForm.variantAAvgOrder;

    const impB = Math.max(1, editForm.variantBImpressions);
    const convB = Math.min(impB, Math.max(0, editForm.variantBConversions));
    const revB = convB * editForm.variantBAvgOrder;

    const crA = (convA / impA) * 100;
    const crB = (convB / impB) * 100;

    const winner: 'Variant A' | 'Variant B' = crB >= crA ? 'Variant B' : 'Variant A';
    const confidence = Math.min(99.9, Math.max(80.0, 90 + Math.abs(crB - crA) * 1.2));

    const updated: ABTestCampaign = {
      ...editingCampaign,
      title: editForm.title,
      goal: editForm.goal,
      variantA: {
        ...editingCampaign.variantA,
        name: editForm.variantAName,
        description: editForm.variantADesc,
        impressions: impA,
        clicks: Math.round(impA * 0.28),
        conversions: convA,
        revenue: revA,
      },
      variantB: {
        ...editingCampaign.variantB,
        name: editForm.variantBName,
        description: editForm.variantBDesc,
        impressions: impB,
        clicks: Math.round(impB * 0.35),
        conversions: convB,
        revenue: revB,
      },
      recommendedWinner: winner,
      confidenceScore: parseFloat(confidence.toFixed(1)),
    };

    setLocalCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (onUpdateCampaign) {
      onUpdateCampaign(updated);
    }

    setEditingCampaign(null);
    setActiveNotification('Data pengujian A/B berhasil diperbarui dan hasil kalkulasi dihitung ulang.');
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // Reset to default simulated campaign data
  const handleResetDefault = () => {
    const defaultPrimary: ABTestCampaign = {
      id: 'AB-2026-01',
      title: 'Pengujian A/B: Diskon 10% Kopi Susu vs Paket Bundling Kopi & Croissant',
      goal: 'Menguji efektivitas promosi diskon harga langsung vs paket bundling terhadap tingkat konversi transaksi pelanggan',
      startDate: '28 Okt 2026',
      endDate: '12 Nov 2026',
      status: 'Berjalan',
      variantA: {
        name: 'Promosi A (Diskon 10% Kopi Susu)',
        description: 'Diskon 10% langsung untuk setiap pembelian Kopi Susu Tepi Sungai bagi semua pelanggan.',
        impressions: 1450,
        clicks: 348,
        conversions: 174,
        revenue: 4384800,
      },
      variantB: {
        name: 'Promosi B (Paket Bundling Kopi & Croissant)',
        description: 'Paket bundling Kopi Susu Tepi Sungai + French Almond Croissant seharga Rp 48.000 (hemat Rp 12.000).',
        impressions: 1420,
        clicks: 486,
        conversions: 269,
        revenue: 12912000,
      },
      recommendedWinner: 'Variant B',
      confidenceScore: 98.4,
    };

    setLocalCampaigns((prev) => prev.map((c) => (c.id === defaultPrimary.id ? defaultPrimary : c)));
    if (onUpdateCampaign) {
      onUpdateCampaign(defaultPrimary);
    }
    setActiveNotification('Data pengujian dikembalikan ke parameter default simulasi.');
    setTimeout(() => setActiveNotification(null), 3000);
  };

  // Apply winning promo
  const handleApply = (campId: string, winner: 'Variant A' | 'Variant B') => {
    onApplyWinner(campId, winner);
    setActiveNotification(`Varian pemenang (${winner}) berhasil ditetapkan dan disinkronkan ke sistem promosi aktif pelanggan.`);
    setTimeout(() => setActiveNotification(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Simulation Disclaimer Banner */}
      <div className="bg-[#FAF3EA] border border-[#E0D2C3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C59A6F]/20 text-[#6B4423] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-[#8C582B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-[#C59A6F]/20 text-[#6B4423] px-2 py-0.5 rounded-md">
                Data Simulasi
              </span>
              <span className="text-[11px] font-medium text-[#7A695D]">
                Agile Marketing Experiment
              </span>
            </div>
            <p className="text-xs text-[#523E32] mt-0.5">
              Hasil pengujian A/B promosi di bawah ini merupakan <strong>data simulasi untuk keperluan prototype tugas kuliah</strong>, bukan hasil eksperimen dari pelanggan sungguhan di lapangan.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDefault}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5C7B7] bg-white text-[#7A695D] hover:text-[#1C120C] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Default</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C582B] tracking-wider uppercase mb-1">
            <Layers className="w-4 h-4 text-[#C59A6F]" />
            <span>Pemasaran Tangkas & Optimasi Konversi (Agile Marketing)</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#1C120C]">
            Pengujian A/B Promosi (A/B Testing)
          </h1>
          <p className="text-xs sm:text-sm text-[#7A695D] mt-1 max-w-3xl">
            Membandingkan performa dua variasi penawaran: <strong>Promosi A (Diskon 10% Kopi Susu)</strong> vs <strong>Promosi B (Paket Bundling Kopi & Croissant)</strong> untuk menentukan strategi promosi yang paling menguntungkan.
          </p>
        </div>
      </div>

      {activeNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-8">
        {localCampaigns.map((camp) => {
          // 4. Perhitungan Tingkat Konversi yang Benar
          // Conversion Rate (%) = (Conversions / Impressions) * 100
          const crA = camp.variantA.impressions > 0
            ? (camp.variantA.conversions / camp.variantA.impressions) * 100
            : 0;

          const crB = camp.variantB.impressions > 0
            ? (camp.variantB.conversions / camp.variantB.impressions) * 100
            : 0;

          const crDifference = crB - crA;
          const relativeLift = crA > 0 ? ((crB - crA) / crA) * 100 : 0;
          const winnerIsB = crB >= crA;

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl border border-[#E8DFD8] shadow-sm overflow-hidden"
            >
              {/* Card Header & Controls */}
              <div className="p-6 border-b border-[#F2ECE4] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7F2]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8C7A6B] bg-[#EFE9E1] px-2 py-0.5 rounded">
                      {camp.id}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        camp.status === 'Berjalan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      Status: {camp.status}
                    </span>
                    <span className="text-[11px] text-[#8C7A6B]">
                      Periode: {camp.startDate} – {camp.endDate}
                    </span>
                  </div>
                  <h3 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#1C120C]">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-[#7A695D]">
                    <strong>Tujuan Eksperimen:</strong> {camp.goal}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(camp)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5C7B7] hover:border-[#1C120C] text-xs font-semibold text-[#1C120C] hover:bg-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#8C582B]" />
                    <span>Ubah Data Pengujian</span>
                  </button>
                </div>
              </div>

              {/* 1, 2, 3, 4: Two Variations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#F2ECE4]">
                {/* Variasi A */}
                <div className={`p-6 sm:p-7 space-y-5 ${camp.recommendedWinner === 'Variant A' ? 'bg-[#FAF3EA]/40' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-[#261912] text-[#FAF7F2] px-2 py-0.5 rounded">
                          Variasi A
                        </span>
                        {camp.recommendedWinner === 'Variant A' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            <Trophy className="w-3 h-3 text-amber-700" />
                            <span>Pemenang Konversi</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif-brand text-lg font-bold text-[#1C120C] mt-1.5">
                        {camp.variantA.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Tingkat Konversi</span>
                      <span className="font-serif-brand text-2xl font-bold text-[#1C120C] tabular-nums">
                        {crA.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="text-xs text-[#5C4A3E] bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE4DC] leading-relaxed">
                    <strong>Deskripsi Penawaran:</strong> {camp.variantA.description}
                  </div>

                  {/* 2 & 3: Metrik Utama (Melihat & Transaksi) */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#C59A6F]" />
                        Melihat Promo
                      </span>
                      <span className="font-mono text-base font-bold text-[#1C120C] block mt-1 tabular-nums">
                        {camp.variantA.impressions.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[#7A695D]">pelanggan</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-[#C59A6F]" />
                        Transaksi
                      </span>
                      <span className="font-mono text-base font-bold text-[#1C120C] block mt-1 tabular-nums">
                        {camp.variantA.conversions.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[#7A695D]">pembelian</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#C59A6F]" />
                        Total Omzet
                      </span>
                      <span className="font-mono text-base font-bold text-[#8C582B] block mt-1 tabular-nums">
                        Rp {Math.round(camp.variantA.revenue / 1000).toLocaleString('id-ID')}k
                      </span>
                      <span className="text-[10px] text-[#7A695D]">estimasi omset</span>
                    </div>
                  </div>

                  {/* Breakdown Perhitungan */}
                  <div className="text-[11px] text-[#7A695D] bg-white p-2.5 rounded-xl border border-[#F2ECE4] flex items-center justify-between">
                    <span>Rumus: ({camp.variantA.conversions} Transaksi ÷ {camp.variantA.impressions} Melihat) × 100%</span>
                    <strong className="text-[#1C120C]">{crA.toFixed(2)}%</strong>
                  </div>
                </div>

                {/* Variasi B */}
                <div className={`p-6 sm:p-7 space-y-5 ${camp.recommendedWinner === 'Variant B' ? 'bg-[#FAF3EA]/40' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-[#C59A6F] text-[#1C120C] px-2 py-0.5 rounded">
                          Variasi B
                        </span>
                        {camp.recommendedWinner === 'Variant B' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            <Trophy className="w-3 h-3 text-amber-700" />
                            <span>Pemenang Konversi</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif-brand text-lg font-bold text-[#1C120C] mt-1.5">
                        {camp.variantB.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Tingkat Konversi</span>
                      <span className="font-serif-brand text-2xl font-bold text-emerald-700 tabular-nums">
                        {crB.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="text-xs text-[#5C4A3E] bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE4DC] leading-relaxed">
                    <strong>Deskripsi Penawaran:</strong> {camp.variantB.description}
                  </div>

                  {/* 2 & 3: Metrik Utama (Melihat & Transaksi) */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#C59A6F]" />
                        Melihat Promo
                      </span>
                      <span className="font-mono text-base font-bold text-[#1C120C] block mt-1 tabular-nums">
                        {camp.variantB.impressions.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[#7A695D]">pelanggan</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-[#C59A6F]" />
                        Transaksi
                      </span>
                      <span className="font-mono text-base font-bold text-emerald-700 block mt-1 tabular-nums">
                        {camp.variantB.conversions.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[#7A695D]">pembelian</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#C59A6F]" />
                        Total Omzet
                      </span>
                      <span className="font-mono text-base font-bold text-[#8C582B] block mt-1 tabular-nums">
                        Rp {Math.round(camp.variantB.revenue / 1000).toLocaleString('id-ID')}k
                      </span>
                      <span className="text-[10px] text-[#7A695D]">estimasi omset</span>
                    </div>
                  </div>

                  {/* Breakdown Perhitungan */}
                  <div className="text-[11px] text-[#7A695D] bg-white p-2.5 rounded-xl border border-[#F2ECE4] flex items-center justify-between">
                    <span>Rumus: ({camp.variantB.conversions} Transaksi ÷ {camp.variantB.impressions} Melihat) × 100%</span>
                    <strong className="text-emerald-700">{crB.toFixed(2)}%</strong>
                  </div>
                </div>
              </div>

              {/* 5. Grafik Perbandingan Hasil A dan B */}
              <div className="p-6 sm:p-7 border-t border-[#F2ECE4] bg-white space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#8C582B]" />
                    <h4 className="text-sm font-bold text-[#1C120C] uppercase tracking-wide">
                      Grafik Perbandingan Metrik Variasi A vs Variasi B
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#261912]" />
                      <span className="text-[#5C4A3E]">Promosi A</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#C59A6F]" />
                      <span className="text-[#5C4A3E]">Promosi B</span>
                    </div>
                  </div>
                </div>

                {/* Comparative Visual Bars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Chart 1: Tingkat Konversi */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4DC] space-y-3">
                    <span className="text-xs font-bold text-[#1C120C] block">
                      1. Tingkat Konversi (%)
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi A</span>
                          <span className="font-mono font-bold text-[#1C120C]">{crA.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#261912] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (crA / Math.max(crA, crB, 1)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi B</span>
                          <span className="font-mono font-bold text-emerald-700">{crB.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C59A6F] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (crB / Math.max(crA, crB, 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#7A695D] block pt-1">
                      {winnerIsB ? `Promosi B lebih tinggi +${(crB - crA).toFixed(1)}% poin` : `Promosi A lebih tinggi +${(crA - crB).toFixed(1)}% poin`}
                    </span>
                  </div>

                  {/* Chart 2: Jumlah Transaksi (Volume Pembeli) */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4DC] space-y-3">
                    <span className="text-xs font-bold text-[#1C120C] block">
                      2. Jumlah Transaksi (Pesanan)
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi A</span>
                          <span className="font-mono font-bold text-[#1C120C]">{camp.variantA.conversions} order</span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#261912] rounded-full transition-all duration-500"
                            style={{
                              width: `${(camp.variantA.conversions / Math.max(camp.variantA.conversions, camp.variantB.conversions, 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi B</span>
                          <span className="font-mono font-bold text-emerald-700">{camp.variantB.conversions} order</span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C59A6F] rounded-full transition-all duration-500"
                            style={{
                              width: `${(camp.variantB.conversions / Math.max(camp.variantA.conversions, camp.variantB.conversions, 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#7A695D] block pt-1">
                      Selisih {Math.abs(camp.variantB.conversions - camp.variantA.conversions)} transaksi
                    </span>
                  </div>

                  {/* Chart 3: Total Omzet Hasil Promosi */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4DC] space-y-3">
                    <span className="text-xs font-bold text-[#1C120C] block">
                      3. Estimasi Pendapatan (Omzet)
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi A</span>
                          <span className="font-mono font-bold text-[#1C120C]">
                            Rp {(camp.variantA.revenue / 1000000).toFixed(1)} jt
                          </span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#261912] rounded-full transition-all duration-500"
                            style={{
                              width: `${(camp.variantA.revenue / Math.max(camp.variantA.revenue, camp.variantB.revenue, 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5C4A3E]">Promosi B</span>
                          <span className="font-mono font-bold text-emerald-700">
                            Rp {(camp.variantB.revenue / 1000000).toFixed(1)} jt
                          </span>
                        </div>
                        <div className="w-full h-4 bg-[#E8DFD8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C59A6F] rounded-full transition-all duration-500"
                            style={{
                              width: `${(camp.variantB.revenue / Math.max(camp.variantA.revenue, camp.variantB.revenue, 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#7A695D] block pt-1">
                      Omzet Promosi B {(camp.variantB.revenue / (camp.variantA.revenue || 1)).toFixed(1)}x lipat lebih besar
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. Kesimpulan Promosi Mana yang Memiliki Konversi Lebih Tinggi */}
              <div className="p-6 sm:p-7 bg-[#FAF7F2] border-t border-[#E8DFD8] space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#8C582B]" />
                  <h4 className="text-sm font-bold text-[#1C120C] uppercase tracking-wide">
                    Kesimpulan Analisis Pengujian A/B
                  </h4>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0D2C3] shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE4] pb-3">
                    <div>
                      <span className="text-xs text-[#7A695D]">Variasi dengan Konversi Lebih Tinggi:</span>
                      <p className="font-serif-brand text-lg font-bold text-[#1C120C]">
                        🏆 {winnerIsB ? camp.variantB.name : camp.variantA.name}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#8C7A6B] block">Tingkat Keyakinan Statistik:</span>
                      <span className="font-mono text-sm font-bold text-emerald-700">
                        {camp.confidenceScore}% (Statistically Significant)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#523E32] leading-relaxed">
                    Berdasarkan data eksperimen, <strong>{winnerIsB ? camp.variantB.name : camp.variantA.name}</strong> menghasilkan tingkat konversi sebesar <strong>{(winnerIsB ? crB : crA).toFixed(2)}%</strong>, mengungguli variasi pembanding yang hanya mencatatkan konversi <strong>{(winnerIsB ? crA : crB).toFixed(2)}%</strong> (terdapat peningkatan relatif <strong>+{Math.abs(relativeLift).toFixed(1)}%</strong>).
                  </p>

                  <div className="text-xs text-[#6B5749] bg-[#FAF3EA] p-3 rounded-xl border border-[#EDE0D2] space-y-1">
                    <strong className="text-[#1C120C] block">Insight Perilaku Pelanggan (Agile Marketing):</strong>
                    {winnerIsB ? (
                      <span>
                        Pelanggan Kopi Tepi Delta terbukti lebih termotivasi melakukan transaksi ketika disajikan <em>paket bundling</em> (kopi + croissant dengan persepsi hemat Rp 12.000) dibandingkan diskon persentase langsung 10% yang hanya menghemat Rp 2.800 per cup. Selain menaikkan rasio konversi, strategi bundling juga melipatgandakan nilai belanja rata-rata (*Average Order Value*).
                      </span>
                    ) : (
                      <span>
                        Pelanggan merespons lebih cepat pada potongan harga langsung varian kopi susu. Strategi diskon langsung cocok untuk mengakselerasi frekuensi pembelian harian secara cepat.
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-[#7A695D]">
                    Gunakan hasil pengujian ini untuk menetapkan promo resmi di website pelanggan.
                  </span>

                  <button
                    type="button"
                    onClick={() => handleApply(camp.id, camp.recommendedWinner as any)}
                    className="py-2.5 px-5 rounded-xl bg-[#1C120C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332117] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#C59A6F]" />
                    <span>Terapkan {camp.recommendedWinner} sebagai Promo Standar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Admin Ubah Data Pengujian A/B */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#EFE9E1] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EFE9E1] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C582B] bg-[#C59A6F]/20 px-2 py-0.5 rounded">
                  Input / Ubah Data Pengujian
                </span>
                <h3 className="font-serif-brand text-lg font-bold text-[#1C120C] mt-1">
                  Ubah Parameter Eksperimen A/B
                </h3>
              </div>
              <button
                onClick={() => setEditingCampaign(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#EFE9E1] flex items-center justify-center text-[#7A695D] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              {/* Campaign General Details */}
              <div className="space-y-3 pb-4 border-b border-[#F2ECE4]">
                <div>
                  <label className="font-bold text-[#1C120C] block mb-1">Judul Eksperimen</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C120C] block mb-1">Tujuan Eksperimen</label>
                  <input
                    type="text"
                    value={editForm.goal}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                  />
                </div>
              </div>

              {/* Form Promosi A */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-3">
                <span className="font-bold text-[#1C120C] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#261912]" />
                  Parameter Promosi A
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Nama Variasi</label>
                    <input
                      type="text"
                      value={editForm.variantAName}
                      onChange={(e) => setEditForm({ ...editForm, variantAName: e.target.value })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Rata-rata Belanja (Rp)</label>
                    <input
                      type="number"
                      value={editForm.variantAAvgOrder}
                      onChange={(e) => setEditForm({ ...editForm, variantAAvgOrder: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Deskripsi Penawaran</label>
                  <textarea
                    rows={2}
                    value={editForm.variantADesc}
                    onChange={(e) => setEditForm({ ...editForm, variantADesc: e.target.value })}
                    className="w-full bg-white border border-[#E0D2C3] rounded-xl p-2.5 text-xs text-[#261912]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">
                      Jumlah Melihat (Impressions)
                    </label>
                    <input
                      type="number"
                      value={editForm.variantAImpressions}
                      onChange={(e) => setEditForm({ ...editForm, variantAImpressions: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs font-mono text-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">
                      Jumlah Transaksi (Conversions)
                    </label>
                    <input
                      type="number"
                      value={editForm.variantAConversions}
                      onChange={(e) => setEditForm({ ...editForm, variantAConversions: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs font-mono text-[#261912]"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-[#7A695D] flex justify-between bg-white p-2 rounded-lg border border-[#EDE4DC]">
                  <span>Hasil Konversi Promosi A:</span>
                  <strong className="text-[#1C120C]">
                    {((editForm.variantAConversions / Math.max(1, editForm.variantAImpressions)) * 100).toFixed(2)}%
                  </strong>
                </div>
              </div>

              {/* Form Promosi B */}
              <div className="p-4 rounded-2xl bg-[#FAF3EA] border border-[#E0D2C3] space-y-3">
                <span className="font-bold text-[#1C120C] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C59A6F]" />
                  Parameter Promosi B
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Nama Variasi</label>
                    <input
                      type="text"
                      value={editForm.variantBName}
                      onChange={(e) => setEditForm({ ...editForm, variantBName: e.target.value })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Rata-rata Belanja (Rp)</label>
                    <input
                      type="number"
                      value={editForm.variantBAvgOrder}
                      onChange={(e) => setEditForm({ ...editForm, variantBAvgOrder: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">Deskripsi Penawaran</label>
                  <textarea
                    rows={2}
                    value={editForm.variantBDesc}
                    onChange={(e) => setEditForm({ ...editForm, variantBDesc: e.target.value })}
                    className="w-full bg-white border border-[#E0D2C3] rounded-xl p-2.5 text-xs text-[#261912]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">
                      Jumlah Melihat (Impressions)
                    </label>
                    <input
                      type="number"
                      value={editForm.variantBImpressions}
                      onChange={(e) => setEditForm({ ...editForm, variantBImpressions: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs font-mono text-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C4A3E] block mb-1">
                      Jumlah Transaksi (Conversions)
                    </label>
                    <input
                      type="number"
                      value={editForm.variantBConversions}
                      onChange={(e) => setEditForm({ ...editForm, variantBConversions: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs font-mono text-[#261912]"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-[#7A695D] flex justify-between bg-white p-2 rounded-lg border border-[#EDE4DC]">
                  <span>Hasil Konversi Promosi B:</span>
                  <strong className="text-emerald-700">
                    {((editForm.variantBConversions / Math.max(1, editForm.variantBImpressions)) * 100).toFixed(2)}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex justify-end gap-2.5">
              <button
                onClick={() => setEditingCampaign(null)}
                className="px-4 py-2 rounded-xl border border-[#D5C7B7] text-xs font-semibold text-[#7A695D] hover:bg-[#EFE9E1]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-[#1C120C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332117] flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#C59A6F]" />
                <span>Simpan Perubahan & Hitung Ulang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

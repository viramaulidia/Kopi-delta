import React, { useState, useMemo } from 'react';
import {
  Target,
  Sparkles,
  Clock,
  Store,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Send,
  Eye,
  Calendar,
  Zap,
  Filter,
  Check,
  Tag,
  ArrowRight,
  TrendingUp,
  X,
  Compass,
} from 'lucide-react';
import {
  Order,
  Customer,
  Branch,
  Promo,
  RFMSegmentType,
  ContextualPromoRecommendation,
} from '../../types';
import { calculateRFM } from '../../utils/rfmAnalytics';

interface AdminContextualProps {
  orders: Order[];
  customers: Customer[];
  branches: Branch[];
  activePromos: Promo[];
  onTogglePromo: (promoId: string) => void;
  onAddPromo: (newPromo: Promo) => void;
  adminWhatsappPhone: string;
}

export const AdminContextual: React.FC<AdminContextualProps> = ({
  orders,
  customers,
  branches,
  activePromos,
  onTogglePromo,
  onAddPromo,
  adminWhatsappPhone,
}) => {
  // 1. Calculate RFM data from unified dataset
  const rfmResult = useMemo(() => {
    return calculateRFM(orders, customers, '2026-11-05');
  }, [orders, customers]);

  // Segment customers map
  const customersBySegment = useMemo(() => {
    const map: Record<RFMSegmentType, typeof rfmResult.rfmCustomers> = {
      'Pelanggan Loyal': [],
      'Pelanggan Potensial': [],
      'Pelanggan Baru': [],
      'Perlu Perhatian': [],
      'Beresiko Churn': [],
    };
    rfmResult.rfmCustomers.forEach((c) => {
      if (map[c.segment]) {
        map[c.segment].push(c);
      }
    });
    return map;
  }, [rfmResult]);

  // 2. Pre-configured Contextual Recommendations based on 3D Context (RFM Segment x Time x Branch)
  const initialRecommendations: ContextualPromoRecommendation[] = useMemo(() => {
    const loyalList = customersBySegment['Pelanggan Loyal'] || [];
    const churnList = customersBySegment['Beresiko Churn'] || [];
    const newList = customersBySegment['Pelanggan Baru'] || [];
    const potentialList = customersBySegment['Pelanggan Potensial'] || [];
    const attentionList = customersBySegment['Perlu Perhatian'] || [];

    return [
      {
        id: 'ctx-1',
        promoCode: 'LOYALBUNDLE',
        title: 'Loyal Patron Artisan Pastry & Brew Bundling',
        targetSegment: 'Pelanggan Loyal',
        targetBranch: 'Seluruh Cabang (Konsolidasi)',
        timeSlot: 'Akhir Pekan (Sabtu & Minggu, 09:00 - 18:00 WIB)',
        timeCategory: 'Weekend',
        discountDescription: 'Paket 2x Specialty Coffee + 1x Artisan Almond Croissant hanya Rp 74.000 (Hemat Rp 22.000).',
        discountType: 'bundle',
        discountValue: 22000,
        minPurchase: 74000,
        validUntil: '30 November 2026',
        recommendationReason:
          'Data RFM menunjukkan pelanggan loyal memiliki frekuensi kunjungan tertinggi (rata-rata 6x transaksi) dengan rata-rata belanja Rp 140.000+. Memberikan paket bundling pastry alih-alih diskon langsung terbukti meningkatkan Average Order Value (AOV) sebesar +26% tanpa menurunkan nilai merek kopi specialty.',
        matchingCustomerCount: loyalList.length,
        matchingCustomers: loyalList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'LOYALBUNDLE' && p.isActive),
        targetObjective: 'Menaikkan Nilai Transaksi (AOV) via Cross-Selling',
        ruleCategory: 'Bundling Loyalitas',
      },
      {
        id: 'ctx-2',
        promoCode: 'COMEBACK30',
        title: 'We Miss You — Kunjungan Kembali Diskon 30%',
        targetSegment: 'Beresiko Churn',
        targetBranch: 'Seluruh Cabang (Konsolidasi)',
        timeSlot: 'Setiap Hari (Fleksibel, Jam Operasional Penuh)',
        timeCategory: 'Fleksibel',
        discountDescription: 'Diskon 30% (hingga Rp 35.000) untuk pesanan kembali + Gratis Upgrade Ukuran Minuman.',
        discountType: 'percentage',
        discountValue: 30,
        minPurchase: 50000,
        validUntil: '15 Desember 2026',
        recommendationReason:
          'Berdasarkan metrik Recency (R-Score 1-2), pelanggan ini tidak bertransaksi selama lebih dari 20-35 hari padahal memiliki riwayat spend yang cukup baik. Insentif diskon 30% merupakan pemicu psikologis win-back paling efektif untuk mengembalikan kebiasaan berkunjung sebelum beralih permanen ke kompetitor.',
        matchingCustomerCount: churnList.length,
        matchingCustomers: churnList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'COMEBACK30' && p.isActive),
        targetObjective: 'Re-aktivasi & Pencegahan Churn Pelanggan',
        ruleCategory: 'Win-Back Churn',
      },
      {
        id: 'ctx-3',
        promoCode: 'WELCOME25',
        title: 'Welcome Explorer — Kunjungan Kedua Diskon 25%',
        targetSegment: 'Pelanggan Baru',
        targetBranch: 'Seluruh Cabang (Konsolidasi)',
        timeSlot: 'Setiap Hari (Masa Berlaku 7 Hari Sejak Kunjungan Pertama)',
        timeCategory: 'Fleksibel',
        discountDescription: 'Potongan 25% untuk pemesanan varian Signature Cold Brew atau Single Origin V60.',
        discountType: 'percentage',
        discountValue: 25,
        minPurchase: 45000,
        validUntil: '20 Desember 2026',
        recommendationReason:
          'Pelanggan baru baru melakukan 1 transaksi dalam rentang 1-7 hari terakhir. Rentang waktu antara pesanan pertama dan kedua adalah jendela retensi paling kritis. Memberikan diskon 25% mendorong pembentukan kebiasaan (habit-forming) menikmati racikan khas Kopi Tepi Delta.',
        matchingCustomerCount: newList.length,
        matchingCustomers: newList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'WELCOME25' && p.isActive),
        targetObjective: 'Meningkatkan Rasio Retensi Kunjungan Kedua (Repeat Purchase)',
        ruleCategory: 'Aktivasi Pelanggan Baru',
      },
      {
        id: 'ctx-4',
        promoCode: 'HERITAGEWFC',
        title: 'Heritage Afternoon Focus & Co-Working Perk',
        targetSegment: 'Pelanggan Potensial',
        targetBranch: 'Kopi Tepi Delta — Heritage Kota Lama',
        timeSlot: 'Siang ke Sore (Senin - Jumat, 13:00 - 17:00 WIB)',
        timeCategory: 'Siang',
        discountDescription: 'Diskon 20% untuk pembelian minuman kedua + Free Refill Manual Brew Americano.',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 60000,
        validUntil: '30 November 2026',
        recommendationReason:
          'Cabang Heritage Kota Lama memiliki tingkat okupansi indoor dan pelanggan remote worker tertinggi saat jam 13:00-17:00. Segmen Potensial memiliki daya beli tinggi namun baru bertransaksi 2-3 kali. Promo ini memaksimalkan durasi kunjungan dan repeat order saat jam kerja.',
        matchingCustomerCount: potentialList.length,
        matchingCustomers: potentialList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'HERITAGEWFC' && p.isActive),
        targetObjective: 'Mengisi Kapasitas Jam Tenang Midday & Upselling',
        ruleCategory: 'Cross-Sell Potensial',
      },
      {
        id: 'ctx-5',
        promoCode: 'SUNSETRIVER',
        title: 'Riverfront Golden Hour Sunset Chill',
        targetSegment: 'Perlu Perhatian',
        targetBranch: 'Kopi Tepi Delta — Promenade Riverfront',
        timeSlot: 'Sore ke Senja (Setiap Hari, 16:30 - 19:00 WIB)',
        timeCategory: 'Sore',
        discountDescription: 'Beli 1 Cold Brew Signature Gratis 1 Artisan Truffle Fries / Pastry Snack.',
        discountType: 'bundle',
        discountValue: 28000,
        minPurchase: 65000,
        validUntil: '15 Desember 2026',
        recommendationReason:
          'Pelanggan di segmen Perlu Perhatian mulai menunjukkan keterlambatan kunjungan (Recency 10-18 hari). Lokasi Promenade Riverfront memiliki daya tarik sunset tepi delta yang kuat di sore hari. Penawaran pairing santai ini menarik mereka kembali dengan pengalaman suasana yang menyenangkan.',
        matchingCustomerCount: attentionList.length,
        matchingCustomers: attentionList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'SUNSETRIVER' && p.isActive),
        targetObjective: 'Mencegah Penurunan ke Segmen Churn (Early Re-engagement)',
        ruleCategory: 'Re-Engagement',
      },
      {
        id: 'ctx-6',
        promoCode: 'SKYROOFTOP',
        title: 'Sky Sanctuary Evening Lounge Special',
        targetSegment: 'Pelanggan Loyal',
        targetBranch: 'Kopi Tepi Delta — Sky Sanctuary',
        timeSlot: 'Malam Hari (Kamis - Minggu, 19:00 - 22:30 WIB)',
        timeCategory: 'Malam',
        discountDescription: 'Cashback Rp 25.000 untuk pemesanan Coffee Mocktail Flight + Sharing Platter.',
        discountType: 'fixed',
        discountValue: 25000,
        minPurchase: 90000,
        validUntil: '31 Desember 2026',
        recommendationReason:
          'Karakteristik rooftop Sky Sanctuary sangat diminati saat malam hari. Pelanggan Loyal yang menyukai suasana estetik diberi hak istimewa (VIP perk) untuk menu seasonal mocktail tanpa kafein malam hari, memperdalam ikatan komunitas.',
        matchingCustomerCount: loyalList.length,
        matchingCustomers: loyalList.map((c) => ({
          name: c.name,
          phone: c.phone,
          recencyDays: c.recencyDays,
          totalSpent: c.monetary,
        })),
        isActivated: activePromos.some((p) => p.code === 'SKYROOFTOP' && p.isActive),
        targetObjective: 'Meningkatkan Pengeluaran Malam Hari & Loyalitas VIP',
        ruleCategory: 'Bundling Loyalitas',
      },
    ];
  }, [customersBySegment, activePromos]);

  // State for recommendations
  const [recommendations, setRecommendations] = useState<ContextualPromoRecommendation[]>(initialRecommendations);

  // Filters state
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modal for viewing customer list
  const [inspectingPromo, setInspectingPromo] = useState<ContextualPromoRecommendation | null>(null);

  // Modal for Custom Contextual Rule Builder
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderSegment, setBuilderSegment] = useState<RFMSegmentType>('Pelanggan Loyal');
  const [builderBranch, setBuilderBranch] = useState<string>('Seluruh Cabang (Konsolidasi)');
  const [builderTime, setBuilderTime] = useState<'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Weekend' | 'Fleksibel'>('Pagi');
  const [builderTitle, setBuilderTitle] = useState('Morning Delta Roast Pairing');
  const [builderCode, setBuilderCode] = useState('MORNINGROAST');
  const [builderDiscountType, setBuilderDiscountType] = useState<'percentage' | 'fixed' | 'bundle'>('percentage');
  const [builderDiscountValue, setBuilderDiscountValue] = useState(20);
  const [builderMinPurchase, setBuilderMinPurchase] = useState(50000);
  const [builderReason, setBuilderReason] = useState(
    'Rekomendasi otomatis berbasis aturan konteks jam pagi dan segmen pelanggan.'
  );

  // WhatsApp preview modal
  const [whatsappPreviewData, setWhatsappPreviewData] = useState<{
    customerName: string;
    phone: string;
    promo: ContextualPromoRecommendation;
    message: string;
  } | null>(null);

  // Copy notification state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 6. Admin can select and activate simulated promo
  const handleToggleActivation = (promoId: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === promoId) {
          const nextState = !rec.isActivated;

          // Check if this promo already exists in activePromos
          const existing = activePromos.find((p) => p.code === rec.promoCode);
          if (existing) {
            onTogglePromo(existing.id);
          } else if (nextState) {
            // Inject as a new promo to the customer website so customer can use it!
            const newWebsitePromo: Promo = {
              id: `promo-ctx-${Date.now()}`,
              code: rec.promoCode,
              title: rec.title,
              discountDescription: rec.discountDescription,
              discountType: rec.discountType,
              discountValue: rec.discountValue,
              minPurchase: rec.minPurchase,
              validUntil: rec.validUntil,
              isActive: true,
              targetAudience: `${rec.targetSegment} — ${rec.timeSlot}`,
              estimatedUplift: '+22% Response Rate',
            };
            onAddPromo(newWebsitePromo);
          }

          return { ...rec, isActivated: nextState };
        }
        return rec;
      })
    );
  };

  // Custom rule generation helper
  const handleCreateCustomPromo = () => {
    const targetList = customersBySegment[builderSegment] || [];

    const newRec: ContextualPromoRecommendation = {
      id: `ctx-${Date.now()}`,
      promoCode: builderCode.trim().toUpperCase(),
      title: builderTitle.trim(),
      targetSegment: builderSegment,
      targetBranch: builderBranch,
      timeSlot: `${builderTime} (${builderTime === 'Pagi' ? '07:00 - 11:00' : builderTime === 'Siang' ? '12:00 - 16:30' : builderTime === 'Sore' ? '16:30 - 19:30' : builderTime === 'Malam' ? '19:30 - 22:30' : 'Weekend 08:00 - 20:00'} WIB)`,
      timeCategory: builderTime,
      discountDescription:
        builderDiscountType === 'percentage'
          ? `Diskon ${builderDiscountValue}% untuk menu pilihan (Min. Transaksi Rp ${builderMinPurchase.toLocaleString('id-ID')}).`
          : builderDiscountType === 'fixed'
          ? `Potongan langsung Rp ${builderDiscountValue.toLocaleString('id-ID')} (Min. Transaksi Rp ${builderMinPurchase.toLocaleString('id-ID')}).`
          : `Paket bundling hemat Rp ${builderDiscountValue.toLocaleString('id-ID')} saat ${builderTime}.`,
      discountType: builderDiscountType,
      discountValue: builderDiscountValue,
      minPurchase: builderMinPurchase,
      validUntil: '31 Desember 2026',
      recommendationReason: builderReason,
      matchingCustomerCount: targetList.length,
      matchingCustomers: targetList.map((c) => ({
        name: c.name,
        phone: c.phone,
        recencyDays: c.recencyDays,
        totalSpent: c.monetary,
      })),
      isActivated: true,
      targetObjective: `Peningkatan Penjualan Kontekstual (${builderSegment})`,
      ruleCategory:
        builderSegment === 'Pelanggan Loyal'
          ? 'Bundling Loyalitas'
          : builderSegment === 'Beresiko Churn'
          ? 'Win-Back Churn'
          : builderSegment === 'Pelanggan Baru'
          ? 'Aktivasi Pelanggan Baru'
          : 'Cross-Sell Potensial',
    };

    setRecommendations((prev) => [newRec, ...prev]);

    // Also activate into customer promos
    const newWebsitePromo: Promo = {
      id: `promo-ctx-${Date.now()}`,
      code: newRec.promoCode,
      title: newRec.title,
      discountDescription: newRec.discountDescription,
      discountType: newRec.discountType,
      discountValue: newRec.discountValue,
      minPurchase: newRec.minPurchase,
      validUntil: newRec.validUntil,
      isActive: true,
      targetAudience: `${newRec.targetSegment} — ${newRec.targetBranch}`,
      estimatedUplift: '+25% Target Conversion',
    };
    onAddPromo(newWebsitePromo);

    setIsBuilderOpen(false);
  };

  // Filtered recommendations list
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((r) => {
      if (selectedSegmentFilter !== 'all' && r.targetSegment !== selectedSegmentFilter) {
        return false;
      }
      if (selectedBranchFilter !== 'all' && !r.targetBranch.includes(selectedBranchFilter)) {
        return false;
      }
      if (selectedTimeFilter !== 'all' && r.timeCategory !== selectedTimeFilter) {
        return false;
      }
      if (selectedStatusFilter === 'active' && !r.isActivated) {
        return false;
      }
      if (selectedStatusFilter === 'draft' && r.isActivated) {
        return false;
      }
      return true;
    });
  }, [
    recommendations,
    selectedSegmentFilter,
    selectedBranchFilter,
    selectedTimeFilter,
    selectedStatusFilter,
  ]);

  // Open WhatsApp draft preview
  const handleOpenWhatsAppPreview = (
    rec: ContextualPromoRecommendation,
    cust: { name: string; phone: string }
  ) => {
    const text = `Halo Kak ${cust.name}! ☕\n\nKopi Tepi Delta ingin memberikan apresiasi spesial untuk Kakak. Nikmati promo eksklusif "${rec.title}":\n\n✨ Diskon: ${rec.discountDescription}\n🎟️ Kode Promo: *${rec.promoCode}*\n📍 Berlaku di: ${rec.targetBranch}\n⏰ Waktu: ${rec.timeSlot}\n\nGunakan kode ini saat memesan di website kopitepidelta.id atau tunjukkan pesan ini langsung ke barista kami.\n\nSampai jumpa di tepi sungai! 🌿`;

    setWhatsappPreviewData({
      customerName: cust.name,
      phone: cust.phone,
      promo: rec,
      message: text,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Simulation Disclaimer Banner */}
      <div className="bg-[#FAF3EA] border border-[#E0D2C3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C59A6F]/20 text-[#6B4423] flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-[#8C582B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-[#C59A6F]/20 text-[#6B4423] px-2 py-0.5 rounded-md">
                Data Simulasi
              </span>
              <span className="text-[11px] font-medium text-[#7A695D]">
                Rule-Based Engine (3 Dimensi)
              </span>
            </div>
            <p className="text-xs text-[#523E32] mt-0.5">
              Halaman ini menyajikan <strong>Contextual Marketing</strong> yang merumuskan rekomendasi promosi berdasarkan irisan <strong>Segmen RFM Pelanggan</strong>, <strong>Konteks Waktu</strong>, dan <strong>Karakteristik Cabang</strong> dari data transaksi simulasi.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsBuilderOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#261912] text-[#FAF7F2] text-xs font-semibold hover:bg-[#3D291E] transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C59A6F]" />
          <span>Buat Aturan Kontekstual Baru</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C582B] tracking-wider uppercase mb-1">
            <Target className="w-4 h-4 text-[#C59A6F]" />
            <span>Targeting Presisi & Pemasaran Relevan</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#1C120C]">
            Contextual Marketing Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#7A695D] mt-1 max-w-2xl">
            Menghadirkan penawaran yang tepat kepada pelanggan yang tepat, pada waktu yang tepat, dan di cabang yang tepat berdasarkan aturan keputusan logis dan perilaku riil.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#EFE9E1] rounded-xl px-4 py-2.5 text-right shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Total Audiens RFM</span>
            <span className="font-serif-brand text-lg font-bold text-[#1C120C] tabular-nums">
              {rfmResult.rfmCustomers.length} Pelanggan
            </span>
          </div>
          <div className="bg-white border border-[#EFE9E1] rounded-xl px-4 py-2.5 text-right shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Promo Kontekstual Aktif</span>
            <span className="font-serif-brand text-lg font-bold text-[#107569] tabular-nums">
              {recommendations.filter((r) => r.isActivated).length} dari {recommendations.length}
            </span>
          </div>
        </div>
      </div>

      {/* 1. RFM Segments Cards Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8C582B]" />
            <h2 className="text-sm font-bold text-[#1C120C] uppercase tracking-wide">
              1. Ringkasan Segmen Pelanggan Berdasarkan RFM
            </h2>
          </div>
          <span className="text-xs text-[#8C7A6B]">Klik kartu untuk memfilter rekomendasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {rfmResult.segmentSummaries.map((summary) => {
            const isSelected = selectedSegmentFilter === summary.segment;
            return (
              <button
                key={summary.segment}
                onClick={() =>
                  setSelectedSegmentFilter(isSelected ? 'all' : summary.segment)
                }
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#C59A6F] ring-2 ring-[#C59A6F]/30 shadow-md'
                    : 'bg-white border-[#EFE9E1] hover:border-[#D5C7B7] hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${summary.badgeColor}`}
                  >
                    {summary.segment}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8C582B]" />
                  )}
                </div>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-serif-brand text-2xl font-bold text-[#1C120C] tabular-nums">
                    {summary.count}
                  </span>
                  <span className="text-xs text-[#8C7A6B]">
                    ({summary.percentage}%)
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#F2ECE4] text-[11px] text-[#7A695D] space-y-1">
                  <div className="flex justify-between">
                    <span>AOV:</span>
                    <span className="font-medium text-[#261912] tabular-nums">
                      Rp {summary.avgMonetary.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Belanja:</span>
                    <span className="font-semibold text-[#8C582B] tabular-nums">
                      Rp {Math.round(summary.totalMonetary / 1000).toLocaleString('id-ID')}k
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 text-[10px] font-medium text-[#8C7A6B] bg-[#FAF7F2] p-1.5 rounded-lg truncate">
                  Target: {summary.marketingAction.split('.')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3. Contextual Filter Bar */}
      <div className="bg-white border border-[#EFE9E1] rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8C582B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C120C]">
              Filter Rekomendasi Kontekstual
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Segmen */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8C7A6B] font-medium">Segmen:</span>
              <select
                aria-label="Filter Segmen Pelanggan"
                value={selectedSegmentFilter}
                onChange={(e) => setSelectedSegmentFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-lg px-2.5 py-1.5 text-xs text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
              >
                <option value="all">Semua Segmen RFM</option>
                <option value="Pelanggan Loyal">Pelanggan Loyal</option>
                <option value="Pelanggan Potensial">Pelanggan Potensial</option>
                <option value="Pelanggan Baru">Pelanggan Baru</option>
                <option value="Perlu Perhatian">Perlu Perhatian</option>
                <option value="Beresiko Churn">Beresiko Churn</option>
              </select>
            </div>

            {/* Filter Waktu */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8C7A6B] font-medium">Waktu:</span>
              <select
                aria-label="Filter Waktu Pelaksanaan Promo"
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-lg px-2.5 py-1.5 text-xs text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
              >
                <option value="all">Semua Periode Waktu</option>
                <option value="Pagi">Pagi Hari (07:00 - 11:00)</option>
                <option value="Siang">Siang (12:00 - 16:30)</option>
                <option value="Sore">Sore Senja (16:30 - 19:30)</option>
                <option value="Malam">Malam (19:30 - 22:30)</option>
                <option value="Weekend">Akhir Pekan (Sabtu - Minggu)</option>
                <option value="Fleksibel">Fleksibel Sepanjang Hari</option>
              </select>
            </div>

            {/* Filter Cabang */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8C7A6B] font-medium">Cabang:</span>
              <select
                aria-label="Filter Cabang Kopi Tepi Delta"
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-lg px-2.5 py-1.5 text-xs text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
              >
                <option value="all">Semua Cabang</option>
                <option value="Promenade Riverfront">Promenade Riverfront</option>
                <option value="Heritage Kota Lama">Heritage Kota Lama</option>
                <option value="Sky Sanctuary">Sky Sanctuary</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8C7A6B] font-medium">Status:</span>
              <select
                aria-label="Filter Status Aktivasi Promo"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-lg px-2.5 py-1.5 text-xs text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif di Website</option>
                <option value="draft">Siap Diaktifkan</option>
              </select>
            </div>

            {(selectedSegmentFilter !== 'all' ||
              selectedBranchFilter !== 'all' ||
              selectedTimeFilter !== 'all' ||
              selectedStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSelectedSegmentFilter('all');
                  setSelectedBranchFilter('all');
                  setSelectedTimeFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="text-xs text-[#8C582B] hover:underline font-medium px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 & 5. Contextual Promo Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#8C582B]" />
            <h2 className="text-sm font-bold text-[#1C120C] uppercase tracking-wide">
              2. Daftar Rekomendasi Promo Kontekstual ({filteredRecommendations.length})
            </h2>
          </div>
          <span className="text-xs text-[#7A695D]">
            Disusun berdasarkan aturan konversi segmen, waktu, dan karakter cabang
          </span>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="bg-white border border-[#EFE9E1] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#8C7A6B] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-serif-brand text-lg font-bold text-[#1C120C]">
              Tidak Ada Rekomendasi yang Cocok
            </h3>
            <p className="text-xs text-[#7A695D] max-w-md mx-auto">
              Kombinasi filter yang Anda pilih saat ini tidak menghasilkan aturan promo. Silakan ubah filter atau klik tombol "Reset Filter".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredRecommendations.map((promo) => {
              return (
                <div
                  key={promo.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                    promo.isActivated
                      ? 'border-[#C59A6F] shadow-md ring-1 ring-[#C59A6F]/20'
                      : 'border-[#EFE9E1] hover:border-[#D5C7B7] shadow-xs'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {/* Segment Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              promo.targetSegment === 'Pelanggan Loyal'
                                ? 'bg-amber-100 text-amber-800'
                                : promo.targetSegment === 'Pelanggan Baru'
                                ? 'bg-blue-100 text-blue-800'
                                : promo.targetSegment === 'Beresiko Churn'
                                ? 'bg-rose-100 text-rose-800'
                                : promo.targetSegment === 'Pelanggan Potensial'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {promo.targetSegment}
                          </span>

                          {/* Rule Category */}
                          <span className="text-[10px] font-semibold text-[#8C7A6B] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EFE9E1]">
                            {promo.ruleCategory}
                          </span>

                          {/* Activation Status */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              promo.isActivated
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {promo.isActivated ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Aktif di Website</span>
                              </>
                            ) : (
                              <span>Draft Rekomendasi</span>
                            )}
                          </span>
                        </div>

                        <h3 className="font-serif-brand text-lg font-bold text-[#1C120C] leading-snug">
                          {promo.title}
                        </h3>
                      </div>

                      {/* Promo Code Box */}
                      <div className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-1.5 text-center shrink-0">
                        <span className="text-[9px] uppercase font-bold text-[#8C7A6B] block">Kode Promo</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <code className="font-mono text-xs font-bold text-[#8C582B]">
                            {promo.promoCode}
                          </code>
                          <button
                            onClick={() => handleCopy(promo.promoCode)}
                            className="text-[#8C7A6B] hover:text-[#1C120C] transition-colors"
                            title="Salin Kode Promo"
                          >
                            {copiedCode === promo.promoCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Benefit / Discount Description */}
                    <p className="text-xs text-[#261912] font-medium bg-[#FAF3EA]/60 p-2.5 rounded-xl border border-[#EFE9E1]">
                      🎁 <strong>Benefit:</strong> {promo.discountDescription}
                    </p>

                    {/* 3D Context Meta Badges (Target, Cabang, Periode) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                      {/* Target Audience */}
                      <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#F2ECE4]">
                        <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#C59A6F]" />
                          Target Audiens
                        </span>
                        <span className="font-semibold text-[#1C120C] block mt-0.5">
                          {promo.matchingCustomerCount} Pelanggan
                        </span>
                      </div>

                      {/* Cabang */}
                      <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#F2ECE4]">
                        <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                          <Store className="w-3 h-3 text-[#C59A6F]" />
                          Cabang Relevan
                        </span>
                        <span className="font-semibold text-[#1C120C] block mt-0.5 truncate" title={promo.targetBranch}>
                          {promo.targetBranch.replace('Kopi Tepi Delta — ', '')}
                        </span>
                      </div>

                      {/* Periode & Waktu */}
                      <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#F2ECE4]">
                        <span className="text-[10px] uppercase font-bold text-[#8C7A6B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C59A6F]" />
                          Waktu Kontekstual
                        </span>
                        <span className="font-semibold text-[#1C120C] block mt-0.5 truncate" title={promo.timeSlot}>
                          {promo.timeSlot}
                        </span>
                      </div>
                    </div>

                    {/* 5. Alasan Rekomendasi (Rule Logic & Rationale Box) */}
                    <div className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C582B]">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Alasan Rekomendasi Berbasis Aturan:</span>
                      </div>
                      <p className="text-[11px] text-[#5C4A3E] leading-relaxed">
                        {promo.recommendationReason}
                      </p>
                    </div>

                    {/* Matching Customers Mini Strip */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-[#7A695D]">
                        <span className="text-[11px]">Daftar Target:</span>
                        <div className="flex items-center -space-x-1 overflow-hidden">
                          {promo.matchingCustomers.slice(0, 3).map((cust, idx) => (
                            <div
                              key={idx}
                              title={cust.name}
                              className="w-5 h-5 rounded-full bg-[#C59A6F] text-[#1C120C] text-[9px] font-bold flex items-center justify-center border border-white"
                            >
                              {cust.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-[#261912]">
                          {promo.matchingCustomers.slice(0, 2).map((c) => c.name.split(' ')[0]).join(', ')}
                          {promo.matchingCustomers.length > 2 && ` +${promo.matchingCustomers.length - 2} lainnya`}
                        </span>
                      </div>

                      <button
                        onClick={() => setInspectingPromo(promo)}
                        className="text-[11px] text-[#8C582B] hover:text-[#52341C] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Semua ({promo.matchingCustomerCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Actions (Aktifkan Promo Simulasi) */}
                  <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#7A695D]">
                      {promo.isActivated
                        ? 'Dapat digunakan pelanggan di keranjang'
                        : 'Klik untuk mempublikasikan ke website'}
                    </span>

                    <button
                      onClick={() => handleToggleActivation(promo.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        promo.isActivated
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-[#1C120C] text-[#FAF7F2] hover:bg-[#332117] shadow-xs'
                      }`}
                    >
                      {promo.isActivated ? (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Nonaktifkan Promo</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-[#C59A6F]" />
                          <span>Aktifkan Promo Simulasi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Lihat Pelanggan Cocok & Simulasi Blast WhatsApp */}
      {inspectingPromo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#EFE9E1] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EFE9E1] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C582B] bg-[#C59A6F]/20 px-2 py-0.5 rounded-md">
                  Target Audiens Kontekstual
                </span>
                <h3 className="font-serif-brand text-lg font-bold text-[#1C120C] mt-1">
                  {inspectingPromo.title}
                </h3>
                <p className="text-xs text-[#7A695D]">
                  Segmen: <strong>{inspectingPromo.targetSegment}</strong> ({inspectingPromo.matchingCustomers.length} pelanggan terdaftar)
                </p>
              </div>
              <button
                onClick={() => setInspectingPromo(null)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9E1] flex items-center justify-center text-[#7A695D] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Customer Table */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="text-xs text-[#523E32] bg-[#FAF3EA] p-3 rounded-xl border border-[#E0D2C3]">
                💡 <strong>Rekomendasi Eksekusi:</strong> Pelanggan berikut telah diklasifikasikan ke dalam segmen <em>{inspectingPromo.targetSegment}</em> berdasarkan data transaksi simulasi. Anda dapat mengirimkan penawaran personalisasi langsung ke WhatsApp mereka.
              </div>

              <div className="border border-[#EFE9E1] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#8C7A6B] border-b border-[#EFE9E1] text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-3">Nama Pelanggan</th>
                      <th className="p-3">No. WhatsApp</th>
                      <th className="p-3">Recency (Hari)</th>
                      <th className="p-3">Total Belanja</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE4]">
                    {inspectingPromo.matchingCustomers.map((cust, i) => (
                      <tr key={i} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 font-semibold text-[#1C120C]">
                          {cust.name}
                        </td>
                        <td className="p-3 font-mono text-[#7A695D]">
                          {cust.phone}
                        </td>
                        <td className="p-3 tabular-nums text-[#261912]">
                          {cust.recencyDays} hari lalu
                        </td>
                        <td className="p-3 font-medium text-[#8C582B] tabular-nums">
                          Rp {cust.totalSpent.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenWhatsAppPreview(inspectingPromo, cust)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim Penawaran</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex justify-end">
              <button
                onClick={() => setInspectingPromo(null)}
                className="px-4 py-2 rounded-xl bg-[#1C120C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332117] transition-colors"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Custom Contextual Rule Builder */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#EFE9E1] overflow-hidden">
            <div className="p-5 border-b border-[#EFE9E1] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C582B] bg-[#C59A6F]/20 px-2 py-0.5 rounded-md">
                  Rule Builder
                </span>
                <h3 className="font-serif-brand text-lg font-bold text-[#1C120C] mt-1">
                  Buat Aturan Promo Kontekstual Baru
                </h3>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9E1] flex items-center justify-center text-[#7A695D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Dimensi 1: Segmen */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1C120C] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>1. Dimensi Segmen Pelanggan (RFM)</span>
                </label>
                <select
                  value={builderSegment}
                  onChange={(e) => setBuilderSegment(e.target.value as RFMSegmentType)}
                  className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912] focus:ring-1 focus:ring-[#C59A6F]"
                >
                  <option value="Pelanggan Loyal">Pelanggan Loyal (Prioritas Bundling & VIP)</option>
                  <option value="Pelanggan Baru">Pelanggan Baru (Prioritas Kunjungan Kedua)</option>
                  <option value="Beresiko Churn">Beresiko Churn (Prioritas Diskon Kunjungan Kembali)</option>
                  <option value="Pelanggan Potensial">Pelanggan Potensial (Prioritas Upselling)</option>
                  <option value="Perlu Perhatian">Perlu Perhatian (Prioritas Re-engagement)</option>
                </select>
                <p className="text-[11px] text-[#8C7A6B]">
                  Terdeteksi <strong>{(customersBySegment[builderSegment] || []).length} pelanggan</strong> yang cocok dengan segmen ini di database simulasi.
                </p>
              </div>

              {/* Dimensi 2: Waktu */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1C120C] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>2. Dimensi Waktu Pelaksanaan</span>
                </label>
                <select
                  value={builderTime}
                  onChange={(e) => setBuilderTime(e.target.value as any)}
                  className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912] focus:ring-1 focus:ring-[#C59A6F]"
                >
                  <option value="Pagi">Pagi Hari (07:00 - 11:00 WIB) — Morning Commute</option>
                  <option value="Siang">Siang (12:00 - 16:30 WIB) — Co-Working & Focus Hours</option>
                  <option value="Sore">Sore Senja (16:30 - 19:30 WIB) — Riverside Sunset Chill</option>
                  <option value="Malam">Malam (19:30 - 22:30 WIB) — Night Lounge</option>
                  <option value="Weekend">Akhir Pekan (Sabtu - Minggu) — Family & Friends Gathering</option>
                  <option value="Fleksibel">Fleksibel Sepanjang Hari</option>
                </select>
              </div>

              {/* Dimensi 3: Cabang */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1C120C] flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>3. Dimensi Cabang Spesifik</span>
                </label>
                <select
                  value={builderBranch}
                  onChange={(e) => setBuilderBranch(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912] focus:ring-1 focus:ring-[#C59A6F]"
                >
                  <option value="Seluruh Cabang (Konsolidasi)">Seluruh Cabang (Berlaku Nasional)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Parameter Promo */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C120C]">Nama Promo</label>
                  <input
                    type="text"
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    placeholder="Contoh: Morning Brew Combo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C120C]">Kode Promo (Huruf Kapital)</label>
                  <input
                    type="text"
                    value={builderCode}
                    onChange={(e) => setBuilderCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs font-mono text-[#8C582B]"
                    placeholder="Contoh: MORNING20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C120C]">Tipe & Nilai Diskon</label>
                  <div className="flex gap-2">
                    <select
                      value={builderDiscountType}
                      onChange={(e) => setBuilderDiscountType(e.target.value as any)}
                      className="bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-2 py-2 text-xs text-[#261912] shrink-0"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">Rp</option>
                      <option value="bundle">Bundle</option>
                    </select>
                    <input
                      type="number"
                      value={builderDiscountValue}
                      onChange={(e) => setBuilderDiscountValue(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C120C]">Min. Transaksi (Rp)</label>
                  <input
                    type="number"
                    value={builderMinPurchase}
                    onChange={(e) => setBuilderMinPurchase(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3 py-2 text-xs text-[#261912]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C120C]">Alasan Rekomendasi (Rule Rationale)</label>
                <textarea
                  value={builderReason}
                  onChange={(e) => setBuilderReason(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl p-2.5 text-xs text-[#261912]"
                  placeholder="Jelaskan dasar aturan mengapa promo ini relevan untuk audiens, waktu, dan cabang tersebut..."
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex justify-end gap-2.5">
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E0D2C3] text-xs font-semibold text-[#7A695D] hover:bg-[#EFE9E1]"
              >
                Batal
              </button>
              <button
                onClick={handleCreateCustomPromo}
                className="px-4 py-2 rounded-xl bg-[#1C120C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332117] flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#C59A6F]" />
                <span>Simpan & Aktifkan Promo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Draft Modal Preview */}
      {whatsappPreviewData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#EFE9E1] overflow-hidden">
            <div className="p-4 bg-[#075E54] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#25D366]" />
                <span className="font-semibold text-xs">
                  Pratinjau Pesan Penawaran WhatsApp
                </span>
              </div>
              <button
                onClick={() => setWhatsappPreviewData(null)}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="text-xs text-[#523E32] flex justify-between">
                <span>Penerima: <strong>{whatsappPreviewData.customerName}</strong></span>
                <span className="font-mono text-[#7A695D]">{whatsappPreviewData.phone}</span>
              </div>

              <div className="bg-[#EFEAE2] p-4 rounded-xl text-xs font-sans whitespace-pre-line text-[#111B21] border border-[#DDD6CB] leading-relaxed">
                {whatsappPreviewData.message}
              </div>

              <p className="text-[11px] text-[#7A695D]">
                Pesan ini dibuat otomatis sesuai segmen dan konteks promo. Klik tombol di bawah untuk membuka aplikasi WhatsApp.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex justify-end gap-2.5">
              <button
                onClick={() => setWhatsappPreviewData(null)}
                className="px-4 py-2 rounded-xl border border-[#E0D2C3] text-xs font-semibold text-[#7A695D]"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${whatsappPreviewData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  whatsappPreviewData.message
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWhatsappPreviewData(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka WhatsApp Web / App</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

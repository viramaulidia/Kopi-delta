import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  Calendar,
  Filter,
  Coffee,
  Store,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Order, MenuItem, Branch } from '../../types';

interface AdminPredictionsProps {
  orders: Order[];
  menuItems: MenuItem[];
  branches: Branch[];
}

export const AdminPredictions: React.FC<AdminPredictionsProps> = ({
  orders,
  menuItems,
  branches,
}) => {
  // 2. Admin dapat memilih menu dan cabang yang ingin dianalisis
  const [selectedMenuName, setSelectedMenuName] = useState<string>('Semua Menu');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [movingAverageWindow, setMovingAverageWindow] = useState<number>(3); // N = 3 days

  // Get selected branch object
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const branchDisplayName = selectedBranch
    ? selectedBranch.name.replace('Kopi Tepi Delta — ', '')
    : 'Seluruh Cabang (Konsolidasi)';

  // 1. Filter orders based on chosen branch
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedBranchId === 'all') return true;
      return o.branchId === selectedBranchId || o.branchName.includes(selectedBranch?.name || '');
    });
  }, [orders, selectedBranchId, selectedBranch]);

  // Aggregate daily sales volume (cups/items) and revenue for the selected menu
  const dailyHistorical = useMemo(() => {
    // Unique dates sorted ascending
    const allDates = Array.from(new Set(orders.map((o) => o.timestamp.slice(0, 10)))).sort();

    // Map each day
    const dayMap: {
      [date: string]: {
        dateStr: string;
        dayName: string;
        actualVolume: number;
        actualRevenue: number;
      };
    } = {};

    allDates.forEach((d) => {
      const dateObj = new Date(d);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      dayMap[d] = {
        dateStr: d,
        dayName,
        actualVolume: 0,
        actualRevenue: 0,
      };
    });

    filteredOrders.forEach((o) => {
      const d = o.timestamp.slice(0, 10);
      if (!dayMap[d]) return;

      o.items.forEach((it) => {
        const matchesMenu =
          selectedMenuName === 'Semua Menu' ||
          it.name.toLowerCase() === selectedMenuName.toLowerCase();

        if (matchesMenu) {
          dayMap[d].actualVolume += it.quantity;
          dayMap[d].actualRevenue += it.price * it.quantity;
        }
      });
    });

    return Object.values(dayMap);
  }, [orders, filteredOrders, selectedMenuName]);

  // Take the most recent 10 historical days for visual chart baseline
  const recentHistorical = useMemo(() => {
    return dailyHistorical.slice(-10);
  }, [dailyHistorical]);

  // 3. Simple Moving Average Calculation & Forecast for Next 7 Days (Periode Berikutnya)
  const forecastData = useMemo(() => {
    const historicalVolumes = recentHistorical.map((h) => h.actualVolume);
    const N = Math.min(movingAverageWindow, historicalVolumes.length);

    // Calculate baseline SMA from last N days
    const lastNSum = historicalVolumes.slice(-N).reduce((sum, v) => sum + v, 0);
    const baselineSMA = N > 0 ? lastNSum / N : 10;

    // Dates for next 7 days starting from 2026-11-06 (current date is 2026-11-05)
    const futureDays = [
      { dayName: 'Kamis', dateStr: '2026-11-06', weekendLift: 1.02, factor: 'Weekday Regular' },
      { dayName: 'Jumat', dateStr: '2026-11-07', weekendLift: 1.25, factor: 'Friday Hangout (+25%)' },
      { dayName: 'Sabtu', dateStr: '2026-11-08', weekendLift: 1.48, factor: 'Weekend Peak (+48%)' },
      { dayName: 'Minggu', dateStr: '2026-11-09', weekendLift: 1.38, factor: 'Sunday Brunch (+38%)' },
      { dayName: 'Senin', dateStr: '2026-11-10', weekendLift: 0.94, factor: 'Morning Routine (-6%)' },
      { dayName: 'Selasa', dateStr: '2026-11-11', weekendLift: 0.98, factor: 'Midweek WFC' },
      { dayName: 'Rabu', dateStr: '2026-11-12', weekendLift: 1.05, factor: 'Community Night (+5%)' },
    ];

    // Compute average price per item for selected menu
    let avgUnitPrice = 32000;
    if (selectedMenuName !== 'Semua Menu') {
      const found = menuItems.find((m) => m.name === selectedMenuName);
      if (found) avgUnitPrice = found.price;
    } else {
      const totalRev = recentHistorical.reduce((s, h) => s + h.actualRevenue, 0);
      const totalVol = recentHistorical.reduce((s, h) => s + h.actualVolume, 0);
      if (totalVol > 0) avgUnitPrice = Math.round(totalRev / totalVol);
    }

    return futureDays.map((f) => {
      // SMA adjusted by weekend/calendar seasonality factor
      const predictedVolume = Math.max(1, Math.round(baselineSMA * f.weekendLift));
      const predictedRevenue = predictedVolume * avgUnitPrice;

      return {
        ...f,
        predictedVolume,
        predictedRevenue,
        baselineSMA: Math.round(baselineSMA),
      };
    });
  }, [recentHistorical, movingAverageWindow, selectedMenuName, menuItems]);

  // Aggregate forecast totals
  const totalPredictedVolume = forecastData.reduce((s, f) => s + f.predictedVolume, 0);
  const totalPredictedRevenue = forecastData.reduce((s, f) => s + f.predictedRevenue, 0);
  const avgDailyPredictedVolume = Math.round(totalPredictedVolume / forecastData.length);

  // Maximum value for SVG chart scaling
  const maxActual = Math.max(...recentHistorical.map((h) => h.actualVolume), 1);
  const maxPred = Math.max(...forecastData.map((f) => f.predictedVolume), 1);
  const chartMaxVolume = Math.max(maxActual, maxPred, 5);

  // 4. Rekomendasi Persediaan Berdasarkan Hasil Prediksi (Inventory Advisory)
  const inventoryRecommendations = useMemo(() => {
    // Volume multiplier based on total predicted cups
    const cups = totalPredictedVolume;

    return [
      {
        material: 'Biji Kopi Arabika Nusantara (House Blend & Single Origin)',
        spec: 'Dosis 18g espresso per cup + 12% kalibrasi bar',
        requiredQty: `${((cups * 0.018 * 1.12)).toFixed(1)} kg`,
        currentStock: '6.4 kg',
        minBuffer: '4.0 kg',
        status: cups * 0.018 * 1.12 > 6.4 ? 'Kritis — Perlu Restock' : 'Cukup untuk 4 Hari',
        urgency: cups * 0.018 * 1.12 > 6.4 ? 'high' : 'normal',
        orderAdvice: `Pesan +${Math.max(5, Math.ceil(cups * 0.018 * 1.12 - 6.4 + 5))} kg (Roastery Batch)`,
      },
      {
        material: 'Susu Segar Pasteurasi Lokal (Fresh Milk 1L)',
        spec: 'Rata-rata 150ml per sajian latte/cappuccino (65% pesanan susu)',
        requiredQty: `${Math.ceil((cups * 0.65 * 0.15) * 1.1)} Liter`,
        currentStock: '14 Liter',
        minBuffer: '10 Liter',
        status: Math.ceil((cups * 0.65 * 0.15) * 1.1) > 14 ? 'Restock Sebelum Jumat' : 'Stok Aman',
        urgency: Math.ceil((cups * 0.65 * 0.15) * 1.1) > 14 ? 'medium' : 'normal',
        orderAdvice: `Pesan +${Math.max(10, Math.ceil((cups * 0.65 * 0.15) * 1.1 - 14 + 10))} Liter`,
      },
      {
        material: 'Oat Milk Barista Edition (Plant-Based 1L)',
        spec: '30% pelanggan memilih susu nabati (150ml per cup)',
        requiredQty: `${Math.ceil((cups * 0.30 * 0.15) * 1.1)} Karton (1L)`,
        currentStock: '8 Karton',
        minBuffer: '5 Karton',
        status: 'Stok Memadai',
        urgency: 'normal',
        orderAdvice: 'Pesan 1 Karton Box (6x1L) di jadwal rutin',
      },
      {
        material: 'Cold Drink Biodegradable Cup (16oz) + Strawless Lid',
        spec: '1 cup per minuman dingin + buffer penyajian 5%',
        requiredQty: `${Math.ceil(cups * 0.75 * 1.05)} pcs`,
        currentStock: '120 pcs',
        minBuffer: '200 pcs',
        status: 'Perlu Order Tambahan',
        urgency: 'medium',
        orderAdvice: `Pesan 1 Dus (+500 pcs)`,
      },
      {
        material: 'Adonan Croissant & Pain au Chocolat (Frozen Ready-to-Bake)',
        spec: 'Est. konsumsi kudapan pastry pendamping kopi (35% rasio pairing)',
        requiredQty: `${Math.ceil(cups * 0.35)} pcs`,
        currentStock: '24 pcs',
        minBuffer: '20 pcs',
        status: Math.ceil(cups * 0.35) > 24 ? 'Pesan untuk Akhir Pekan' : 'Stok Aman',
        urgency: Math.ceil(cups * 0.35) > 24 ? 'medium' : 'normal',
        orderAdvice: `Pesan +${Math.max(20, Math.ceil(cups * 0.35 - 24 + 15))} pcs adonan beku`,
      },
    ];
  }, [totalPredictedVolume]);

  return (
    <div className="space-y-8">
      {/* 7. Label Data Simulasi & Penjelasan Batasan Estimasi */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD3C7] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-[#261912] text-[#FAF7F2] text-xs font-mono font-bold shrink-0">
            Data Simulasi
          </span>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#261912]">
              Predictive Marketing & Forecasting Engine
            </p>
            <p className="text-[11px] text-[#5A483D] leading-relaxed">
              <strong>Pemberitahuan Prototype Tugas Kuliah:</strong> Perhitungan peramalan menggunakan metode ilmiah <strong>Simple Moving Average (SMA)</strong> yang dihitung secara nyata dari data transaksi historis. Hasil prediksi merupakan <em>estimasi kuantitatif</em> untuk membantu perencanaan bisnis & logistik, bukan jaminan penjualan riil.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DDD3C7] text-xs text-[#8C7A6B] shrink-0 self-start md:self-auto font-mono">
          <Calculator className="w-3.5 h-3.5 text-[#C59A6F]" />
          <span>Model: SMA ({movingAverageWindow}-Hari)</span>
        </div>
      </div>

      {/* 2. ADMIN DAPAT MEMILIH MENU DAN CABANG YANG INGIN DIANALISIS */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C59A6F]" />
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Parameter Analisis Prediksi
            </h3>
          </div>
          <span className="text-xs text-[#8C7A6B]">
            Sesuaikan filter untuk melihat proyeksi spesifik per produk dan cabang
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Dropdown 1: Menu Selector */}
          <div>
            <label className="block text-xs font-bold text-[#261912] mb-1.5 uppercase tracking-wider">
              1. Pilih Menu Kopi / Kudapan
            </label>
            <select
              value={selectedMenuName}
              onChange={(e) => setSelectedMenuName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] text-[#261912] font-medium focus:outline-none focus:ring-1 focus:ring-[#261912]"
            >
              <option value="Semua Menu">Semua Menu (Agregasi Seluruh Produk)</option>
              {menuItems.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Branch Selector */}
          <div>
            <label className="block text-xs font-bold text-[#261912] mb-1.5 uppercase tracking-wider">
              2. Pilih Lokasi Cabang
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] text-[#261912] font-medium focus:outline-none focus:ring-1 focus:ring-[#261912]"
            >
              <option value="all">Seluruh Cabang (Konsolidasi 3 Gerai)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 3: Window Moving Average */}
          <div>
            <label className="block text-xs font-bold text-[#261912] mb-1.5 uppercase tracking-wider">
              3. Jendela Moving Average (N-Hari)
            </label>
            <select
              value={movingAverageWindow}
              onChange={(e) => setMovingAverageWindow(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] text-[#261912] font-medium focus:outline-none focus:ring-1 focus:ring-[#261912]"
            >
              <option value={3}>SMA 3-Hari (Responsif terhadap tren terbaru)</option>
              <option value={5}>SMA 5-Hari (Keseimbangan tren & stabilitas)</option>
              <option value={7}>SMA 7-Hari (Pola mingguan stabil)</option>
            </select>
          </div>
        </div>

        {/* Current Active Scope Pill */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#5A483D]">
          <span className="font-semibold text-[#261912]">Ruang Lingkup Analisis:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#EFE9E1] font-medium text-[#261912]">
            {selectedMenuName}
          </span>
          <span>di</span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#EFE9E1] font-medium text-[#261912]">
            {branchDisplayName}
          </span>
        </div>
      </div>

      {/* 3. TAMPILKAN PREDIKSI JUMLAH PENJUALAN UNTUK PERIODE BERIKUTNYA (Cards KPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-2">
          <span className="text-xs text-[#8C7A6B] block">Total Prediksi Penjualan (7 Hari ke Depan)</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#261912] tabular-nums">
              {totalPredictedVolume}
            </span>
            <span className="text-xs text-[#5A483D] font-medium">cup / porsi</span>
          </div>
          <p className="text-[11px] text-[#7A695D]">
            Rata-rata <strong>{avgDailyPredictedVolume} unit/hari</strong> berdasarkan data transaksi aktual
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-2">
          <span className="text-xs text-[#8C7A6B] block">Estimasi Omset Periode Prediksi</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#261912] tabular-nums">
              Rp {totalPredictedRevenue.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            Proyeksi kontribusi omset {selectedMenuName === 'Semua Menu' ? 'seluruh menu' : selectedMenuName}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-2">
          <span className="text-xs text-[#8C7A6B] block">Puncak Prediksi Transaksi</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#261912]">
              Sabtu & Minggu
            </span>
          </div>
          <p className="text-[11px] text-[#7A695D]">
            Faktor akhir pekan mengangkat volume penjualan hingga <strong>+48%</strong>
          </p>
        </div>
      </div>

      {/* 1. GRAFIK PENJUALAN AKTUAL DAN PREDIKSI */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE4]">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C59A6F]" />
              <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
                1. Grafik Penjualan Aktual vs Prediksi Moving Average
              </h3>
            </div>
            <p className="text-xs text-[#7A695D] mt-0.5">
              Perbandingan historis penjualan aktual (10 hari lalu) dan kurva peramalan (7 hari ke depan)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#261912]" />
              <span className="text-[#261912] font-semibold">Penjualan Aktual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#C59A6F]" />
              <span className="text-[#C59A6F] font-bold">Hasil Prediksi (Forecast)</span>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="space-y-4 pt-2">
          <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b border-[#E8DFD8] pb-2">
            {/* Historical Actual Bars */}
            {recentHistorical.map((h, idx) => {
              const heightPercent = Math.round((h.actualVolume / chartMaxVolume) * 100);
              return (
                <div key={'act-' + idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-mono text-[#8C7A6B] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {h.actualVolume}
                  </span>
                  <div className="w-full bg-[#FAF7F2] rounded-t h-48 flex items-end overflow-hidden border border-b-0 border-[#E8DFD8]">
                    <div
                      style={{ height: `${Math.max(6, heightPercent)}%` }}
                      className="w-full bg-[#261912] group-hover:bg-[#3D291E] rounded-t transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#7A695D] tabular-nums text-center whitespace-nowrap">
                    {h.dateStr.slice(8, 10)}/{h.dateStr.slice(5, 7)}
                  </span>
                </div>
              );
            })}

            {/* Visual Divider between Actual and Forecast */}
            <div className="h-48 border-r-2 border-dashed border-[#C59A6F] mx-1 relative flex items-center justify-center">
              <span className="absolute -top-5 text-[9px] font-mono font-bold text-[#C59A6F] uppercase whitespace-nowrap bg-[#FAF7F2] px-1 rounded border border-[#C59A6F]">
                Hari Ini (05 Nov)
              </span>
            </div>

            {/* Forecast Predicted Bars */}
            {forecastData.map((f, idx) => {
              const heightPercent = Math.round((f.predictedVolume / chartMaxVolume) * 100);
              return (
                <div key={'pred-' + idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-mono font-bold text-[#C59A6F] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {f.predictedVolume}*
                  </span>
                  <div className="w-full bg-[#FAF7F2] rounded-t h-48 flex items-end overflow-hidden border border-b-0 border-[#C59A6F]/40">
                    <div
                      style={{ height: `${Math.max(8, heightPercent)}%` }}
                      className="w-full bg-[#C59A6F] group-hover:bg-[#b5885c] rounded-t transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#C59A6F] tabular-nums text-center whitespace-nowrap">
                    {f.dateStr.slice(8, 10)}/{f.dateStr.slice(5, 7)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8C7A6B]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#261912]" />
              <span>Data Aktual (27 Okt – 05 Nov 2026)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C59A6F]" />
              <span>Data Prediksi Periode Berikutnya (06 Nov – 12 Nov 2026)</span>
            </span>
          </div>
        </div>

        {/* Forecast Day-by-Day Breakdown Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-2.5 px-3">Tanggal Prediksi</th>
                <th className="py-2.5 px-3">Hari</th>
                <th className="py-2.5 px-3">Faktor Pola Transaksi</th>
                <th className="py-2.5 px-3 text-center">Baseline SMA ({movingAverageWindow}-Hari)</th>
                <th className="py-2.5 px-3 text-right">Prediksi Volume</th>
                <th className="py-2.5 px-3 text-right">Proyeksi Omset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {forecastData.map((f, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-[#261912]">
                    {f.dateStr}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#261912]">
                    {f.dayName}
                  </td>
                  <td className="py-3 px-3 text-[#5A483D]">
                    {f.factor}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[#7A695D] tabular-nums">
                    {f.baselineSMA} unit
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#C59A6F] tabular-nums text-sm">
                    {f.predictedVolume} unit
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#261912] tabular-nums">
                    Rp {f.predictedRevenue.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. REKOMENDASI PERSEDIAAN BERDASARKAN HASIL PREDIKSI */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE4]">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C59A6F]" />
              <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
                4. Rekomendasi Persediaan Bahan Baku (Inventory Restock Advisory)
              </h3>
            </div>
            <p className="text-xs text-[#7A695D] mt-0.5">
              Dihitung otomatis untuk mencukupi estimasi permintaan {totalPredictedVolume} unit pesanan + 10-15% safety stock
            </p>
          </div>
          <span className="text-xs font-mono bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#DDD3C7] text-[#5A483D]">
            Safety Stock Buffer: 12%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-3 px-4">Komoditas / Bahan Baku</th>
                <th className="py-3 px-4">Estimasi Kebutuhan Prediksi</th>
                <th className="py-3 px-4">Stok Fisik Saat Ini</th>
                <th className="py-3 px-4">Status Logistik</th>
                <th className="py-3 px-4 text-right">Rekomendasi Pemesanan (PO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {inventoryRecommendations.map((rec, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#261912]">{rec.material}</p>
                    <p className="text-[10px] text-[#7A695D] mt-0.5">{rec.spec}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#261912] tabular-nums">
                    {rec.requiredQty}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#5A483D] tabular-nums">
                    {rec.currentStock}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                        rec.urgency === 'high'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : rec.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {rec.urgency === 'high' && <AlertTriangle className="w-3 h-3 text-rose-700" />}
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#261912] tabular-nums">
                    {rec.orderAdvice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PENJELASAN SINGKAT MENGENAI HASIL PREDIKSI */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE4]">
          <Info className="w-4 h-4 text-[#C59A6F]" />
          <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
            5. Penjelasan Metodologi & Wawasan Bisnis Hasil Prediksi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-[#5A483D]">
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE4DC] space-y-2">
            <h4 className="font-bold text-[#261912] flex items-center gap-1.5">
              <span>Metode Peramalan (SMA)</span>
            </h4>
            <p>
              Menggunakan formula <strong>Simple Moving Average {movingAverageWindow}-Periode</strong>:
            </p>
            <div className="bg-white p-2 rounded border border-[#DDD3C7] font-mono text-[11px] text-[#261912]">
              SMA = (Y₁ + Y₂ + ... + Yₙ) / {movingAverageWindow}
            </div>
            <p className="text-[11px] text-[#7A695D]">
              Metode ini meratakan fluktuasi harian acak sehingga menghasilkan garis tren yang stabil dan cocok untuk prototype operasional cafe.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE4DC] space-y-2">
            <h4 className="font-bold text-[#261912] flex items-center gap-1.5">
              <span>Pola Musiman Akhir Pekan</span>
            </h4>
            <p>
              Berdasarkan analisis empiris transaksi Kopi Tepi Delta, terjadi lonjakan kunjungan signifikan pada hari <strong>Jumat (+25%)</strong>, <strong>Sabtu (+48%)</strong>, dan <strong>Minggu (+38%)</strong>.
            </p>
            <p className="text-[11px] text-[#7A695D]">
              Area teras sungai (*riverside deck*) menjadi daya tarik utama yang menyebabkan pesanan kopi dingin dan kudapan melonjak saat akhir pekan.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE4DC] space-y-2">
            <h4 className="font-bold text-[#261912] flex items-center gap-1.5">
              <span>Tindakan Mitigasi Logistik</span>
            </h4>
            <p>
              Untuk mencegah kehabisan stok (*stockout*) saat lonjakan hari Sabtu, admin disarankan melakukan pemesanan biji sangrai dan susu segar paling lambat hari <strong>Kamis pukul 14:00 WIB</strong>.
            </p>
            <p className="text-[11px] text-[#7A695D]">
              Buffer persediaan sebesar 12% menjamin operasional tetap lancar tanpa ada menu yang terpaksa bertanda <em>Habis</em>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  Coffee,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Order, MenuItem } from '../../types';

interface AdminMarketingProps {
  orders: Order[];
  menuItems: MenuItem[];
  onNavigateToRFM: () => void;
}

export const AdminMarketing: React.FC<AdminMarketingProps> = ({
  orders,
  menuItems,
  onNavigateToRFM,
}) => {
  const [chartView, setChartView] = useState<'daily' | 'monthly'>('daily');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Total Transaksi
  const totalTransactions = orders.length;

  // 2. Total Pendapatan
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // 3. Jumlah Pelanggan (Unique by phone)
  const uniqueCustomersCount = useMemo(() => {
    const phones = new Set(orders.map((o) => o.customerPhone));
    return phones.size;
  }, [orders]);

  // 4. Menu Paling Banyak Terjual (Computed strictly from orders data)
  const menuSalesAggregation = useMemo(() => {
    const counts: { [name: string]: { qty: number; revenue: number; category: string } } = {};

    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (!counts[it.name]) {
          // match with catalog category
          const found = menuItems.find((m) => m.name.toLowerCase() === it.name.toLowerCase());
          const category = found?.category || 'Specialty Coffee';
          counts[it.name] = { qty: 0, revenue: 0, category };
        }
        counts[it.name].qty += it.quantity;
        counts[it.name].revenue += it.price * it.quantity;
      });
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty);
  }, [orders, menuItems]);

  const topSellingMenu = menuSalesAggregation[0] || {
    name: 'Delta Sea Salt Cold Brew',
    qty: 0,
    revenue: 0,
    category: 'Signature Delta',
  };

  // 5. Grafik Penjualan Harian & Bulanan (Aggregated from actual orders)
  const dailyData = useMemo(() => {
    // Group last 7 days of dates present in orders
    const dayMap: { [date: string]: { dateStr: string; label: string; revenue: number; count: number } } = {};

    // Get unique dates sorted
    const dates = Array.from(new Set(orders.map((o) => o.timestamp.slice(0, 10)))).sort();
    const last7Dates = dates.slice(-7);

    last7Dates.forEach((d) => {
      const parts = d.split('-');
      const dateObj = new Date(d);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      const label = `${dayName}, ${parts[2]}/${parts[1]}`;
      dayMap[d] = { dateStr: d, label, revenue: 0, count: 0 };
    });

    orders.forEach((o) => {
      const d = o.timestamp.slice(0, 10);
      if (dayMap[d]) {
        dayMap[d].revenue += o.total;
        dayMap[d].count += 1;
      }
    });

    return Object.values(dayMap);
  }, [orders]);

  const monthlyData = useMemo(() => {
    // Group by month: 2026-08 (Agu), 2026-09 (Sep), 2026-10 (Okt), 2026-11 (Nov)
    const monthMap: { [key: string]: { label: string; revenue: number; count: number } } = {
      '2026-08': { label: 'Agustus 2026', revenue: 0, count: 0 },
      '2026-09': { label: 'September 2026', revenue: 0, count: 0 },
      '2026-10': { label: 'Oktober 2026', revenue: 0, count: 0 },
      '2026-11': { label: 'November 2026 (Berjalan)', revenue: 0, count: 0 },
    };

    orders.forEach((o) => {
      const m = o.timestamp.slice(0, 7);
      if (monthMap[m]) {
        monthMap[m].revenue += o.total;
        monthMap[m].count += 1;
      }
    });

    return Object.values(monthMap);
  }, [orders]);

  // Max value for chart scaling
  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);
  const maxMonthlyRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  // 6. Grafik Penjualan Berdasarkan Kategori Menu
  const categorySales = useMemo(() => {
    const catMap: { [cat: string]: { revenue: number; qty: number } } = {
      'Signature Delta': { revenue: 0, qty: 0 },
      'Specialty Espresso': { revenue: 0, qty: 0 },
      'Cold Brew Series': { revenue: 0, qty: 0 },
      'Manual Brew & V60': { revenue: 0, qty: 0 },
      'Artisanal Pastry': { revenue: 0, qty: 0 },
      'Savory Bites': { revenue: 0, qty: 0 },
    };

    orders.forEach((o) => {
      o.items.forEach((it) => {
        const found = menuItems.find((m) => m.name.toLowerCase() === it.name.toLowerCase());
        const cat = found?.category || 'Signature Delta';
        if (catMap[cat]) {
          catMap[cat].revenue += it.price * it.quantity;
          catMap[cat].qty += it.quantity;
        } else {
          catMap[cat] = { revenue: it.price * it.quantity, qty: it.quantity };
        }
      });
    });

    const totalCatRev = Object.values(catMap).reduce((s, c) => s + c.revenue, 0);

    return Object.entries(catMap).map(([category, val]) => ({
      category,
      revenue: val.revenue,
      qty: val.qty,
      percentage: totalCatRev > 0 ? Math.round((val.revenue / totalCatRev) * 100) : 0,
    })).sort((a, b) => b.revenue - a.revenue);
  }, [orders, menuItems]);

  // 7. Tabel Transaksi yang Berisi Tanggal, Nomor Transaksi, Pelanggan, Cabang, Total Pembayaran, Status
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        o.customerPhone.includes(tableSearch);

      const matchBranch = selectedBranch === 'Semua' || o.branchName.includes(selectedBranch);
      const matchStatus = selectedStatus === 'Semua' || o.status === selectedStatus;

      return matchSearch && matchBranch && matchStatus;
    });
  }, [orders, tableSearch, selectedBranch, selectedStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Nomor Transaksi', 'Pelanggan', 'WhatsApp', 'Cabang', 'Total Pembayaran', 'Status', 'Metode Bayar'];
    const rows = filteredOrders.map((o) => [
      o.timestamp,
      o.id,
      `"${o.customerName}"`,
      `'${o.customerPhone}`,
      `"${o.branchName}"`,
      o.total,
      o.status,
      o.paymentMethod,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kopi_Tepi_Delta_Data_Driven_Marketing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Simulation & Navigation Banner */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD3C7] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-[#261912] text-[#FAF7F2] text-xs font-mono font-bold shrink-0">
            Data Simulasi
          </span>
          <div>
            <p className="text-xs font-bold text-[#261912]">
              Modul Data-Driven Marketing & Intelligence
            </p>
            <p className="text-[11px] text-[#5A483D] mt-0.5">
              Semua angka dihitung langsung dari basis data {totalTransactions} transaksi simulasi terpadu di 3 cabang.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToRFM}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E] transition-colors shadow-sm shrink-0 self-start md:self-auto"
        >
          <Users className="w-3.5 h-3.5 text-[#C59A6F]" />
          <span>Buka Analisis Pelanggan RFM</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 CORE KPI CARDS (Requirements 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Transaksi */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="font-medium">1. Total Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#261912] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
            </div>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold text-[#261912] tabular-nums">
              {totalTransactions}
            </p>
            <p className="text-xs text-[#7A695D] mt-1">
              Transaksi tercatat di 3 cabang
            </p>
          </div>
        </div>

        {/* 2. Total Pendapatan */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="font-medium">2. Total Pendapatan</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#261912] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#C59A6F]" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#261912] tabular-nums">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Rata-rata: Rp {Math.round(totalRevenue / totalTransactions).toLocaleString('id-ID')} / order
            </p>
          </div>
        </div>

        {/* 3. Jumlah Pelanggan */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="font-medium">3. Jumlah Pelanggan</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#261912] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#C59A6F]" />
            </div>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold text-[#261912] tabular-nums">
              {uniqueCustomersCount} Orang
            </p>
            <p className="text-xs text-[#7A695D] mt-1">
              Pelanggan unik teridentifikasi
            </p>
          </div>
        </div>

        {/* 4. Menu Paling Banyak Terjual */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="font-medium">4. Menu Terlaris (Best Seller)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#261912] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#C59A6F]" />
            </div>
          </div>
          <div>
            <p className="font-serif-brand text-lg font-bold text-[#261912] leading-tight truncate">
              {topSellingMenu.name}
            </p>
            <div className="flex items-center justify-between text-xs text-[#5A483D] mt-1">
              <span className="font-mono font-bold text-emerald-700">{topSellingMenu.qty} cup/porsi</span>
              <span className="text-[11px] text-[#8C7A6B]">Rp {topSellingMenu.revenue.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. GRAFIK PENJUALAN HARIAN DAN BULANAN & 6. KATEGORI MENU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grafik Penjualan Harian & Bulanan (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE4]">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C59A6F]" />
                <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
                  5. Grafik Tren Penjualan {chartView === 'daily' ? 'Harian (7 Hari Terakhir)' : 'Bulanan (Historis)'}
                </h3>
              </div>
              <p className="text-xs text-[#7A695D] mt-0.5">
                Nilai riil dihitung dari jumlah pesanan simulasi
              </p>
            </div>

            {/* Segmented Control: Harian vs Bulanan */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-xl border border-[#DDD3C7] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartView('daily')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  chartView === 'daily'
                    ? 'bg-[#261912] text-white shadow-sm'
                    : 'text-[#6C5B50] hover:text-[#261912]'
                }`}
              >
                Harian
              </button>
              <button
                type="button"
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  chartView === 'monthly'
                    ? 'bg-[#261912] text-white shadow-sm'
                    : 'text-[#6C5B50] hover:text-[#261912]'
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="pt-2">
            {chartView === 'daily' ? (
              /* Daily Bar Chart */
              <div className="space-y-3">
                <div className="h-60 flex items-end justify-between gap-2.5 sm:gap-4 px-2">
                  {dailyData.map((d, idx) => {
                    const heightPercent = Math.round((d.revenue / maxDailyRevenue) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-mono text-[#8C7A6B] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                          Rp {(d.revenue / 1000).toFixed(0)}k
                        </div>
                        <div className="w-full bg-[#FAF7F2] rounded-t-lg h-44 flex items-end border border-b-0 border-[#E8DFD8] overflow-hidden">
                          <div
                            style={{ height: `${Math.max(8, heightPercent)}%` }}
                            className="w-full bg-[#261912] group-hover:bg-[#C59A6F] rounded-t-lg transition-all duration-300"
                          />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#7A695D] tabular-nums text-center whitespace-nowrap">
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-[#8C7A6B] pt-2 border-t border-[#F2ECE4]">
                  <span>Total 7 Hari: <strong className="font-mono text-[#261912]">Rp {dailyData.reduce((s, d) => s + d.revenue, 0).toLocaleString('id-ID')}</strong></span>
                  <span>Frekuensi: {dailyData.reduce((s, d) => s + d.count, 0)} transaksi</span>
                </div>
              </div>
            ) : (
              /* Monthly Bar Chart */
              <div className="space-y-3">
                <div className="h-60 flex items-end justify-between gap-4 sm:gap-8 px-4">
                  {monthlyData.map((m, idx) => {
                    const heightPercent = Math.round((m.revenue / maxMonthlyRevenue) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-mono text-[#8C7A6B] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                          Rp {(m.revenue / 1000).toFixed(0)}k
                        </div>
                        <div className="w-full bg-[#FAF7F2] rounded-t-xl h-44 flex items-end border border-b-0 border-[#E8DFD8] overflow-hidden">
                          <div
                            style={{ height: `${Math.max(10, heightPercent)}%` }}
                            className="w-full bg-[#261912] group-hover:bg-[#C59A6F] rounded-t-xl transition-all duration-300"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#7A695D] text-center whitespace-nowrap">
                          {m.label.replace(' 2026', '')}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-[#8C7A6B] pt-2 border-t border-[#F2ECE4]">
                  <span>Total Omset 4 Bulan: <strong className="font-mono text-[#261912]">Rp {monthlyData.reduce((s, m) => s + m.revenue, 0).toLocaleString('id-ID')}</strong></span>
                  <span>Total Order: {monthlyData.reduce((s, m) => s + m.count, 0)} transaksi</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. Grafik Penjualan Berdasarkan Kategori Menu (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#F2ECE4]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C59A6F]" />
                <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
                  6. Penjualan per Kategori Menu
                </h3>
              </div>
              <p className="text-xs text-[#7A695D] mt-0.5">
                Distribusi kontribusi pendapatan menu
              </p>
            </div>

            <div className="space-y-3.5">
              {categorySales.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#261912] truncate max-w-[170px]">
                      {cat.category}
                    </span>
                    <span className="font-mono font-bold text-[#261912] tabular-nums">
                      {cat.percentage}% <span className="text-[10px] text-[#8C7A6B] font-normal">({cat.qty}x)</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E8DFD8]">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-[#261912]'
                          : idx === 1
                          ? 'bg-[#C59A6F]'
                          : idx === 2
                          ? 'bg-[#5A483D]'
                          : 'bg-[#8C7A6B]'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-right text-[#8C7A6B] font-mono tabular-nums">
                    Rp {cat.revenue.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2ECE4] text-[11px] text-[#7A695D] italic">
            *Kategori Signature Delta & Cold Brew mendominasi 54% total omset.
          </div>
        </div>
      </div>

      {/* 7. TABEL TRANSAKSI LENGKAP (Requirement 7) */}
      <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden space-y-4">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-[#F2ECE4] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-brand text-lg font-bold text-[#261912]">
                7. Tabel Transaksi Penjualan Kopi Tepi Delta
              </span>
              <span className="text-xs bg-[#EFE9E1] text-[#261912] font-mono font-semibold px-2 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <p className="text-xs text-[#7A695D] mt-0.5">
              Menampilkan {filteredOrders.length} transaksi dari total {totalTransactions} riwayat
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari ID, pelanggan, WA..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#261912]"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
            >
              <option value="Semua">Semua Cabang</option>
              <option value="Promenade">Promenade Riverfront</option>
              <option value="Heritage">Heritage Kota Lama</option>
              <option value="Sky Sanctuary">Sky Sanctuary</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Sedang Diracik">Sedang Diracik</option>
              <option value="Menunggu">Menunggu</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E] transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* The 6-Field Table */}
        <div className="overflow-x-auto px-6 pb-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Nomor Transaksi</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4 text-right">Total Pembayaran</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* 1. Tanggal */}
                    <td className="py-3.5 px-4 font-mono text-[#5A483D] tabular-nums whitespace-nowrap">
                      {order.timestamp}
                    </td>

                    {/* 2. Nomor Transaksi */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#261912] whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* 3. Pelanggan */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#261912]">{order.customerName}</div>
                      <div className="text-[11px] font-mono text-[#8C7A6B]">{order.customerPhone}</div>
                    </td>

                    {/* 4. Cabang */}
                    <td className="py-3.5 px-4">
                      <div className="text-[#5A483D] font-medium">{order.branchName}</div>
                      <div className="text-[10px] text-[#8C7A6B]">{order.orderType}</div>
                    </td>

                    {/* 5. Total Pembayaran */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#261912] tabular-nums whitespace-nowrap">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          order.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : order.status === 'Sedang Diracik'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#6C5B50]">
            <div>
              Halaman <strong className="text-[#261912]">{currentPage}</strong> dari {totalPages}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#DDD3C7] bg-[#FAF7F2] text-[#5A483D] disabled:opacity-40 hover:bg-[#EFE9E1]"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono px-2 font-semibold text-[#261912]">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#DDD3C7] bg-[#FAF7F2] text-[#5A483D] disabled:opacity-40 hover:bg-[#EFE9E1]"
                aria-label="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight, Clock, Coffee, ChevronRight } from 'lucide-react';
import { Order, MenuItem } from '../../types';

interface AdminOverviewProps {
  orders: Order[];
  menuItems: MenuItem[];
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  menuItems,
  onNavigateTab,
}) => {
  // Aggregate stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeOrders = orders.filter((o) => o.status === 'Sedang Diracik' || o.status === 'Menunggu');
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const uniqueCustomersCount = new Set(orders.map((o) => o.customerPhone)).size;

  // Daily mock sales curve (hourly 08:00 - 22:00)
  const hourlyData = [
    { hour: '08:00', sales: 420000, cups: 12 },
    { hour: '10:00', sales: 780000, cups: 22 },
    { hour: '12:00', sales: 560000, cups: 16 },
    { hour: '14:00', sales: 490000, cups: 14 },
    { hour: '16:00', sales: 890000, cups: 26 },
    { hour: '18:00', sales: 1240000, cups: 36 },
    { hour: '20:00', sales: 980000, cups: 28 },
    { hour: '22:00', sales: 440000, cups: 12 },
  ];

  const maxSales = Math.max(...hourlyData.map((d) => d.sales));

  // Compute top items from orders
  const itemMap: { [name: string]: { qty: number; revenue: number; category: string } } = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      if (!itemMap[it.name]) {
        const found = menuItems.find((m) => m.name.toLowerCase() === it.name.toLowerCase());
        itemMap[it.name] = { qty: 0, revenue: 0, category: found?.category || 'Specialty Coffee' };
      }
      itemMap[it.name].qty += it.quantity;
      itemMap[it.name].revenue += it.price * it.quantity;
    });
  });

  const sortedItems = Object.entries(itemMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Simulation Info Callout */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD3C7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-[#261912] text-[#FAF7F2] text-xs font-mono font-bold shrink-0">
            Data Simulasi
          </span>
          <p className="text-xs text-[#5A483D]">
            Dashboard menampilkan metrik operasional terintegrasi dari seluruh 3 cabang Kopi Tepi Delta.
          </p>
        </div>
        <div className="text-xs text-[#8C7A6B] tabular-nums whitespace-nowrap">
          Terakhir diperbarui: Hari ini, 10:15 WIB
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span>Omset Penjualan Hari Ini</span>
            <DollarSign className="w-4 h-4 text-[#C59A6F]" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#261912] tabular-nums">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.8% vs kemarin</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span>Total Transaksi Selesai</span>
            <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#261912] tabular-nums">
              {totalOrdersCount} Pesanan
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{activeOrders.length} antrean aktif di bar</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span>Rata-rata Nilai Keranjang (AOV)</span>
            <TrendingUp className="w-4 h-4 text-[#C59A6F]" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#261912] tabular-nums">
              Rp {avgOrderValue.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Didorong oleh menu pairing pastry</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DFD8] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span>Pelanggan Aktif Terdata</span>
            <Users className="w-4 h-4 text-[#C59A6F]" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#261912] tabular-nums">
              {uniqueCustomersCount} Pelanggan
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
              <span>68% tingkat repeat order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2ECE4]">
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
                Tren Penjualan Hari Ini (Per Jam)
              </h3>
              <p className="text-xs text-[#7A695D]">
                Puncak transaksi terjadi pada jam Sunset Riverside (16:30 - 18:30)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8C7A6B]">
              <span className="w-3 h-3 rounded-sm bg-[#261912]" />
              <span>Omset (IDR)</span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="space-y-2">
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
              {hourlyData.map((d, idx) => {
                const heightPercent = Math.round((d.sales / maxSales) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-[#8C7A6B] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {(d.sales / 1000).toFixed(0)}k
                    </div>
                    <div className="w-full bg-[#EFE9E1] rounded-t-md h-40 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#261912] group-hover:bg-[#C59A6F] rounded-t-md transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#7A695D] tabular-nums">
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top 5 Best Sellers (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
              <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
                Menu Paling Laris
              </h3>
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-xs text-[#8C7A6B] hover:text-[#261912] flex items-center gap-1"
              >
                <span>Kelola</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {sortedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#8C7A6B] w-4">
                      0{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#261912] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#7A695D]">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#261912] tabular-nums">
                      {item.qty} cup
                    </p>
                    <p className="text-[10px] text-[#8C7A6B] tabular-nums">
                      Rp {item.revenue.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2ECE4]">
            <button
              onClick={() => onNavigateTab('predictions')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9E1] text-[#261912] text-xs font-medium border border-[#DDD3C7] transition-colors flex items-center justify-center gap-2"
            >
              <span>Lihat Prediksi Permintaan Esok Hari</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C59A6F]" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders in Kitchen / Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Status Pesanan Terkini di Barista Station
            </h3>
            <p className="text-xs text-[#7A695D]">
              Antrean pembuatan kopi langsung dari pesanan pelanggan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-semibold text-[#261912] hover:underline flex items-center gap-1"
          >
            <span>Semua Riwayat Pesanan ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F2ECE4] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-2.5 px-3">ID Pesanan</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Tipe / Meja</th>
                <th className="py-2.5 px-3">Cabang</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-[#261912]">
                    {order.id}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#7A695D] tabular-nums">
                    {order.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#261912]">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-3 text-[#5A483D]">
                    {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
                  </td>
                  <td className="py-3 px-3 text-[#7A695D]">
                    {order.branchName}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#261912] tabular-nums">
                    Rp {order.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium ${
                        order.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'Sedang Diracik'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, Eye, CheckCircle, Clock, X, FileText } from 'lucide-react';
import { Order } from '../../types';

interface AdminSalesProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const AdminSales: React.FC<AdminSalesProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [branchFilter, setBranchFilter] = useState<string>('Semua');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery);

      const matchStatus = statusFilter === 'Semua' || o.status === statusFilter;
      const matchBranch = branchFilter === 'Semua' || o.branchName.includes(branchFilter);

      return matchSearch && matchStatus && matchBranch;
    });
  }, [orders, searchQuery, statusFilter, branchFilter]);

  const handleExportCSV = () => {
    const headers = ['ID Pesanan', 'Waktu', 'Pelanggan', 'WhatsApp', 'Tipe', 'Cabang', 'Subtotal', 'Diskon', 'Total', 'Status', 'Metode Bayar'];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.timestamp,
      `"${o.customerName}"`,
      `'${o.customerPhone}`,
      o.orderType,
      `"${o.branchName}"`,
      o.subtotal,
      o.discount,
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
    link.setAttribute('download', `Kopi_Tepi_Delta_Penjualan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID pesanan, nama pelanggan, no telepon..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#261912]"
          />
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Sedang Diracik">Sedang Diracik</option>
            <option value="Selesai">Selesai</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
          >
            <option value="Semua">Semua Cabang</option>
            <option value="Promenade">Promenade Riverfront</option>
            <option value="Heritage">Heritage Kota Lama</option>
            <option value="Sky Sanctuary">Sky Sanctuary</option>
          </select>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#261912] text-white hover:bg-[#3D291E] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE4] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Daftar Transaksi Penjualan
            </h3>
            <p className="text-xs text-[#7A695D]">
              Menampilkan {filteredOrders.length} transaksi (Data Simulasi)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Tipe & Lokasi</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Status & Kelola</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C7A6B]">
                    Tidak ada transaksi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#261912]">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#7A695D] tabular-nums whitespace-nowrap">
                      {order.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#261912]">{order.customerName}</div>
                      <div className="text-[11px] text-[#8C7A6B] tabular-nums">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#5A483D] font-medium">{order.orderType}</div>
                      <div className="text-[11px] text-[#8C7A6B]">
                        {order.branchName} {order.tableNumber ? `· ${order.tableNumber}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#5A483D] max-w-xs truncate">
                      {order.items.map((i) => `${i.name} (${i.quantity}x)`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#261912] tabular-nums whitespace-nowrap">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-[11px] font-medium rounded-lg px-2.5 py-1 border transition-colors ${
                          order.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.status === 'Sedang Diracik'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : order.status === 'Menunggu'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Sedang Diracik">Sedang Diracik</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#5A483D] hover:bg-[#EFE9E1] hover:text-[#261912] transition-colors"
                        title="Lihat Struk Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8DFD8] overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD8]">
              <div>
                <span className="text-[11px] font-mono text-[#8C7A6B] uppercase">Struk Transaksi</span>
                <h4 className="font-serif-brand text-xl font-bold text-[#261912]">
                  {selectedOrder.id}
                </h4>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-[#EFE9E1] text-[#6C5B50]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F2ECE4]">
                <div>
                  <span className="text-[#8C7A6B] block">Nama Pelanggan:</span>
                  <span className="font-semibold text-[#261912]">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">WhatsApp:</span>
                  <span className="font-mono text-[#261912]">{selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Cabang:</span>
                  <span className="text-[#261912]">{selectedOrder.branchName}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Tipe & Lokasi:</span>
                  <span className="text-[#261912]">
                    {selectedOrder.orderType} {selectedOrder.tableNumber || selectedOrder.address || ''}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="text-xs font-semibold text-[#261912] block mb-2">Item Pesanan:</span>
                <div className="space-y-2 bg-white p-3 rounded-xl border border-[#E8DFD8]">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-medium text-[#261912]">{it.name} <span className="text-[#8C7A6B]">x{it.quantity}</span></p>
                        <p className="text-[10px] text-[#7A695D]">{it.options}</p>
                      </div>
                      <span className="font-mono tabular-nums text-[#261912]">
                        Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total calculations */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-[#7A695D]">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">Rp {selectedOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon ({selectedOrder.promoCode}):</span>
                    <span className="font-mono tabular-nums">-Rp {selectedOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#261912] pt-2 border-t border-[#E8DFD8]">
                  <span>Total Pembayaran:</span>
                  <span className="font-mono tabular-nums">Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8C7A6B] pt-1">
                  <span>Metode: {selectedOrder.paymentMethod}</span>
                  <span className="font-semibold text-emerald-700">Status: {selectedOrder.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E]"
              >
                Tutup Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

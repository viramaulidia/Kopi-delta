import React, { useState, useMemo } from 'react';
import { Search, UserCheck, Award, Phone, Mail, Coffee } from 'lucide-react';
import { Customer } from '../../types';

interface AdminCustomersProps {
  customers: Customer[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('Semua');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTier = tierFilter === 'Semua' || c.tier === tierFilter;
      return matchSearch && matchTier;
    });
  }, [customers, searchQuery, tierFilter]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pelanggan, email, nomor WhatsApp..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#261912]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#5A483D] focus:outline-none"
          >
            <option value="Semua">Semua Tier Loyalitas</option>
            <option value="Delta Platinum">Delta Platinum (25+ visits)</option>
            <option value="Delta Gold">Delta Gold (12+ visits)</option>
            <option value="Delta Silver">Delta Silver (5+ visits)</option>
            <option value="Delta Member">Delta Member</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE4] flex items-center justify-between">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-[#261912]">
              Database Pelanggan & Keanggotaan
            </h3>
            <p className="text-xs text-[#7A695D]">
              Menampilkan {filteredCustomers.length} pelanggan terdata dalam program Delta Rewards
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#8C7A6B] uppercase font-semibold">
                <th className="py-3 px-4">ID & Nama</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Tier Loyalitas</th>
                <th className="py-3 px-4 text-center">Kunjungan</th>
                <th className="py-3 px-4 text-right">Total Belanja</th>
                <th className="py-3 px-4">Menu Favorit</th>
                <th className="py-3 px-4">Kunjungan Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#261912]">{cust.name}</div>
                    <div className="text-[10px] font-mono text-[#8C7A6B]">{cust.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[#5A483D] tabular-nums">{cust.phone}</div>
                    <div className="text-[11px] text-[#8C7A6B]">{cust.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        cust.tier === 'Delta Platinum'
                          ? 'bg-purple-100 text-purple-900'
                          : cust.tier === 'Delta Gold'
                          ? 'bg-amber-100 text-amber-900'
                          : cust.tier === 'Delta Silver'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {cust.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#261912] tabular-nums">
                    {cust.visits}x
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#261912] tabular-nums">
                    Rp {cust.totalSpent.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-[#5A483D]">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#C59A6F] shrink-0" />
                      <span>{cust.favoriteDrink}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#7A695D] tabular-nums whitespace-nowrap">
                    {cust.lastVisit}
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

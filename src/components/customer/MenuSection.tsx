import React, { useState, useMemo } from 'react';
import { Search, Plus, Sparkles, Coffee } from 'lucide-react';
import { MenuItem, ProductCategory, CartItem } from '../../types';

interface MenuSectionProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Semua',
  'Signature Delta',
  'Specialty Espresso',
  'Cold Brew Series',
  'Manual Brew & V60',
  'Artisanal Pastry',
  'Savory Bites',
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  onSelectItem,
  onQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section id="menu" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-[#8C7A6B]">
            <span>Kurasi Biji Kopi & Kudapan</span>
            <span aria-hidden="true">·</span>
            <span>Batch Sangrai Mingguan</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#261912] tracking-tight">
            Menu Kopi Tepi Delta
          </h2>
          <p className="text-sm sm:text-base text-[#6C5B50] leading-relaxed">
            Dari racikan signature cold brew yang lembut hingga seduhan manual pour over dengan cita rasa floral yang kompleks, temukan secangkir ketenangan favorit Anda.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EFE9E1] rounded-xl overflow-x-auto max-w-full scrollbar-none w-full lg:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all focus:outline-none ${
                  selectedCategory === cat
                    ? 'bg-[#261912] text-white shadow-sm'
                    : 'text-[#6C5B50] hover:text-[#261912] hover:bg-[#FAF7F2]/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi, pastry, rasa..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-[#DDD3C7] text-[#261912] placeholder-[#A8988C] focus:outline-none focus:ring-1 focus:ring-[#261912]"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#F5EFEB] rounded-2xl border border-[#E8DFD8]">
            <Coffee className="w-10 h-10 text-[#A8988C] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#261912]">Menu tidak ditemukan</p>
            <p className="text-xs text-[#7A695D] mt-1">Coba kata kunci lain atau pilih kategori Semua.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-[#E8DFD8] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image Slot */}
                <div className="relative aspect-[4/3] bg-[#EFE9E1] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.isPopular && (
                    <div className="absolute top-3 left-3 bg-[#261912] text-[#FAF7F2] text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
                      Favorit Pelanggan
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-xs font-semibold text-white bg-black/80 px-3 py-1.5 rounded-lg border border-white/20">
                        Habis Sementara
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Quiet category metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
                      <span>{item.category}</span>
                      {item.roastLevel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Roast: {item.roastLevel}</span>
                        </>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-serif-brand text-xl font-bold text-[#261912] group-hover:text-[#8C5D33] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#6C5B50] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Flavor notes */}
                    {item.notes && item.notes.length > 0 && (
                      <div className="pt-1 text-[11px] text-[#A8988C] flex flex-wrap gap-1">
                        <span>Notes:</span>
                        {item.notes.map((n, idx) => (
                          <span key={idx} className="text-[#7A695D]">
                            {n}{idx < item.notes!.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A8988C] block">
                        Harga
                      </span>
                      <span className="font-mono text-base font-bold text-[#261912] tabular-nums">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={() => onSelectItem(item)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none ${
                        item.isAvailable
                          ? 'bg-[#261912] hover:bg-[#3D291E] text-white shadow-sm'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C59A6F]" />
                      <span>Pesan & Kustomisasi</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Plus, Edit2, Check, X, Coffee, Image, DollarSign } from 'lucide-react';
import { MenuItem, ProductCategory } from '../../types';
import { ASSET_IMAGES } from '../../data/mockData';

interface AdminMenuProps {
  menuItems: MenuItem[];
  onToggleAvailability: (id: string) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
}

export const AdminMenu: React.FC<AdminMenuProps> = ({
  menuItems,
  onToggleAvailability,
  onAddMenuItem,
  onUpdateMenuItem,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for new item
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Signature Delta');
  const [newPrice, setNewPrice] = useState('32000');
  const [newDesc, setNewDesc] = useState('');
  const [newRoast, setNewRoast] = useState<'Light' | 'Medium' | 'Dark'>('Medium');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const parsedPrice = parseInt(newPrice, 10) || 30000;
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: newName,
      category: newCategory,
      price: parsedPrice,
      description: newDesc || 'Racikan istimewa barista Kopi Tepi Delta.',
      image: newCategory === 'Artisanal Pastry' ? ASSET_IMAGES.pastry : ASSET_IMAGES.heroLatte,
      isAvailable: true,
      roastLevel: newRoast,
      notes: newNotes ? newNotes.split(',').map((s) => s.trim()) : ['Artisan Crafted'],
      salesCount: 0,
    };

    onAddMenuItem(newItem);
    setIsAddModalOpen(false);
    setNewName('');
    setNewDesc('');
    setNewNotes('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onUpdateMenuItem(editingItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-sm">
        <div>
          <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
            Katalog & Manajemen Stok Menu
          </h3>
          <p className="text-xs text-[#7A695D]">
            Total {menuItems.length} produk aktif di seluruh cabang Kopi Tepi Delta
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C59A6F]" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Grid of Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-sm flex flex-col justify-between ${
              item.isAvailable ? 'border-[#E8DFD8]' : 'border-rose-200 bg-rose-50/20'
            }`}
          >
            <div>
              {/* Image & Status Badge */}
              <div className="relative aspect-[16/9] bg-[#EFE9E1]">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale opacity-75' : ''}`}
                />
                <div className="absolute top-3 left-3 bg-[#1C120C]/80 backdrop-blur-sm text-[#FAF7F2] text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.isAvailable ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif-brand text-lg font-bold text-[#261912] leading-snug">
                    {item.name}
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#261912] tabular-nums whitespace-nowrap">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-[#6C5B50] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#8C7A6B] border-t border-[#F2ECE4]">
                  <span>Terjual: <strong className="font-mono tabular-nums text-[#261912]">{item.salesCount} cup</strong></span>
                  {item.roastLevel && <span>Roast: {item.roastLevel}</span>}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD8] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onToggleAvailability(item.id)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  item.isAvailable
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                }`}
              >
                {item.isAvailable ? 'Tandai Habis' : 'Aktifkan Stok'}
              </button>

              <button
                type="button"
                onClick={() => setEditingItem(item)}
                className="p-2 rounded-lg bg-white border border-[#DDD3C7] text-[#5A483D] hover:bg-[#EFE9E1] transition-colors"
                title="Edit Harga & Deskripsi"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8DFD8] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD8]">
              <h4 className="font-serif-brand text-xl font-bold text-[#261912]">
                Tambah Menu Kopi / Makanan Baru
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#EFE9E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#261912] mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Delta Honey Cinnamon Latte"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#261912] mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                  >
                    <option value="Signature Delta">Signature Delta</option>
                    <option value="Specialty Espresso">Specialty Espresso</option>
                    <option value="Cold Brew Series">Cold Brew Series</option>
                    <option value="Manual Brew & V60">Manual Brew & V60</option>
                    <option value="Artisanal Pastry">Artisanal Pastry</option>
                    <option value="Savory Bites">Savory Bites</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#261912] mb-1">
                    Harga (IDR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#261912] mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ceritakan cita rasa, bahan baku, atau profil seduhan..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#261912] mb-1">
                    Roast Level
                  </label>
                  <select
                    value={newRoast}
                    onChange={(e) => setNewRoast(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                  >
                    <option value="Light">Light Roast</option>
                    <option value="Medium">Medium Roast</option>
                    <option value="Dark">Dark Roast</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#261912] mb-1">
                    Flavor Notes (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Floral, Peach, Honey"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFD8] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#DDD3C7] bg-white text-[#5A483D] font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#261912] text-white font-semibold hover:bg-[#3D291E]"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8DFD8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD8]">
              <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
                Edit Menu: {editingItem.name}
              </h4>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg hover:bg-[#EFE9E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#261912] mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#261912] mb-1">
                  Harga Satuan (IDR)
                </label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#261912] mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD3C7] bg-white"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFD8] flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2 rounded-xl border border-[#DDD3C7] bg-white text-[#5A483D]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#261912] text-white font-semibold hover:bg-[#3D291E]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

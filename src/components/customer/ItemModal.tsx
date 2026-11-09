import React, { useState } from 'react';
import { X, Plus, Minus, Check, Coffee, Sparkles, Flame } from 'lucide-react';
import { MenuItem, CartItem } from '../../types';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [sugarLevel, setSugarLevel] = useState<'Normal' | 'Less Sugar (50%)' | 'No Sugar (0%)'>('Normal');
  const [iceLevel, setIceLevel] = useState<'Normal Ice' | 'Less Ice' | 'No Ice' | 'Hot'>('Normal Ice');
  const [milkType, setMilkType] = useState<'Fresh Milk' | 'Oat Milk (+Rp 8.000)' | 'Almond Milk (+Rp 9.000)'>('Fresh Milk');
  const [notes, setNotes] = useState('');

  // Calculate extra cost for special milk
  let milkExtra = 0;
  if (milkType.includes('Oat Milk')) milkExtra = 8000;
  if (milkType.includes('Almond Milk')) milkExtra = 9000;

  const unitPrice = item.price + milkExtra;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart({
      item,
      quantity,
      sugarLevel,
      iceLevel,
      milkType,
      notes: notes.trim() ? notes : undefined,
    });
    onClose();
  };

  const isCoffee = item.category !== 'Artisanal Pastry' && item.category !== 'Savory Bites';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8DFD8] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header with Scrim */}
        <div className="relative h-60 bg-[#261912] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors focus:outline-none"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59A6F] bg-[#1C120C]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                {item.category}
              </span>
              {item.roastLevel && (
                <span className="text-[11px] text-[#DDD3C7] flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Flame className="w-3 h-3 text-[#C59A6F]" />
                  <span>Roast: {item.roastLevel}</span>
                </span>
              )}
            </div>
            <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Price & Description */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C7A6B]">
                Harga Satuan
              </span>
              <span className="font-mono text-xl font-bold text-[#261912] tabular-nums">
                Rp {item.price.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-[#5A483D] leading-relaxed">
              {item.description}
            </p>

            {/* Flavor Notes Tagging */}
            {item.notes && item.notes.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B] block mb-1.5">
                  Karakter & Profil Rasa:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs bg-[#EFE9E1] text-[#261912] border border-[#DDD3C7] font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customization Options for Beverages */}
          {isCoffee && (
            <div className="space-y-4 pt-4 border-t border-[#E8DFD8]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#261912]">
                <Coffee className="w-4 h-4 text-[#C59A6F]" />
                <span>Kustomisasi Racikan Barista</span>
              </div>

              {/* Tingkat Gula */}
              <div>
                <label className="block text-xs font-semibold text-[#5A483D] mb-1.5">
                  Tingkat Kemanisan (Sugar Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'Less Sugar (50%)', 'No Sugar (0%)'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSugarLevel(level)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                        sugarLevel === level
                          ? 'border-[#261912] bg-[#261912] text-white shadow-sm'
                          : 'border-[#DDD3C7] bg-white text-[#5A483D] hover:border-[#261912]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suhu & Es */}
              <div>
                <label className="block text-xs font-semibold text-[#5A483D] mb-1.5">
                  Suhu & Es (Ice Level)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Normal Ice', 'Less Ice', 'No Ice', 'Hot'] as const).map((ice) => (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setIceLevel(ice)}
                      className={`px-2 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                        iceLevel === ice
                          ? 'border-[#261912] bg-[#261912] text-white shadow-sm'
                          : 'border-[#DDD3C7] bg-white text-[#5A483D] hover:border-[#261912]'
                      }`}
                    >
                      {ice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Susu */}
              <div>
                <label className="block text-xs font-semibold text-[#5A483D] mb-1.5">
                  Pilihan Susu (Dairy / Plant-Based)
                </label>
                <div className="space-y-1.5">
                  {(['Fresh Milk', 'Oat Milk (+Rp 8.000)', 'Almond Milk (+Rp 9.000)'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMilkType(m)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs rounded-xl border text-left transition-all ${
                        milkType === m
                          ? 'border-[#261912] bg-[#EFE9E1] font-semibold text-[#261912]'
                          : 'border-[#DDD3C7] bg-white text-[#5A483D] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <span>{m}</span>
                      {milkType === m && <Check className="w-4 h-4 text-[#261912]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catatan Tambahan */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#5A483D] mb-1.5">
              Catatan Khusus untuk Barista (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pisahkan es batu di cup terpisah, extra foam..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none focus:ring-1 focus:ring-[#261912]"
            />
          </div>

          {/* Quantity & CTA */}
          <div className="pt-4 border-t border-[#E8DFD8] flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#DDD3C7] rounded-xl bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5A483D] hover:bg-[#EFE9E1]"
                aria-label="Kurangi Jumlah"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-mono text-sm font-bold tabular-nums text-[#261912]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5A483D] hover:bg-[#EFE9E1]"
                aria-label="Tambah Jumlah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#261912] hover:bg-[#3D291E] text-white text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors shadow-sm"
            >
              <span>Tambah ke Keranjang</span>
              <span className="font-mono tabular-nums">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

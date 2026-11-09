import React from 'react';
import { ShoppingBag, MessageCircle, FileText, CheckCircle2, ShieldCheck, ArrowRight, Coffee, Store } from 'lucide-react';
import { CartItem } from '../../types';

interface OrderSectionProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onExploreMenu: () => void;
  adminWhatsappPhone: string;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  cart,
  onOpenCart,
  onExploreMenu,
  adminWhatsappPhone,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section id="pemesanan" className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            <ShoppingBag className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>Alur Pemesanan Mudah & Cepat</span>
          </div>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#261912] tracking-tight">
            Pemesanan Kopi Tepi Delta
          </h2>
          <p className="text-sm text-[#6C5B50] leading-relaxed">
            Nikmati kemudahan memesan kopi favorit Anda di 3 cabang kami. Tersedia 2 pilihan metode pemesanan fleksibel sesuai kebutuhan Anda.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#261912] text-[#C59A6F] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
              Pilih Menu & Kustomisasi
            </h3>
            <p className="text-xs text-[#6C5B50] leading-relaxed">
              Jelajahi kurasi specialty coffee kami, tentukan tingkat kemanisan, takaran es, serta pilihan susu nabati (oat/almond).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#261912] text-[#C59A6F] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
              Tentukan Cabang & Catatan
            </h3>
            <p className="text-xs text-[#6C5B50] leading-relaxed">
              Pilih salah satu dari 3 cabang (Promenade Riverfront, Heritage Kota Lama, atau Sky Sanctuary) dan nomor meja Anda.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#261912] text-[#C59A6F] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-[#261912]">
              Pilih WhatsApp / Web Checkout
            </h3>
            <p className="text-xs text-[#6C5B50] leading-relaxed">
              Kirim format pesanan otomatis ke WhatsApp barista, atau selesaikan pesanan simulasi langsung di formulir website.
            </p>
          </div>
        </div>

        {/* Interactive Order Action Card */}
        <div className="bg-[#1C120C] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl shadow-xl border border-[#3A261A] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#2E1E15] px-3.5 py-1.5 rounded-full border border-[#4D3222] text-xs text-[#C59A6F]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Prototype Tugas Kuliah — Tanpa Pembayaran Riil</span>
            </div>
            <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
              {totalItems > 0
                ? `Terdapat ${totalItems} Pesanan di Keranjang Anda`
                : 'Siap Menikmati Secangkir Ketenangan Tepi Delta?'}
            </h3>
            <p className="text-xs text-[#C4B7AC] leading-relaxed">
              {totalItems > 0
                ? 'Lengkapi nama, nomor WhatsApp, dan pilihan cabang untuk meneruskan pesanan Anda ke barista.'
                : 'Buka daftar menu kami, pilih racikan favorit Anda, dan checkout dengan mudah melalui WhatsApp atau web.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0">
            {totalItems > 0 ? (
              <button
                type="button"
                onClick={onOpenCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C59A6F] hover:bg-[#b0875c] text-[#1C120C] text-xs font-bold transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Formulir Pemesanan ({totalItems})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onExploreMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C59A6F] hover:bg-[#b0875c] text-[#1C120C] text-xs font-bold transition-all shadow-md"
              >
                <Coffee className="w-4 h-4" />
                <span>Pilih Menu Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#2A1B12] hover:bg-[#382418] text-[#FAF7F2] text-xs font-semibold transition-colors border border-[#4A3225]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Format Pesan WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

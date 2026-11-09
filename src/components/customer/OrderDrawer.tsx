import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  CheckCircle,
  ShieldAlert,
  Coffee,
  Store,
  FileText,
  Send,
  AlertCircle,
  Copy,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { CartItem, Order, Promo, Branch } from '../../types';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  promos: Promo[];
  branches: Branch[];
  appliedPromoCode: string;
  setAppliedPromoCode: (code: string) => void;
  onCreateOrder: (order: Order) => void;
  adminWhatsappPhone: string;
  onNotifySuccess: (title: string, message: string) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  promos,
  branches,
  appliedPromoCode,
  setAppliedPromoCode,
  onCreateOrder,
  adminWhatsappPhone,
  onNotifySuccess,
}) => {
  if (!isOpen) return null;

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'branch-1');
  const [orderType, setOrderType] = useState<'Dine-in (Meja)' | 'Takeaway' | 'Delivery Lokal'>('Dine-in (Meja)');
  const [tableNumber, setTableNumber] = useState('Meja 08 (Teras Riverside)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer Bank' | 'Tunai di Kasir'>('QRIS');

  // Promo code form state
  const [promoInput, setPromoInput] = useState(appliedPromoCode || '');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Success state for Website Checkout
  const [isSuccessOrder, setIsSuccessOrder] = useState<Order | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Subtotal Calculation
  const subtotal = cart.reduce((sum, cartItem) => {
    let extra = 0;
    if (cartItem.milkType.includes('Oat Milk')) extra = 8000;
    if (cartItem.milkType.includes('Almond Milk')) extra = 9000;
    return sum + (cartItem.item.price + extra) * cartItem.quantity;
  }, 0);

  // Promo Calculation
  let discount = 0;
  const activePromo = promos.find(
    (p) => p.code.toUpperCase() === appliedPromoCode.toUpperCase() && p.isActive
  );

  if (activePromo && subtotal >= activePromo.minPurchase) {
    if (activePromo.discountType === 'percentage') {
      discount = Math.round((subtotal * activePromo.discountValue) / 100);
    } else {
      discount = activePromo.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Apply promo handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    const found = promos.find((p) => p.code.toUpperCase() === cleanCode && p.isActive);
    if (!found) {
      setPromoMessage('Kode promo tidak valid atau telah berakhir.');
      return;
    }
    if (subtotal < found.minPurchase) {
      setPromoMessage(
        `Minimal transaksi Rp ${found.minPurchase.toLocaleString('id-ID')} untuk menggunakan promo ini.`
      );
      return;
    }
    setAppliedPromoCode(cleanCode);
    setPromoMessage(`Promo diterapkan: ${found.title}`);
  };

  // Validate form fields
  const validateForm = () => {
    if (!customerName.trim()) {
      setValidationError('Silakan masukkan Nama Lengkap pemesan.');
      return false;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setValidationError('Silakan masukkan Nomor WhatsApp pemesan yang aktif.');
      return false;
    }
    if (cart.length === 0) {
      setValidationError('Keranjang pesanan masih kosong. Silakan pilih menu terlebih dahulu.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Generate WhatsApp Message
  const buildWhatsAppMessage = () => {
    let msg = `*HALO KOPI TEPI DELTA, SAYA INGIN MEMESAN:*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Data Pemesan:*\n`;
    msg += `• Nama: ${customerName.trim() || 'Pelanggan'}\n`;
    msg += `• WhatsApp: ${customerPhone.trim() || '-'}\n`;
    msg += `• Cabang: ${selectedBranch.name}\n`;
    msg += `• Tipe Pesanan: ${orderType}\n`;

    if (orderType === 'Dine-in (Meja)') {
      msg += `• Nomor Meja: ${tableNumber || '-'}\n`;
    } else if (orderType === 'Delivery Lokal') {
      msg += `• Alamat Antar: ${deliveryAddress || '-'}\n`;
    }

    if (orderNotes.trim()) {
      msg += `• Catatan Khusus: ${orderNotes.trim()}\n`;
    }

    msg += `\n*Daftar Pesanan:*\n`;
    cart.forEach((c, idx) => {
      let milkExtra = 0;
      if (c.milkType.includes('Oat Milk')) milkExtra = 8000;
      if (c.milkType.includes('Almond Milk')) milkExtra = 9000;
      const itemPrice = (c.item.price + milkExtra) * c.quantity;

      msg += `${idx + 1}. *${c.item.name}* (${c.quantity}x)\n`;
      msg += `   └ Varian: ${c.sugarLevel}, ${c.iceLevel}, ${c.milkType}\n`;
      if (c.notes) msg += `   └ Catatan Menu: "${c.notes}"\n`;
      msg += `   └ Harga: Rp ${itemPrice.toLocaleString('id-ID')}\n`;
    });

    msg += `--------------------------------------\n`;
    msg += `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    if (discount > 0) {
      msg += `Diskon (${appliedPromoCode}): -Rp ${discount.toLocaleString('id-ID')}\n`;
    }
    msg += `*TOTAL PEMBAYARAN: Rp ${grandTotal.toLocaleString('id-ID')}*\n`;
    msg += `Metode Bayar: ${paymentMethod} (Simulasi Prototype Tugas Kuliah)\n`;
    msg += `--------------------------------------\n`;
    msg += `Mohon konfirmasi ketersediaan pesanan ini. Terima kasih!`;

    return encodeURIComponent(msg);
  };

  // Handler for Option 1: WhatsApp Order
  const handleOrderViaWhatsApp = () => {
    if (!validateForm()) return;

    // Clean phone number: remove non-digits
    const cleanAdminPhone = adminWhatsappPhone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanAdminPhone}?text=${buildWhatsAppMessage()}`;

    // Also register order to state as simulation
    const newOrderId = `KTD-WA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const orderData: Order = {
      id: newOrderId,
      customerName,
      customerPhone,
      orderType,
      branchId: selectedBranchId,
      branchName: selectedBranch.name.replace('Kopi Tepi Delta — ', ''),
      tableNumber: orderType === 'Dine-in (Meja)' ? tableNumber : undefined,
      address: orderType === 'Delivery Lokal' ? deliveryAddress : undefined,
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        options: `${c.sugarLevel}, ${c.iceLevel}, ${c.milkType}${c.notes ? ' (' + c.notes + ')' : ''}`,
      })),
      subtotal,
      discount,
      promoCode: activePromo ? activePromo.code : undefined,
      total: grandTotal,
      status: 'Menunggu',
      paymentMethod,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onCreateOrder(orderData);
    setLastWaUrl(waUrl);
    setIsSuccessOrder(orderData);
    onClearCart();
    onNotifySuccess('Format WhatsApp Siap!', `Format pesanan #${newOrderId} telah disiapkan.`);

    // Open WhatsApp safely via anchor click
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for Option 2: Website Checkout (Simulated)
  const handleWebsiteCheckout = () => {
    if (!validateForm()) return;

    const newOrderId = `KTD-WEB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const orderData: Order = {
      id: newOrderId,
      customerName,
      customerPhone,
      orderType,
      branchId: selectedBranchId,
      branchName: selectedBranch.name.replace('Kopi Tepi Delta — ', ''),
      tableNumber: orderType === 'Dine-in (Meja)' ? tableNumber : undefined,
      address: orderType === 'Delivery Lokal' ? deliveryAddress : undefined,
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        options: `${c.sugarLevel}, ${c.iceLevel}, ${c.milkType}${c.notes ? ' (' + c.notes + ')' : ''}`,
      })),
      subtotal,
      discount,
      promoCode: activePromo ? activePromo.code : undefined,
      total: grandTotal,
      status: 'Sedang Diracik',
      paymentMethod,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onCreateOrder(orderData);
    setIsSuccessOrder(orderData);
    onClearCart();
    onNotifySuccess('Pesanan Berhasil Dibuat!', `Nomor pesanan ${newOrderId} berhasil dicatat sebagai data simulasi.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#E8DFD8]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#E8DFD8] flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#261912] text-white flex items-center justify-center">
              <Coffee className="w-4 h-4 text-[#C59A6F]" />
            </div>
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-[#261912] leading-tight">
                Pemesanan Kopi Tepi Delta
              </h3>
              <span className="text-[10px] font-mono text-[#8C7A6B]">
                Keranjang & Formulir Pemesanan
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#EFE9E1] text-[#6C5B50] transition-colors"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode: Success Confirmation vs Order Form */}
        {isSuccessOrder ? (
          /* ================= SUCCESS CONFIRMATION MODAL ================= */
          <div className="p-6 sm:p-8 space-y-6 my-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#EFE9E1] text-[#261912] text-xs font-mono font-bold">
                  {isSuccessOrder.id}
                </span>
                <h4 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#261912] mt-2">
                  Pesanan Berhasil Dicatat!
                </h4>
                <p className="text-xs text-[#5A483D] mt-1 max-w-md mx-auto">
                  Terima kasih, <strong>{isSuccessOrder.customerName}</strong>. Pesanan simulasi Anda telah tersimpan dan langsung diteruskan ke barista station.
                </p>
              </div>
            </div>

            {/* Clear Academic Prototype Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pemberitahuan Data Simulasi (Prototype Tugas Kuliah)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Website ini merupakan <strong>prototype fungsional untuk keperluan tugas kuliah</strong>. Fitur checkout ini menyimpan pesanan secara real-time ke dalam sistem admin tanpa memproses pembayaran uang sungguhan.
              </p>
            </div>

            {/* Itemized Receipt Summary */}
            <div className="p-5 bg-white rounded-2xl border border-[#E8DFD8] shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#261912]">
                  <Receipt className="w-4 h-4 text-[#C59A6F]" />
                  <span>Ringkasan Rincian Pesanan</span>
                </div>
                <span className="font-mono text-[11px] text-[#8C7A6B]">
                  {isSuccessOrder.timestamp}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[#5A483D] pb-3 border-b border-[#F2ECE4]">
                <div>
                  <span className="text-[#8C7A6B] block">Cabang Kopi:</span>
                  <span className="font-semibold text-[#261912]">{isSuccessOrder.branchName}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Layanan & Meja:</span>
                  <span className="font-semibold text-[#261912]">
                    {isSuccessOrder.orderType} {isSuccessOrder.tableNumber ? `(${isSuccessOrder.tableNumber})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">No. WhatsApp:</span>
                  <span className="font-mono text-[#261912]">{isSuccessOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Metode Bayar:</span>
                  <span className="text-[#261912]">{isSuccessOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-semibold text-[#261912] block">Menu Dipesan:</span>
                {isSuccessOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-xs bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EDE4DC]">
                    <div>
                      <p className="font-semibold text-[#261912]">
                        {item.name} <span className="text-[#8C7A6B] font-mono">x{item.quantity}</span>
                      </p>
                      <p className="text-[11px] text-[#7A695D]">{item.options}</p>
                    </div>
                    <span className="font-mono font-bold text-[#261912] tabular-nums">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-[#F2ECE4] space-y-1.5">
                <div className="flex justify-between text-[#7A695D]">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">Rp {isSuccessOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {isSuccessOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Diskon ({isSuccessOrder.promoCode}):</span>
                    <span className="font-mono tabular-nums">-Rp {isSuccessOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#261912] pt-2 border-t border-[#E8DFD8]">
                  <span>Total Tagihan:</span>
                  <span className="font-mono tabular-nums">Rp {isSuccessOrder.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              {lastWaUrl && (
                <a
                  href={lastWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesan ke WhatsApp Admin Sekarang</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSuccessOrder(null);
                  setLastWaUrl(null);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#261912] hover:bg-[#3D291E] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Selesai & Lanjutkan Belanja
              </button>
            </div>
          </div>
        ) : (
          /* ================= ORDERING & CART FORM ================= */
          <div className="p-5 sm:p-6 space-y-6 flex-1">
            {/* Academic Notice Banner */}
            <div className="p-3 bg-[#EFE9E1] rounded-xl border border-[#DDD3C7] text-xs text-[#5A483D] flex items-center gap-2.5">
              <span className="font-mono font-bold text-[10px] bg-[#261912] text-[#FAF7F2] px-2 py-0.5 rounded shrink-0">
                Data Simulasi
              </span>
              <span className="text-[11px] leading-tight">
                Simulasi pemesanan untuk prototype tugas kuliah tanpa pembayaran riil.
              </span>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFD8] p-6 space-y-3">
                <Coffee className="w-12 h-12 mx-auto text-[#C59A6F]" />
                <h4 className="font-serif-brand text-lg font-bold text-[#261912]">
                  Keranjang Anda Masih Kosong
                </h4>
                <p className="text-xs text-[#7A695D] max-w-xs mx-auto">
                  Silakan pilih racikan kopi specialty atau pastry lezat dari daftar menu di halaman ini.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#261912] text-white text-xs font-semibold hover:bg-[#3D291E] transition-colors"
                >
                  Lihat Daftar Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD8]">
                  <span className="text-xs font-bold text-[#261912]">
                    Daftar Pesanan ({cart.length} Jenis Produk)
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Semua</span>
                  </button>
                </div>

                {/* Items in cart */}
                <div className="space-y-3">
                  {cart.map((cartItem, idx) => {
                    let milkExtra = 0;
                    if (cartItem.milkType.includes('Oat Milk')) milkExtra = 8000;
                    if (cartItem.milkType.includes('Almond Milk')) milkExtra = 9000;
                    const itemTotal = (cartItem.item.price + milkExtra) * cartItem.quantity;

                    return (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-2xl border border-[#E8DFD8] shadow-sm flex items-start justify-between gap-3 hover:border-[#C59A6F] transition-colors"
                      >
                        <div className="flex gap-3 min-w-0">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <h5 className="font-semibold text-xs text-[#261912] truncate">
                              {cartItem.item.name}
                            </h5>
                            <p className="text-[11px] text-[#7A695D]">
                              {cartItem.sugarLevel} · {cartItem.iceLevel}
                            </p>
                            <p className="text-[11px] text-[#8C7A6B]">
                              {cartItem.milkType}
                            </p>
                            {cartItem.notes && (
                              <p className="text-[10px] italic text-[#8C7A6B] truncate">
                                Catatan: &ldquo;{cartItem.notes}&rdquo;
                              </p>
                            )}
                            <p className="font-mono text-xs font-bold text-[#261912] tabular-nums pt-0.5">
                              Rp {itemTotal.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Stepper & Delete */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            className="text-[#9B8B7F] hover:text-rose-600 transition-colors p-1"
                            title="Hapus menu ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center border border-[#DDD3C7] rounded-lg bg-[#FAF7F2] p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#5A483D] hover:bg-white rounded"
                              aria-label="Kurangi"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-mono text-xs font-bold tabular-nums text-[#261912]">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#5A483D] hover:bg-white rounded"
                              aria-label="Tambah"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FORMULIR PEMESANAN (Only when cart has items) */}
            {cart.length > 0 && (
              <div className="space-y-5 pt-3 border-t border-[#E8DFD8]">
                {/* 1. Pilih Cabang Contoh */}
                <div>
                  <label className="block text-xs font-bold text-[#261912] mb-1.5 uppercase tracking-wider">
                    Pilih Cabang Kopi Tepi Delta *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          selectedBranchId === b.id
                            ? 'border-[#261912] bg-[#261912] text-white shadow-sm'
                            : 'border-[#DDD3C7] bg-white text-[#5A483D] hover:border-[#261912]'
                        }`}
                      >
                        <p className="font-bold truncate">{b.name.replace('Kopi Tepi Delta — ', '')}</p>
                        <p className={`text-[10px] mt-0.5 ${selectedBranchId === b.id ? 'text-[#DDD3C7]' : 'text-[#8C7A6B]'}`}>
                          {b.city}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Data Pelanggan (Nama & No WhatsApp) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#261912] mb-1">
                      Nama Pelanggan *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none focus:ring-1 focus:ring-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#261912] mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none focus:ring-1 focus:ring-[#261912]"
                    />
                  </div>
                </div>

                {/* 3. Tipe Layanan & Lokasi */}
                <div>
                  <label className="block text-xs font-bold text-[#261912] mb-1.5">
                    Tipe Layanan Pemesanan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Dine-in (Meja)', 'Takeaway', 'Delivery Lokal'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                          orderType === type
                            ? 'border-[#261912] bg-[#EFE9E1] font-bold text-[#261912]'
                            : 'border-[#DDD3C7] bg-white text-[#5A483D]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail Meja atau Alamat Pengantaran */}
                {orderType === 'Dine-in (Meja)' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#5A483D] mb-1">
                      Nomor / Lokasi Meja
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: Meja 12 (Tepi Sungai) / Sofa Indor"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                    />
                  </div>
                )}

                {orderType === 'Delivery Lokal' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#5A483D] mb-1">
                      Alamat Lengkap Pengantaran
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Alamat jalan, nomor rumah, dan patokan terdekat..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                    />
                  </div>
                )}

                {/* Catatan Keseluruhan Pesanan */}
                <div>
                  <label className="block text-xs font-bold text-[#261912] mb-1">
                    Catatan Pesanan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Contoh: Tolong disajikan bersamaan, sedotan kertas, atau ucapan khusus..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD3C7] bg-white focus:outline-none"
                  />
                </div>

                {/* Promo Code Applicator */}
                <div>
                  <label className="block text-xs font-bold text-[#261912] mb-1">
                    Klaim Kode Promo (Opsional)
                  </label>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Contoh: DELTASUNSET, MORNINGCOMBO"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#DDD3C7] bg-white uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#261912] text-white text-xs font-semibold rounded-xl hover:bg-[#3D291E]"
                    >
                      Terapkan
                    </button>
                  </form>
                  {promoMessage && (
                    <p className="text-[11px] text-[#7A695D] mt-1">{promoMessage}</p>
                  )}
                </div>

                {/* Rincian Perhitungan Biaya Otomatis */}
                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD8] shadow-sm space-y-2 text-xs">
                  <div className="flex justify-between text-[#6C5B50]">
                    <span>Subtotal Produk</span>
                    <span className="font-mono tabular-nums">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Potongan Promo ({appliedPromoCode})</span>
                      <span className="font-mono tabular-nums">
                        -Rp {discount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6C5B50]">
                    <span>Biaya Layanan & Pajak</span>
                    <span className="font-mono tabular-nums text-emerald-700 font-semibold">
                      Rp 0 (Termasuk)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#261912] pt-2 border-t border-[#F2ECE4]">
                    <span>Total Pesanan</span>
                    <span className="font-mono tabular-nums text-base">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* DUA PILIHAN PEMESANAN (Requirement 7) */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#261912]">
                    Pilih Metode Pemesanan:
                  </span>

                  {/* Pilihan 1: Pesan via WhatsApp */}
                  <button
                    type="button"
                    onClick={handleOrderViaWhatsApp}
                    className="w-full p-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-left transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">1. Pesan melalui WhatsApp</p>
                        <p className="text-[11px] text-white/90">
                          Kirim format otomatis langsung ke WhatsApp Barista (+{adminWhatsappPhone})
                        </p>
                      </div>
                    </div>
                    <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Pilihan 2: Checkout melalui Formulir Website (Simulasi) */}
                  <button
                    type="button"
                    onClick={handleWebsiteCheckout}
                    className="w-full p-4 rounded-2xl bg-[#261912] hover:bg-[#3D291E] text-white text-left transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#C59A6F]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">2. Checkout melalui Formulir Website</p>
                        <p className="text-[11px] text-[#DDD3C7]">
                          Simpan data ke sistem (Simulasi Prototype Tugas Kuliah)
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-[#C59A6F] group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

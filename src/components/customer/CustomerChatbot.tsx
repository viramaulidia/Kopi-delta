import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Coffee,
  Sparkles,
  Store,
  Clock,
  HelpCircle,
  Tag,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  Bot,
  RefreshCw,
  MapPin,
  Check,
  Copy,
} from 'lucide-react';
import { MenuItem, Promo, Branch } from '../../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  actionType?: 'menu_list' | 'promo_list' | 'branch_list' | 'recommendation' | 'order_guide';
  recommendedItems?: MenuItem[];
  branchInfo?: Branch[];
  promoInfo?: Promo[];
}

interface CustomerChatbotProps {
  menuItems: MenuItem[];
  promos: Promo[];
  branches: Branch[];
  onOpenCart: () => void;
  onSelectItemForModal: (item: MenuItem) => void;
  onApplyPromoCode: (code: string) => void;
  adminWhatsappPhone: string;
}

export const CustomerChatbot: React.FC<CustomerChatbotProps> = ({
  menuItems,
  promos,
  branches,
  onOpenCart,
  onSelectItemForModal,
  onApplyPromoCode,
  adminWhatsappPhone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome greeting
  const initialMessages: Message[] = [
    {
      id: 'msg-welcome-1',
      sender: 'bot',
      text: 'Halo! Selamat datang di Kopi Tepi Delta ☕🌿\n\nSaya **Delta Virtual Barista**, asisten berbasis pengetahuan resmi cafe kami. Ada yang bisa saya bantu hari ini?',
      timestamp: 'Baru saja',
      quickReplies: [
        '☕ Rekomendasi Minuman',
        '📋 Daftar Menu & Harga',
        '🎟️ Promo Spesial Hari Ini',
        '📍 Lokasi 3 Cabang',
        '🛒 Cara Melakukan Pemesanan',
        '🕒 Jam Operasional',
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 1. Natural Rule-Based & Keyword Parsing Engine
  const generateBotResponse = (userInput: string): Message => {
    const query = userInput.toLowerCase().trim();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Intent 1: REKOMENDASI MINUMAN
    if (
      query.includes('rekomendasi') ||
      query.includes('saran') ||
      query.includes('favorit') ||
      query.includes('best seller') ||
      query.includes('enak') ||
      query.includes('dingin') ||
      query.includes('manis') ||
      query.includes('creamy') ||
      query.includes('fruity') ||
      query.includes('panas') ||
      query.includes('segar') ||
      query.includes('v60') ||
      query.includes('manual brew') ||
      query.includes('non kopi')
    ) {
      let subCategory = 'umum';
      let text = 'Berikut rekomendasi racikan favorit para penikmat kopi di Kopi Tepi Delta:';

      if (query.includes('dingin') || query.includes('segar') || query.includes('manis')) {
        subCategory = 'cold';
        text = 'Mencari yang dingin manis dan segar untuk menyegarkan hari? Ini varian terbaik kami:';
      } else if (query.includes('fruity') || query.includes('v60') || query.includes('manual brew')) {
        subCategory = 'filter';
        text = 'Untuk penikmat seduhan manual dengan aroma floral dan rasa buah alami:';
      } else if (query.includes('panas') || query.includes('creamy') || query.includes('latte')) {
        subCategory = 'creamy';
        text = 'Untuk teman hangat yang lembut dengan microfoam susu beludru:';
      } else if (query.includes('non kopi') || query.includes('teh') || query.includes('matcha')) {
        subCategory = 'noncoffee';
        text = 'Pilihan istimewa tanpa kafein yang tetap kaya rasa dan menyegarkan:';
      }

      // Filter popular / matched items
      const recommended = menuItems.filter((m) => {
        if (subCategory === 'cold') return m.name.includes('Cold Brew') || m.name.includes('Kopi Susu');
        if (subCategory === 'filter') return m.category.includes('Manual Brew');
        if (subCategory === 'creamy') return m.name.includes('Latte') || m.name.includes('Cappuccino') || m.name.includes('Spanish');
        if (subCategory === 'noncoffee') return m.category.includes('Non-Coffee');
        return m.isPopular;
      }).slice(0, 3);

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `${text}\n\n✨ Klik tombol **Lihat Detail & Pesan** pada kartu di bawah untuk memesan langsung ke keranjang!`,
        timestamp: timeStr,
        actionType: 'recommendation',
        recommendedItems: recommended.length > 0 ? recommended : menuItems.slice(0, 3),
        quickReplies: ['📋 Lihat Semua Menu', '🎟️ Ada Promo Apa?', '📍 Lokasi Cabang'],
      };
    }

    // Intent 2: DAFTAR MENU DAN HARGA
    if (
      query.includes('menu') ||
      query.includes('harga') ||
      query.includes('berapa') ||
      query.includes('katalog') ||
      query.includes('makanan') ||
      query.includes('pastry') ||
      query.includes('croissant') ||
      query.includes('snack')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📖 **Ringkasan Menu & Harga Kopi Tepi Delta:**\n\n' +
          '• **Delta Sea Salt Cold Brew** — Rp 36.000 *(Best Seller)*\n' +
          '• **Kopi Susu Tepi Sungai** — Rp 28.000 *(Gula Aren Organik)*\n' +
          '• **Riverside Spanish Latte** — Rp 35.000 *(Sweet & Silky)*\n' +
          '• **Artisan Cafe Latte Swan** — Rp 34.000 *(Single Origin)*\n' +
          '• **V60 Gayo Honey / Flores Bajawa** — Rp 38.000 *(Manual Brew)*\n' +
          '• **Artisan Cascara Peach Fizz** — Rp 32.000 *(Non-Coffee Segar)*\n' +
          '• **Matcha Delta Cloud** — Rp 34.000 *(Uji Matcha Premium)*\n' +
          '• **French Almond Croissant** — Rp 32.000 *(Fresh Baked)*\n' +
          '• **Sea Salt Truffle Fries** — Rp 30.000 *(Snack Gurih)*\n\n' +
          'Semua harga sudah termasuk pajak dan diseduh dari biji kopi grade specialty!',
        timestamp: timeStr,
        actionType: 'menu_list',
        quickReplies: ['☕ Rekomendasi Kopi', '🛒 Cara Melakukan Pemesanan', '🎟️ Promo Hari Ini'],
      };
    }

    // Intent 3: PROMO YANG TERSEDIA
    if (
      query.includes('promo') ||
      query.includes('diskon') ||
      query.includes('voucher') ||
      query.includes('kupon') ||
      query.includes('potongan') ||
      query.includes('hemat') ||
      query.includes('bundling')
    ) {
      const activeList = promos.filter((p) => p.isActive);
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🎉 **Promo Aktif di Kopi Tepi Delta Saat Ini:**\n\nAda ${activeList.length} kupon promo yang siap Anda gunakan. Anda dapat menyalin kode kupon di bawah ini dan menerapkannya langsung di keranjang pesanan:`,
        timestamp: timeStr,
        actionType: 'promo_list',
        promoInfo: activeList,
        quickReplies: ['🛒 Buka Keranjang Pesanan', '☕ Rekomendasi Menu', '📍 Info Cabang'],
      };
    }

    // Intent 4: LOKASI TIGA CABANG
    if (
      query.includes('cabang') ||
      query.includes('lokasi') ||
      query.includes('alamat') ||
      query.includes('dimana') ||
      query.includes('surabaya') ||
      query.includes('semarang') ||
      query.includes('bandung') ||
      query.includes('riverfront') ||
      query.includes('heritage') ||
      query.includes('sky') ||
      query.includes('rooftop') ||
      query.includes('maps')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📍 **Kopi Tepi Delta Hadir di 3 Cabang Pilihan:**\n\n' +
          '1. **Promenade Riverfront (Surabaya)** — Jl. Tepian Sungai No. 12\n' +
          '   *Suasana dek terbuka tepi sungai, semilir angin senja & sunset.*\n' +
          '2. **Heritage Kota Lama (Semarang)** — Jl. Kolonial No. 45\n' +
          '   *Gedung kolonial estetik, ber-AC, tenang untuk WFC & slow bar V60.*\n' +
          '3. **Sky Sanctuary (Bandung)** — Sky Garden Tower Lt. 18\n' +
          '   *Rooftop berpanorama kota, udara sejuk & sajian mocktail estetik.*',
        timestamp: timeStr,
        actionType: 'branch_list',
        branchInfo: branches,
        quickReplies: ['🕒 Jam Operasional', '🛒 Cara Melakukan Pemesanan', '☕ Rekomendasi Minuman'],
      };
    }

    // Intent 5: CARA PEMESANAN
    if (
      query.includes('pesan') ||
      query.includes('order') ||
      query.includes('beli') ||
      query.includes('cara') ||
      query.includes('checkout') ||
      query.includes('whatsapp') ||
      query.includes('wa') ||
      query.includes('pembayaran')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🛒 **Panduan Mudah Melakukan Pemesanan:**\n\n' +
          '1. **Pilih Menu**: Buka bagian Menu dan klik minuman atau pastry yang Anda sukai.\n' +
          '2. **Kustomisasi**: Tentukan tingkat kemanisan (sugar), takaran es (ice), pilihan susu, dan catatan khusus.\n' +
          '3. **Pilih Cabang**: Pada keranjang belanja, tentukan salah satu dari 3 cabang terdekat Anda.\n' +
          '4. **Dua Pilihan Checkout**:\n' +
          '   • **Pesan via WhatsApp**: Sistem otomatis membuatkan format chat pemesanan lengkap dan membuka nomor WhatsApp kami.\n' +
          '   • **Checkout Simulasi Website**: Langsung selesaikan pesanan di website dan dapatkan tanda terima nomor invoice simulasi.',
        timestamp: timeStr,
        actionType: 'order_guide',
        quickReplies: ['📋 Lihat Menu Kopi', '🎟️ Ada Promo?', '🕒 Jam Buka'],
      };
    }

    // Intent 6: JAM OPERASIONAL
    if (
      query.includes('jam') ||
      query.includes('buka') ||
      query.includes('tutup') ||
      query.includes('operasional') ||
      query.includes('kapan') ||
      query.includes('jadwal')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🕒 **Jadwal Jam Operasional Kopi Tepi Delta:**\n\n' +
          '• **Promenade Riverfront (Surabaya)**: Buka setiap hari, **07:00 – 23:00 WIB**\n' +
          '• **Heritage Kota Lama (Semarang)**: Buka setiap hari, **08:00 – 22:00 WIB**\n' +
          '• **Sky Sanctuary Rooftop (Bandung)**: Buka setiap hari, **10:00 – 24:00 WIB**\n\n' +
          '💡 *Waktu Paling Favorit:* Jam 16:30 – 18:30 WIB untuk menikmati pemandangan matahari terbenam (*sunset golden hour*) di tepi sungai!',
        timestamp: timeStr,
        quickReplies: ['📍 Cek Lokasi Cabang', '☕ Rekomendasi Sore Hari', '🎟️ Promo Sore Hari'],
      };
    }

    // Intent 7: SAPAAN / SALAM
    if (
      query.includes('halo') ||
      query.includes('hai') ||
      query.includes('pagi') ||
      query.includes('siang') ||
      query.includes('sore') ||
      query.includes('malam') ||
      query.includes('assalamualaikum') ||
      query.includes('permisi')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Halo! Senang sekali bisa menyapa Anda ☕\n\nAda yang ingin Anda tanyakan tentang menu kopi racikan kami, promo spesial, lokasi cabang, atau panduan memesan?',
        timestamp: timeStr,
        quickReplies: [
          '☕ Rekomendasi Minuman',
          '📋 Daftar Menu & Harga',
          '🎟️ Promo Spesial Hari Ini',
          '📍 Lokasi 3 Cabang',
        ],
      };
    }

    // Intent 8: TERIMA KASIH
    if (
      query.includes('makasih') ||
      query.includes('terima kasih') ||
      query.includes('thanks') ||
      query.includes('mantap') ||
      query.includes('oke') ||
      query.includes('siap')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Sama-sama! Senang bisa membantu Anda 😊\n\nSelamat menikmati kopi pilihan Anda di Kopi Tepi Delta. Jika membutuhkan bantuan lain, silakan ketik kapan saja ya!',
        timestamp: timeStr,
        quickReplies: ['📋 Lihat Menu Kopi', '🛒 Buka Keranjang'],
      };
    }

    // Fallback Friendly Response
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'Maaf, saya belum sepenuhnya memahami pertanyaan tersebut. Sebagai asisten informasi Kopi Tepi Delta, saya dapat membantu Anda seputar topik-topik berikut:\n\n' +
        '1. **Daftar menu & harga kopi**\n' +
        '2. **Rekomendasi rasa minuman**\n' +
        '3. **Voucher promo yang aktif**\n' +
        '4. **Alamat 3 cabang kami**\n' +
        '5. **Cara memesan via web/WhatsApp**\n' +
        '6. **Jam buka operasional**\n\n' +
        'Silakan pilih tombol pintasan cepat di bawah ini:',
      timestamp: timeStr,
      quickReplies: [
        '☕ Rekomendasi Minuman',
        '📋 Daftar Menu & Harga',
        '🎟️ Promo Hari Ini',
        '📍 Lokasi 3 Cabang',
        '🛒 Cara Melakukan Pemesanan',
        '🕒 Jam Operasional',
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic typing latency (400ms)
    setTimeout(() => {
      const response = generateBotResponse(rawText);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom-Right, distinct and premium) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#1C120C] text-[#FAF7F2] shadow-2xl border border-[#C59A6F]/60 hover:bg-[#2A1B12] hover:border-[#C59A6F] transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none"
            aria-label="Buka Chatbot Barista"
          >
            {/* Pulsing Green Online Indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#C59A6F] group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold block leading-none text-[#FAF7F2]">
                  Tanya Barista
                </span>
                <span className="text-[10px] text-[#C4B7AC] block mt-0.5">
                  Menu • Promo • Lokasi
                </span>
              </div>
            </div>

            {hasUnread && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#C59A6F] absolute -top-1 -right-1 ring-2 ring-[#FAF7F2]" />
            )}
          </button>
        )}
      </div>

      {/* Main Chatbot Floating Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-[#E8DFD8] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#1C120C] text-[#FAF7F2] px-5 py-4 flex items-center justify-between border-b border-[#332117] shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#C59A6F] text-[#1C120C] flex items-center justify-center font-bold shadow-xs">
                  <Coffee className="w-5 h-5 text-[#1C120C]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1C120C] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-brand text-base font-bold text-[#FAF7F2] leading-none">
                    Delta Virtual Barista
                  </h3>
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-[#C59A6F]/30 text-[#EBDBC9] px-1.5 py-0.5 rounded">
                    Aturan & Info
                  </span>
                </div>
                <p className="text-[11px] text-[#A8988C] mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Siap membantu pertanyaan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#C4B7AC]">
              <button
                onClick={handleResetChat}
                title="Mulai Ulang Percakapan"
                className="p-1.5 rounded-lg hover:bg-[#2A1B12] hover:text-white transition-colors"
                aria-label="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#2A1B12] hover:text-white transition-colors"
                aria-label="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Notice (Honest Labeling as requested) */}
          <div className="bg-[#FAF3EA] px-4 py-2 border-b border-[#EFE9E1] text-[10px] text-[#7A695D] flex items-center justify-between">
            <span>Sistem Otomatis Berbasis Pengetahuan Kopi Tepi Delta</span>
            <span className="font-semibold text-[#8C582B]">Data Resmi Cafe</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]/60 text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      isBot
                        ? 'bg-white text-[#261912] border border-[#EFE9E1] shadow-xs rounded-tl-xs'
                        : 'bg-[#261912] text-[#FAF7F2] rounded-tr-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Interactive: Recommendations Cards */}
                    {msg.actionType === 'recommendation' && msg.recommendedItems && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-[#EFE9E1]">
                        {msg.recommendedItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl p-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="font-semibold text-[#1C120C] text-[11px] block truncate">
                                {item.name}
                              </span>
                              <span className="font-mono text-[#8C582B] text-[11px] font-bold">
                                Rp {item.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                onSelectItemForModal(item);
                                setIsOpen(false);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#261912] text-[#FAF7F2] text-[10px] font-semibold hover:bg-[#3D291E] shrink-0 transition-colors cursor-pointer"
                            >
                              Lihat & Pesan
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive: Promo Cards in Chat */}
                    {msg.actionType === 'promo_list' && msg.promoInfo && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-[#EFE9E1]">
                        {msg.promoInfo.map((p) => (
                          <div
                            key={p.id}
                            className="bg-[#FAF3EA] border border-[#E0D2C3] rounded-xl p-2.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif-brand font-bold text-[#1C120C] text-xs">
                                {p.title}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Aktif
                              </span>
                            </div>
                            <p className="text-[10px] text-[#523E32] leading-tight">
                              {p.discountDescription}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <code className="bg-white border border-[#C59A6F]/40 px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#8C582B]">
                                {p.code}
                              </code>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleCopyCode(p.code)}
                                  className="px-2 py-1 rounded bg-white border border-[#E0D2C3] text-[10px] font-medium text-[#7A695D] hover:text-[#1C120C] flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedCode === p.code ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Tersalin</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Salin</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    onApplyPromoCode(p.code);
                                    setIsOpen(false);
                                  }}
                                  className="px-2 py-1 rounded bg-[#C59A6F] text-[#1C120C] text-[10px] font-bold hover:bg-[#D5AA7F] cursor-pointer"
                                >
                                  Pakai Kupon
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive: Branches Card in Chat */}
                    {msg.actionType === 'branch_list' && msg.branchInfo && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-[#EFE9E1]">
                        {msg.branchInfo.map((b) => (
                          <div
                            key={b.id}
                            className="bg-white border border-[#EFE9E1] rounded-xl p-2.5 text-[11px] space-y-1"
                          >
                            <div className="font-bold text-[#1C120C] flex items-center justify-between">
                              <span>{b.name.replace('Kopi Tepi Delta — ', '')}</span>
                              <span className="text-[9px] text-[#8C7A6B] font-mono">{b.city}</span>
                            </div>
                            <p className="text-[10px] text-[#7A695D]">{b.address}</p>
                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#FAF7F2]">
                              <span className="text-[#8C582B] font-medium">🕒 {b.hours}</span>
                              <a
                                href={b.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8C582B] hover:underline flex items-center gap-0.5 font-semibold"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive: Order Guide Action Button */}
                    {msg.actionType === 'order_guide' && (
                      <div className="mt-3 pt-2 border-t border-[#EFE9E1] flex gap-2">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            const el = document.getElementById('menu');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#261912] text-[#FAF7F2] font-semibold text-[10px] text-center"
                        >
                          Buka Menu Kopi
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenCart();
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#C59A6F] text-[#1C120C] font-semibold text-[10px] text-center"
                        >
                          Buka Keranjang
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[9px] text-[#A8988C] px-1">
                    {msg.timestamp}
                  </span>

                  {/* Quick Replies Buttons (if any) */}
                  {isBot && msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 mt-1 pt-1 max-w-[95%]">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(qr)}
                          className="px-2.5 py-1 rounded-full bg-white border border-[#E0D2C3] hover:border-[#C59A6F] hover:bg-[#FAF3EA] text-[#5C4D42] text-[10px] font-medium transition-all shadow-2xs cursor-pointer text-left"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#8C7A6B] text-[11px] bg-white p-3 rounded-2xl rounded-tl-xs border border-[#EFE9E1] w-fit shadow-xs">
                <Coffee className="w-3.5 h-3.5 animate-spin text-[#C59A6F]" />
                <span>Barista sedang mengetik jawaban...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills Bar (Always available above input) */}
          <div className="px-3 py-2 bg-white border-t border-[#EFE9E1] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-[#8C7A6B] shrink-0 uppercase tracking-wider">
              Tanya Cepat:
            </span>
            <button
              onClick={() => handleSendMessage('Rekomendasi minuman kopi paling favorit')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              ☕ Rekomendasi
            </button>
            <button
              onClick={() => handleSendMessage('Daftar menu dan harga lengkap')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              📋 Menu & Harga
            </button>
            <button
              onClick={() => handleSendMessage('Ada promo apa hari ini?')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              🎟️ Promo
            </button>
            <button
              onClick={() => handleSendMessage('Dimana saja lokasi cabang Kopi Tepi Delta?')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              📍 Cabang
            </button>
            <button
              onClick={() => handleSendMessage('Jam berapa cafe buka dan tutup?')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              🕒 Jam Buka
            </button>
            <button
              onClick={() => handleSendMessage('Bagaimana cara memesan di website?')}
              className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD8] text-[10px] font-medium text-[#5C4D42] hover:bg-[#EFE9E1] hover:text-[#1C120C] shrink-0 cursor-pointer"
            >
              🛒 Cara Pesan
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#EFE9E1] flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya menu, harga, promo, jam buka..."
              className="flex-1 bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3.5 py-2.5 text-xs text-[#261912] placeholder-[#8C7A6B] focus:outline-none focus:ring-1 focus:ring-[#C59A6F] focus:border-[#C59A6F]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#1C120C] text-[#FAF7F2] flex items-center justify-center hover:bg-[#332117] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-xs"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4 text-[#C59A6F]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

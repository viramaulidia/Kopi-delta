import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Coffee, Lightbulb, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AdminAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Halo! Saya Asisten AI Operasional Kopi Tepi Delta. Saya dapat membantu Anda menganalisis performa bisnis, merumuskan resep minuman baru, menghitung margin HPP, mengoptimalkan stok biji kopi, atau merancang strategi promosi jam sepi. Ada yang ingin didiskusikan hari ini?',
      timestamp: '10:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'Bagaimana cara meningkatkan omset saat hujan sore di tepi sungai?',
    'Hitung perkiraan margin profit Kopi Susu dengan Oat Milk vs Fresh Milk',
    'Rekomendasi biji kopi guest roast untuk festival kopi bulan depan',
    'Tips mengurangi food waste ampas seduhan kopi dan kulit pastry',
  ];

  const generateAIResponse = (userQuestion: string): string => {
    const q = userQuestion.toLowerCase();

    if (q.includes('hujan') || q.includes('sore')) {
      return `Berdasarkan data cuaca dan penjualan Kopi Tepi Delta, saat hujan turun pesanan minuman dingin (Cold Brew) turun rata-rata 38%, namun durasi tinggal pelanggan (dwell time) naik menjadi 2.4 jam.\n\nStrategi yang direkomendasikan:\n1. Aktifkan otomatis promo "Rainy Riverside Brew" di layar kasir & web pelanggan: Diskon bundling Manual Brew V60 hangat + Cinnamon Pastry.\n2. Tawarkan "Free Warm Up Service" untuk kudapan pastry.\n3. Putar playlist akustik lembut dan hidupkan lampu temaram hangat untuk memaksimalkan kenyamanan indoor.\n4. Siapkan payung berlogo Kopi Tepi Delta untuk mengantar tamu dari area parkir ke teras.`;
    }

    if (q.includes('oat') || q.includes('susu') || q.includes('margin')) {
      return `Berikut rincian perbandingan HPP (Harga Pokok Penjualan) Kopi Susu Tepi Sungai:\n\n• Opsi Fresh Milk Standar:\n- Biaya espresso ganda (18g biji): Rp 4.200\n- Susu segar (150ml): Rp 3.300\n- Gula aren murni: Rp 900\n- Cup, lid, sedotan ramah lingkungan: Rp 1.100\n- Total HPP: Rp 9.500 (Harga jual Rp 28.000 -> Gross Margin 66%)\n\n• Opsi Oat Milk Barista Edition:\n- Tambahan harga jual ke pelanggan: +Rp 8.000 (Total Rp 36.000)\n- Biaya Oat Milk (150ml): Rp 6.200 (selisih +Rp 2.900 dibanding susu sapi)\n- Total HPP: Rp 12.400 -> Gross Margin 65.5%\n\nKesimpulan: Margin persentase tetap terjaga sangat sehat (~65%) dengan nilai nominal keuntungan kas naik sebesar Rp 5.100 per cup!`;
    }

    if (q.includes('biji') || q.includes('roast') || q.includes('guest')) {
      return `Untuk festival kopi dan guest roast bulan depan, kami menyarankan:\n\n1. Single Origin Solok Selatan (Anaerobic Natural) - Memiliki profil rasa unik buah tropis fermentasi (nangka, markisa matang) yang sangat memikat untuk demonstrasi V60.\n2. Flores Manggarai Yellow Caturra (Honey Process) - Rasa lembut manis madu bunga dengan acidity jeruk mandarin yang seimbang.\n\nSaran operasional: Sangrai dalam batch kecil 3kg per minggu dan sajikan dengan kartu cerita petani (Origin Cards) untuk memperkuat citra specialty roastery.`;
    }

    if (q.includes('waste') || q.includes('ampas')) {
      return `Program Zero-Waste Roastery untuk Kopi Tepi Delta:\n\n1. Ampas Kopi (Coffee Grounds): Kemitraan dengan komunitas hidroponik tepian sungai untuk dijadikan pupuk organik tanaman monstera & pakis di cafe.\n2. Sisa Biji Espresso Kalibrasi: Kumpulkan untuk pembuatan cold brew konsentrat (18 jam) yang dipakai sebagai bahan baku es krim kopi atau sirup kopi racikan.\n3. Pastry Tidak Habis Harian: Terapkan diskon "Delta Twilight Pastry 40%" mulai pukul 20:30 WIB setiap malam.`;
    }

    return `Pertanyaan yang sangat bagus untuk pengembangan Kopi Tepi Delta! Untuk aspek tersebut, fokus utama kita adalah menjaga konsistensi cita rasa artisanal, keramahan barista tepi sungai, serta efisiensi biaya bahan baku. Apakah Anda ingin dibuatkan simulasi biaya atau rancangan promo khusus seputar hal ini?`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAIResponse(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-[#261912] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#261912] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#261912]" />
          </div>
          <div>
            <h4 className="font-serif-brand text-lg font-bold">
              Asisten AI Barista & Manajer
            </h4>
            <p className="text-[11px] text-[#DDD3C7]">
              Knowledge base operasional Kopi Tepi Delta & analisis bisnis
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-init',
                sender: 'assistant',
                text: 'Obrolan telah direset. Ada hal lain yang ingin Anda konsultasikan seputar operasional Kopi Tepi Delta?',
                timestamp: 'Sekarang',
              },
            ])
          }
          className="text-xs text-[#DDD3C7] hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-white/10"
          title="Reset Percakapan"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="p-3 bg-[#FAF7F2] border-b border-[#E8DFD8] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Lightbulb className="w-4 h-4 text-[#C59A6F] shrink-0 ml-1" />
        <span className="text-[11px] font-semibold text-[#8C7A6B] shrink-0">Topik Populer:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1 bg-white border border-[#DDD3C7] rounded-full text-[11px] text-[#5A483D] hover:bg-[#EFE9E1] hover:text-[#261912] whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF7F2]/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#261912] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Coffee className="w-4 h-4 text-[#C59A6F]" />
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#261912] text-white rounded-tr-none'
                  : 'bg-white text-[#261912] border border-[#E8DFD8] shadow-sm rounded-tl-none'
              }`}
            >
              {msg.text}
              <div
                className={`text-[10px] mt-2 font-mono text-right ${
                  msg.sender === 'user' ? 'text-white/60' : 'text-[#8C7A6B]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#EFE9E1] text-[#261912] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-[#8C7A6B] italic">
            <div className="w-8 h-8 rounded-full bg-[#261912] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#C59A6F]" />
            </div>
            <span>AI sedang merumuskan analisa bisnis...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-[#E8DFD8]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan analisis penjualan, margin menu, atau ide racikan baru..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#DDD3C7] text-[#261912] focus:outline-none focus:ring-1 focus:ring-[#261912]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#261912] text-white hover:bg-[#3D291E] transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-[#C59A6F]" />
          </button>
        </form>
      </div>
    </div>
  );
};

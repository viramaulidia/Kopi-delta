import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Reservasi Meja / Event');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  const whatsappMessage = encodeURIComponent(
    'Halo Kopi Tepi Delta, saya ingin bertanya seputar reservasi dan menu specialty coffee Anda.'
  );

  return (
    <section id="kontak" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                Pusat Bantuan & Reservasi
              </span>
              <h2 className="font-serif-brand text-3xl sm:text-4xl font-bold text-[#261912] tracking-tight">
                Hubungi Kopi Tepi Delta
              </h2>
              <p className="text-sm text-[#6C5B50] leading-relaxed">
                Ingin mengadakan private event, reservasi meja riverside romantis, atau memesan catering specialty coffee? Tim kami siap melayani Anda.
              </p>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="p-6 bg-[#261912] rounded-2xl text-white shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-brand text-lg font-bold">Layanan WhatsApp Cepat</h4>
                  <p className="text-xs text-[#DDD3C7]">Respon instan dari tim barista kami</p>
                </div>
              </div>
              <p className="text-xs text-[#C4B7AC] leading-relaxed">
                Kirim pesan langsung ke WhatsApp Hotline resmi Kopi Tepi Delta untuk info ketersediaan meja, promo hari ini, atau konfirmasi pesanan instan.
              </p>
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Hotline (+62 812-3456-7890)</span>
              </a>
            </div>

            {/* Contact details list */}
            <div className="space-y-3.5 pt-2 text-xs text-[#5A483D]">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span>Kantor Pusat: Waterfront Promenade Boulevard No. 18, Sidoarjo - Jatim</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span>Email Bisnis: kerjasama@kopitepidelta.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span>Telepon: (031) 8901234 (Jam Kerja 09:00 - 17:00)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#E8DFD8] shadow-sm">
            <h3 className="font-serif-brand text-2xl font-bold text-[#261912] mb-1">
              Kirimkan Pertanyaan atau Pesan
            </h3>
            <p className="text-xs text-[#7A695D] mb-6">
              Silakan isi formulir di bawah ini, kami akan merespons dalam waktu maksimal 2 jam kerja.
            </p>

            {isSent ? (
              <div className="p-6 bg-[#F5EFEB] rounded-xl border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-[#261912]">Pesan Anda Berhasil Terkirim</p>
                <p className="text-xs text-[#6C5B50]">
                  Terima kasih telah menghubungi Kopi Tepi Delta. Tim representatif kami akan segera membalas ke kontak Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#261912] mb-1.5 uppercase tracking-wider">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#261912]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#261912] mb-1.5 uppercase tracking-wider">
                      Email / No. WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="0812xxxx atau email@anda.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#261912]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261912] mb-1.5 uppercase tracking-wider">
                    Keperluan
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#261912]"
                  >
                    <option>Reservasi Meja / Event Komunitas</option>
                    <option>Kemitraan & Wholesale Biji Kopi</option>
                    <option>Masukan Pelanggan & Saran Rasa</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#261912] mb-1.5 uppercase tracking-wider">
                    Pesan Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan tanggal reservasi, jumlah orang, atau pertanyaan seputar menu..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD3C7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#261912]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#261912] hover:bg-[#3D291E] text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C59A6F]" />
                    <span>Kirim Pesan Sekarang</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

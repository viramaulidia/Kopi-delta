import React from 'react';
import { Coffee, MapPin, Phone, Mail, Instagram, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSection: (id: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSection, onOpenAdmin }) => {
  return (
    <footer className="bg-[#1C120C] text-[#FAF7F2] border-t border-[#38261C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#38261C]">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C59A6F] text-[#1C120C] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5 text-[#1C120C]" />
              </div>
              <span className="font-serif-brand text-2xl font-bold tracking-tight text-[#FAF7F2]">
                Kopi Tepi Delta
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#B8A699]">
              Merayakan harmoni seduhan kopi nusantara berkualitas tinggi di tepian aliran sungai delta yang tenang. Wadah berkumpul, bertukar ide, dan merayakan jeda.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[#C59A6F]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2E1E15] flex items-center justify-center hover:bg-[#C59A6F] hover:text-[#1C120C] transition-colors"
                aria-label="Instagram Kopi Tepi Delta"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6281246150806"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2E1E15] flex items-center justify-center hover:bg-[#C59A6F] hover:text-[#1C120C] transition-colors"
                aria-label="WhatsApp Hotline"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#C59A6F] mb-4">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8A699]">
              <li>
                <button
                  onClick={() => onOpenSection('beranda')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Beranda & Kisah Delta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSection('menu')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Menu Artisan Kopi & Pastry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSection('promo')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Promo Sunset & Bundle
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSection('cabang')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  3 Lokasi Cabang Tepi Sungai
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#FAF7F2] transition-colors font-medium text-[#C59A6F]"
                >
                  Panel Manajemen Bisnis (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#C59A6F] mb-4">
              Jam Operasional
            </h4>
            <div className="space-y-2.5 text-xs text-[#B8A699]">
              <div>
                <p className="text-[#FAF7F2] font-medium">Senin — Jumat</p>
                <p className="tabular-nums">07:00 – 23:00 WIB</p>
              </div>
              <div>
                <p className="text-[#FAF7F2] font-medium">Sabtu — Minggu & Libur</p>
                <p className="tabular-nums">06:30 – 24:00 WIB (Riverside Acoustic)</p>
              </div>
              <div className="pt-2 text-[11px] text-[#A38F80]">
                *Kitchen & Roastery manual brew buka sepanjang jam operasional
              </div>
            </div>
          </div>

          {/* Kontak & Pusat Pelanggan */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#C59A6F] mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-xs text-[#B8A699]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0 mt-0.5" />
                <span>Jl. Delta Brantas No. 18, Waterfront Boulevard, Jawa Timur</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span className="tabular-nums">+62 812-4615-0806 (Reservasi)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span>halo@kopitepidelta.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C796B]">
          <p>© 2026 Kopi Tepi Delta. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-[#2A1B12] text-[#C59A6F] font-mono">
              Data Simulasi Bisnis
            </span>
            <span>· Dirancang dengan rasa & estetika</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

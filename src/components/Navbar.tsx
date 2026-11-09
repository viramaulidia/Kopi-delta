import React, { useState } from 'react';
import { ShoppingBag, Coffee, Menu as MenuIcon, X, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: 'customer' | 'admin';
  setCurrentView: (view: 'customer' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  onOpenCart,
  activeSection,
  setActiveSection,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'menu', label: 'Menu Kopi' },
    { id: 'pemesanan', label: 'Pemesanan' },
    { id: 'promo', label: 'Promo Spesial' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'cabang', label: 'Lokasi Cabang' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-2.5 text-left text-[#261912] group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#261912] text-[#FAF7F2] flex items-center justify-center transition-transform group-hover:scale-105">
              <Coffee className="w-5 h-5 text-[#C59A6F]" />
            </div>
            <div>
              <span className="font-serif-brand text-2xl font-bold tracking-tight text-[#261912] leading-none block">
                Kopi Tepi Delta
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] font-medium block mt-0.5">
                Specialty Riverside Roastery
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single line, text with clean hover underline) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C4D42]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative hover:text-[#261912] ${
                  activeSection === link.id
                    ? 'text-[#261912] font-semibold'
                    : 'text-[#6C5B50]'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59A6F] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Cart & Switch to Admin) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#EFE9E1] text-[#261912] hover:bg-[#E5DDD4] transition-all flex items-center justify-center focus:outline-none"
              aria-label="Buka Keranjang Pesanan"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#261912] text-[#FAF7F2] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Switch to Admin Button */}
            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else setCurrentView('admin');
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#FAF7F2] bg-[#261912] hover:bg-[#3D291E] rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Dashboard Admin</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#261912] rounded-lg hover:bg-[#EFE9E1]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFD8] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#EFE9E1] text-[#261912] font-semibold'
                    : 'text-[#6C5B50] hover:bg-[#F5EFEB]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8DFD8] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdmin) onOpenAdmin();
                else setCurrentView('admin');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#261912] rounded-lg cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-[#C59A6F]" />
              <span>Buka Dashboard Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

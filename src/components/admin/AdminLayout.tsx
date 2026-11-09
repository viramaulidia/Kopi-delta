import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Users,
  BarChart3,
  TrendingUp,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  Compass,
  Database,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { DatabaseStatusModal } from './DatabaseStatusModal';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onBackToCustomer: () => void;
  adminWhatsappPhone: string;
  setAdminWhatsappPhone: (num: string) => void;
  adminUserEmail?: string;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onBackToCustomer,
  adminWhatsappPhone,
  setAdminWhatsappPhone,
  adminUserEmail = 'admin@kopitepidelta.id',
  onLogout,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(adminWhatsappPhone);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const navItems = [
    { id: 'overview', label: '1. Dashboard Ringkasan', icon: LayoutDashboard },
    { id: 'marketing', label: '2. Data-Driven Marketing', icon: BarChart3 },
    { id: 'rfm', label: '3. Analisis Pelanggan RFM', icon: Users },
    { id: 'contextual', label: '4. Contextual Marketing', icon: Compass },
    { id: 'predictions', label: '5. Prediksi Penjualan', icon: TrendingUp },
    { id: 'sales', label: '6. Data Penjualan', icon: ShoppingBag },
    { id: 'menu', label: '7. Data Menu', icon: Coffee },
    { id: 'customers', label: '8. Data Pelanggan', icon: Users },
    { id: 'analytics', label: '9. Analisis Perilaku', icon: BarChart3 },
    { id: 'ai-promo', label: '10. Rekomendasi Promosi AI', icon: Sparkles },
    { id: 'ai-chat', label: '11. Chatbot AI', icon: Bot },
    { id: 'ab-testing', label: '12. Agile Marketing (A/B Test)', icon: Layers },
  ];

  const currentItem = navItems.find((item) => item.id === currentTab) || navItems[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#261912] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#1C120C] text-[#FAF7F2] border-r border-[#332117] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Lockup */}
        <div className="p-6 border-b border-[#332117] space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C59A6F] text-[#1C120C] flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5 text-[#1C120C]" />
            </div>
            <div>
              <h2 className="font-serif-brand text-lg font-bold text-[#FAF7F2] leading-tight">
                Kopi Tepi Delta
              </h2>
              <span className="text-[10px] tracking-widest uppercase text-[#C59A6F] font-semibold block">
                Panel Kontrol Bisnis
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items (9 Modules) */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Modul Manajemen
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#C59A6F] text-[#1C120C] font-bold shadow-sm'
                    : 'text-[#C4B7AC] hover:bg-[#2A1B12] hover:text-[#FAF7F2]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1C120C]' : 'text-[#A8988C]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Admin User & DB Status */}
        <div className="p-4 border-t border-[#332117] space-y-2.5">
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#2A1B12] border border-[#3D291E] text-[11px] hover:border-[#C59A6F]/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span className="text-[#C4B7AC]">Status Database</span>
            </div>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                supabaseReady
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {supabaseReady ? 'Supabase' : 'Simulasi'}
            </span>
          </button>

          <div className="flex items-center justify-between text-xs text-[#A8988C] pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <UserCheck className="w-3.5 h-3.5 text-[#C59A6F] shrink-0" />
              <span className="truncate text-[11px] text-[#FAF7F2]">{adminUserEmail}</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar dari Panel Admin"
                className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-[#2A1B12] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onBackToCustomer}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2A1B12] hover:bg-[#3D291E] text-xs font-semibold text-[#FAF7F2] transition-colors border border-[#4A3225] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>Lihat Website Pelanggan</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8DFD8] px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#FAF7F2] text-[#261912] hover:bg-[#EFE9E1]"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
                <span>Dashboard Admin</span>
                <span>/</span>
                <span className="font-semibold text-[#261912]">{currentItem.label}</span>
              </div>
              <h1 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#261912] truncate mt-0.5">
                {currentItem.label.replace(/^\d+\.\s*/, '')}
              </h1>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* WhatsApp Admin Hotline Setting */}
            {isEditingPhone ? (
              <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#C59A6F]">
                <span className="text-[10px] text-[#8C7A6B] pl-1 font-mono">WA:</span>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="6281234567890"
                  className="w-28 sm:w-32 px-1.5 py-0.5 text-xs font-mono bg-white border border-[#DDD3C7] rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (phoneInput.trim()) {
                      setAdminWhatsappPhone(phoneInput.trim());
                    }
                    setIsEditingPhone(false);
                  }}
                  className="px-2 py-0.5 bg-[#261912] text-white text-[10px] font-bold rounded hover:bg-[#3D291E]"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneInput(adminWhatsappPhone);
                    setIsEditingPhone(false);
                  }}
                  className="px-1 text-[10px] text-gray-500 hover:text-gray-800"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingPhone(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#DDD3C7] text-[11px] text-[#5A483D] hover:border-[#261912] transition-colors"
                title="Klik untuk mengubah nomor WhatsApp tujuan pesanan pelanggan"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span>No. WA Pesanan:</span>
                <span className="font-mono font-bold text-[#261912] tabular-nums">+{adminWhatsappPhone}</span>
                <span className="text-[9px] text-[#8C7A6B] uppercase font-semibold underline ml-0.5">Ubah</span>
              </button>
            )}

            {/* Database Status Button */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
                supabaseReady
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-[#FAF3EA] border-[#E0D2C3] text-[#8C582B] hover:bg-[#F2E5D5]'
              }`}
              title="Periksa status koneksi database Supabase & skema SQL"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold">
                {supabaseReady ? 'Supabase Connected' : 'DB: Mode Simulasi'}
              </span>
            </button>

            {/* Admin User Badge & Logout */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DDD3C7] text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#8C582B]" />
              <span className="font-semibold text-[#261912]">{adminUserEmail}</span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase tracking-wider ml-1 hover:underline cursor-pointer flex items-center gap-0.5"
                  title="Kunci dashboard dan keluar"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              )}
            </div>

            <button
              onClick={onBackToCustomer}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#261912] text-white hover:bg-[#3D291E] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Ke Toko</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-[#1C120C] text-[#FAF7F2] h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#332117]">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#C59A6F]" />
                  <span className="font-serif-brand font-bold text-lg text-white">
                    Kopi Tepi Delta
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#C4B7AC] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-[#C59A6F] text-[#1C120C] font-bold'
                          : 'text-[#C4B7AC] hover:bg-[#2A1B12]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#332117]">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onBackToCustomer();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2A1B12] text-xs font-semibold text-white flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#C59A6F]" />
                <span>Kembali ke Website Pelanggan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Status Database & Panduan Setup Supabase */}
      <DatabaseStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
};

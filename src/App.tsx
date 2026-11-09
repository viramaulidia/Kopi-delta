import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { MenuSection } from './components/customer/MenuSection';
import { OrderSection } from './components/customer/OrderSection';
import { PromoSection } from './components/customer/PromoSection';
import { AboutSection } from './components/customer/AboutSection';
import { BranchSection } from './components/customer/BranchSection';
import { ContactSection } from './components/customer/ContactSection';
import { ItemModal } from './components/customer/ItemModal';
import { OrderDrawer } from './components/customer/OrderDrawer';
import { CustomerChatbot } from './components/customer/CustomerChatbot';
import { Toast, ToastMessage } from './components/Toast';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminMarketing } from './components/admin/AdminMarketing';
import { AdminRFM } from './components/admin/AdminRFM';
import { AdminContextual } from './components/admin/AdminContextual';
import { AdminSales } from './components/admin/AdminSales';
import { AdminMenu } from './components/admin/AdminMenu';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminPredictions } from './components/admin/AdminPredictions';
import { AdminAIPromo } from './components/admin/AdminAIPromo';
import { AdminAIChatbot } from './components/admin/AdminAIChatbot';
import { AdminABTesting } from './components/admin/AdminABTesting';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { isSupabaseConfigured } from './lib/supabase';
import { createOrderInDatabase } from './services/supabaseService';

import {
  INITIAL_MENU_ITEMS,
  INITIAL_PROMOS,
  BRANCHES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_AB_TESTS,
} from './data/mockData';
import { MenuItem, CartItem, Order, Promo, Customer, ABTestCampaign } from './types';
import { LayoutDashboard, Store } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [activeSection, setActiveSection] = useState('beranda');
  const [currentAdminTab, setCurrentAdminTab] = useState('overview');

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUserEmail, setAdminUserEmail] = useState('admin@kopitepidelta.id');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // WhatsApp hotline for ordering (can be changed by Admin)
  const [adminWhatsappPhone, setAdminWhatsappPhone] = useState('6281234567890');

  // Core Data States
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [promos, setPromos] = useState<Promo[]>(INITIAL_PROMOS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [abCampaigns, setAbCampaigns] = useState<ABTestCampaign[]>(INITIAL_AB_TESTS);

  // Cart & Order Drawer States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
    addToast(
      'Item Ditambahkan ke Keranjang',
      `${newItem.item.name} (${newItem.quantity}x) berhasil dimasukkan ke daftar pesanan.`
    );
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart({
      item,
      quantity: 1,
      sugarLevel: 'Normal',
      iceLevel: 'Normal Ice',
      milkType: 'Fresh Milk',
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) =>
      prev.map((c, i) => (i === index ? { ...c, quantity: newQty } : c))
    );
  };

  const handleRemoveCartItem = (index: number) => {
    const removedItem = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (removedItem) {
      addToast(
        'Item Dihapus',
        `${removedItem.item.name} telah dikeluarkan dari keranjang belanja.`,
        'info'
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
    addToast('Keranjang Dikosongkan', 'Semua menu dalam keranjang telah dihapus.', 'info');
  };

  const handleApplyPromoCode = (code: string) => {
    setAppliedPromoCode(code);
    setIsCartOpen(true);
    addToast('Kode Promo Diterapkan', `Kode promo ${code} berhasil dipasang ke keranjang pesanan.`);
  };

  // Admin Authentication Handlers
  const handleRequestAdminView = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (email: string) => {
    setIsAdminAuthenticated(true);
    setAdminUserEmail(email);
    setIsAuthModalOpen(false);
    setCurrentView('admin');
    addToast(
      'Akses Admin Terverifikasi',
      `Selamat datang kembali, ${email}. Anda telah masuk ke Dashboard Manajemen Kopi Tepi Delta.`
    );
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('customer');
    addToast(
      'Sesi Berakhir',
      'Anda telah keluar dari Dashboard Admin. Akses kembali memerlukan login.',
      'info'
    );
  };

  // Order Creation (from customer simulation & Supabase sync)
  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Asynchronously sync to Supabase if credentials are provided
    if (isSupabaseConfigured()) {
      createOrderInDatabase(newOrder).catch((err) => {
        console.warn('Gagal sinkronisasi pesanan ke Supabase:', err);
      });
    }

    // Update customer record if matching phone exists, or add new
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === newOrder.customerPhone);
      if (existing) {
        return prev.map((c) =>
          c.phone === newOrder.customerPhone
            ? {
                ...c,
                visits: c.visits + 1,
                totalSpent: c.totalSpent + newOrder.total,
                lastVisit: 'Baru saja',
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `CUST-${String(prev.length + 1).padStart(3, '0')}`,
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          email: `${newOrder.customerName.toLowerCase().replace(/\s+/g, '.')}@user.id`,
          tier: 'Delta Member',
          visits: 1,
          totalSpent: newOrder.total,
          favoriteDrink: newOrder.items[0]?.name || 'Specialty Coffee',
          lastVisit: 'Baru saja',
        };
        return [newCust, ...prev];
      }
    });
  };

  // Admin Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast('Status Diperbarui', `Pesanan #${orderId} kini berstatus: ${newStatus}`);
  };

  const handleToggleMenuAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
    const item = menuItems.find((m) => m.id === id);
    if (item) {
      addToast(
        'Stok Diubah',
        `Status menu ${item.name} kini ${!item.isAvailable ? 'Tersedia' : 'Habis'}.`
      );
    }
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
    addToast('Menu Baru Ditambahkan', `${newItem.name} berhasil terdaftar di katalog produk.`);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === updatedItem.id ? updatedItem : m))
    );
    addToast('Menu Diperbarui', `Perubahan untuk ${updatedItem.name} berhasil disimpan.`);
  };

  const handleTogglePromo = (promoId: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p))
    );
    const promo = promos.find((p) => p.id === promoId);
    if (promo) {
      addToast(
        'Promo Diubah',
        `Promo ${promo.title} kini ${!promo.isActive ? 'Aktif' : 'Nonaktif'}.`
      );
    }
  };

  const handleAddPromo = (newPromo: Promo) => {
    setPromos((prev) => [newPromo, ...prev]);
    addToast('Promo Diterbitkan', `Promo ${newPromo.title} aktif di website pelanggan.`);
  };

  const handleApplyABWinner = (campaignId: string, winner: 'Variant A' | 'Variant B') => {
    setAbCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, status: 'Selesai', recommendedWinner: winner } : c
      )
    );

    const campaign = abCampaigns.find((c) => c.id === campaignId);
    if (campaign) {
      const winnerData = winner === 'Variant A' ? campaign.variantA : campaign.variantB;
      const code = winner === 'Variant A' ? 'DISC10SUSU' : 'BUNDLECROISSANT';

      setPromos((prev) => {
        if (prev.some((p) => p.code === code)) return prev;
        const newPromo: Promo = {
          id: `promo-ab-${Date.now()}`,
          code,
          title: winnerData.name,
          discountDescription: winnerData.description,
          discountType: winner === 'Variant A' ? 'percentage' : 'bundle',
          discountValue: winner === 'Variant A' ? 10 : 12000,
          minPurchase: winner === 'Variant A' ? 28000 : 48000,
          validUntil: '31 Desember 2026',
          isActive: true,
          targetAudience: 'Pemenang Eksperimen Agile Marketing',
          estimatedUplift: `+${campaign.confidenceScore}% Validasi Konversi`,
        };
        return [newPromo, ...prev];
      });
    }

    addToast(
      'Eksperimen Ditetapkan',
      `${winner} berhasil diterapkan sebagai promo resmi dan aktif di website pelanggan.`
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#261912] selection:bg-[#C59A6F]/30 selection:text-[#261912]">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Floating Action Button for View Switching */}
      <aside aria-label="Navigasi Cepat Pengalihan Mode" className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            if (currentView === 'customer') {
              handleRequestAdminView();
            } else {
              setCurrentView('customer');
            }
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C120C] text-[#FAF7F2] hover:bg-[#332117] shadow-xl border border-[#C59A6F]/50 transition-all hover:scale-105 focus:outline-none cursor-pointer"
        >
          {currentView === 'customer' ? (
            <>
              <LayoutDashboard className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-semibold">Buka Dashboard Admin</span>
            </>
          ) : (
            <>
              <Store className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-semibold">Buka Website Pelanggan</span>
            </>
          )}
        </button>
      </aside>

      {/* Render Current View */}
      {currentView === 'customer' ? (
        /* ================= A. WEBSITE PELANGGAN ================= */
        <div className="flex flex-col min-h-screen">
          {/* Top Navbar */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onOpenAdmin={handleRequestAdminView}
          />

          <main className="flex-1">
            {/* 1. Home / Hero */}
            <HeroSection
              onExploreMenu={() => {
                const el = document.getElementById('menu');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBranches={() => {
                const el = document.getElementById('cabang');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Menu Section */}
            <MenuSection
              items={menuItems}
              onSelectItem={(item) => setSelectedItemForModal(item)}
              onQuickAdd={handleQuickAdd}
            />

            {/* 6. Pemesanan / Order Section On-Page */}
            <OrderSection
              cart={cart}
              onOpenCart={() => setIsCartOpen(true)}
              onExploreMenu={() => {
                const el = document.getElementById('menu');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              adminWhatsappPhone={adminWhatsappPhone}
            />

            {/* 3. Promo Section */}
            <PromoSection
              promos={promos.filter((p) => p.isActive)}
              onApplyPromo={handleApplyPromoCode}
            />

            {/* 4. Tentang Kami */}
            <AboutSection />

            {/* 5. Lokasi Cabang */}
            <BranchSection branches={BRANCHES} />

            {/* 7. Kontak & WhatsApp */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer
            onOpenSection={(id) => {
              const el = document.getElementById(id);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAdmin={handleRequestAdminView}
          />

          {/* Item Customizer Modal (Product Detail View) */}
          <ItemModal
            item={selectedItemForModal}
            onClose={() => setSelectedItemForModal(null)}
            onAddToCart={handleAddToCart}
          />

          {/* Pemesanan / Cart & Checkout Drawer */}
          <OrderDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            promos={promos}
            branches={BRANCHES}
            appliedPromoCode={appliedPromoCode}
            setAppliedPromoCode={setAppliedPromoCode}
            onCreateOrder={handleCreateOrder}
            adminWhatsappPhone={adminWhatsappPhone}
            onNotifySuccess={(title, msg) => addToast(title, msg, 'success')}
          />

          {/* Delta Virtual Barista Chatbot (Customer Floating Assistant) */}
          <CustomerChatbot
            menuItems={menuItems}
            promos={promos}
            branches={BRANCHES}
            onOpenCart={() => setIsCartOpen(true)}
            onSelectItemForModal={(item) => setSelectedItemForModal(item)}
            onApplyPromoCode={handleApplyPromoCode}
            adminWhatsappPhone={adminWhatsappPhone}
          />
        </div>
      ) : (
        /* ================= B. DASHBOARD ADMIN ================= */
        <AdminLayout
          currentTab={currentAdminTab}
          setCurrentTab={setCurrentAdminTab}
          onBackToCustomer={() => setCurrentView('customer')}
          adminWhatsappPhone={adminWhatsappPhone}
          setAdminWhatsappPhone={setAdminWhatsappPhone}
          adminUserEmail={adminUserEmail}
          onLogout={handleAdminLogout}
        >
          {/* 1. Dashboard Ringkasan */}
          {currentAdminTab === 'overview' && (
            <AdminOverview
              orders={orders}
              menuItems={menuItems}
              onNavigateTab={(tab) => setCurrentAdminTab(tab)}
            />
          )}

          {/* 2. Data-Driven Marketing */}
          {currentAdminTab === 'marketing' && (
            <AdminMarketing
              orders={orders}
              menuItems={menuItems}
              onNavigateToRFM={() => setCurrentAdminTab('rfm')}
            />
          )}

          {/* 3. Analisis Pelanggan RFM */}
          {currentAdminTab === 'rfm' && (
            <AdminRFM
              orders={orders}
              customers={customers}
              adminWhatsappPhone={adminWhatsappPhone}
              onNavigateToContextual={() => setCurrentAdminTab('contextual')}
            />
          )}

          {/* 4. Contextual Marketing */}
          {currentAdminTab === 'contextual' && (
            <AdminContextual
              orders={orders}
              customers={customers}
              branches={BRANCHES}
              activePromos={promos}
              onTogglePromo={handleTogglePromo}
              onAddPromo={handleAddPromo}
              adminWhatsappPhone={adminWhatsappPhone}
            />
          )}

          {/* 4. Data Penjualan */}
          {currentAdminTab === 'sales' && (
            <AdminSales
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {/* 3. Data Menu */}
          {currentAdminTab === 'menu' && (
            <AdminMenu
              menuItems={menuItems}
              onToggleAvailability={handleToggleMenuAvailability}
              onAddMenuItem={handleAddMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
            />
          )}

          {/* 4. Data Pelanggan */}
          {currentAdminTab === 'customers' && (
            <AdminCustomers customers={customers} />
          )}

          {/* 5. Analisis Pelanggan */}
          {currentAdminTab === 'analytics' && <AdminAnalytics />}

          {/* 6. Prediksi Penjualan (Predictive Marketing) */}
          {currentAdminTab === 'predictions' && (
            <AdminPredictions
              orders={orders}
              menuItems={menuItems}
              branches={BRANCHES}
            />
          )}

          {/* 7. Rekomendasi Promosi AI */}
          {currentAdminTab === 'ai-promo' && (
            <AdminAIPromo
              promos={promos}
              onTogglePromo={handleTogglePromo}
              onAddPromo={handleAddPromo}
            />
          )}

          {/* 8. Chatbot AI */}
          {currentAdminTab === 'ai-chat' && <AdminAIChatbot />}

          {/* 12. Pengujian A/B Promosi (Agile Marketing) */}
          {currentAdminTab === 'ab-testing' && (
            <AdminABTesting
              campaigns={abCampaigns}
              onApplyWinner={handleApplyABWinner}
              onUpdateCampaign={(updated) =>
                setAbCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
              }
            />
          )}
        </AdminLayout>
      )}

      {/* Admin Authentication Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleAdminLoginSuccess}
      />
    </div>
  );
}

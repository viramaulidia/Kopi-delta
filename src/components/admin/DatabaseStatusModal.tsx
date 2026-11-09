import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  Table,
  Lock,
  X,
  FileCode,
  Terminal,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copiedSql, setCopiedSql] = useState(false);
  const isConfigured = isSupabaseConfigured();

  const handleCopySql = () => {
    // Read schema.sql content or predefined DDL string
    const sqlScript = `-- KOPI TEPI DELTA — SKEMA DATABASE SUPABASE POSTGRESQL & POLIS KEAMANAN (RLS)
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    hours TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    maps_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    roast_level TEXT,
    flavor_notes TEXT[] DEFAULT '{}',
    sales_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    tier TEXT DEFAULT 'Delta Member' NOT NULL,
    visits INTEGER DEFAULT 1 NOT NULL,
    total_spent NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    favorite_drink TEXT,
    last_visit TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL,
    branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL,
    branch_name TEXT NOT NULL,
    table_number TEXT,
    address TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    promo_code TEXT,
    total NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'Menunggu' NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE SET NULL,
    menu_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    custom_options TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.promotions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_description TEXT NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC(12, 2) NOT NULL,
    min_purchase NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    valid_until TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    target_audience TEXT,
    estimated_uplift TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ab_test_campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT DEFAULT 'Berjalan' NOT NULL,
    variant_a_name TEXT NOT NULL,
    variant_a_desc TEXT NOT NULL,
    variant_a_impressions INTEGER DEFAULT 0 NOT NULL,
    variant_a_conversions INTEGER DEFAULT 0 NOT NULL,
    variant_a_revenue NUMERIC(14, 2) DEFAULT 0 NOT NULL,
    variant_b_name TEXT NOT NULL,
    variant_b_desc TEXT NOT NULL,
    variant_b_impressions INTEGER DEFAULT 0 NOT NULL,
    variant_b_conversions INTEGER DEFAULT 0 NOT NULL,
    variant_b_revenue NUMERIC(14, 2) DEFAULT 0 NOT NULL,
    recommended_winner TEXT DEFAULT 'Draw' NOT NULL,
    confidence_score NUMERIC(5, 2) DEFAULT 95.0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AKTIFKAN RLS (ROW LEVEL SECURITY)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL TO authenticated USING (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#EFE9E1] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#1C120C] text-[#FAF7F2] flex items-center justify-between border-b border-[#332117]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59A6F] text-[#1C120C] flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-[#1C120C]" />
            </div>
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-[#FAF7F2]">
                Status & Panduan Integrasi Supabase
              </h3>
              <p className="text-xs text-[#A8988C] mt-0.5">
                Penyimpanan Data Relasional & Kebijakan Keamanan (RLS) Kopi Tepi Delta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A8988C] hover:text-[#FAF7F2] p-1.5 rounded-lg hover:bg-[#2A1B12] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-[#523E32]">
          {/* Status Indicator Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-[#FAF3EA] border-[#E0D2C3] text-[#523E32]'
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#8C582B] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#1C120C]">
                {isConfigured
                  ? 'Status: Kredensial Supabase Terkonfigurasi'
                  : 'Status: Belum Terhubung ke Database Supabase (Mode Simulasi Aktif)'}
              </h4>
              <p className="text-xs leading-relaxed text-[#6B5749]">
                {isConfigured
                  ? 'Aplikasi telah memiliki konfigurasi Supabase Project URL dan Anon Key. Data dapat disinkronkan ke PostgreSQL.'
                  : 'Project Kopi Tepi Delta saat ini masih berjalan dalam mode in-memory data simulasi. Seluruh arsitektur tabel relasional, skema SQL, dan polis RLS telah disiapkan dan siap dihubungkan ke akun Supabase Anda.'}
              </p>
            </div>
          </div>

          {/* 6 Data Entities Covered */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#1C120C] flex items-center gap-2">
              <Table className="w-4 h-4 text-[#8C582B]" />
              <span>Struktur Tabel & Relasi yang Disiapkan:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">1. public.menu_items</span>
                <span className="text-[11px] text-[#7A695D] block">Menyimpan katalog kopi & makanan, harga, kategori, status stok ketersediaan.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">2. public.branches</span>
                <span className="text-[11px] text-[#7A695D] block">Menyimpan data 3 cabang (alamat, kontak, jam buka, Google Maps URL).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">3. public.customers</span>
                <span className="text-[11px] text-[#7A695D] block">Profil pelanggan, loyalty tier, total belanja, dan nomor WhatsApp.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">4. public.orders</span>
                <span className="text-[11px] text-[#7A695D] block">Header transaksi, nama pemesan, cabang tujuan, subtotal, diskon, dan total.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">5. public.order_items</span>
                <span className="text-[11px] text-[#7A695D] block">Relasi 1:N ke orders dan menu_items (rincian item, varian susu/es, subtotal).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">6. public.promotions</span>
                <span className="text-[11px] text-[#7A695D] block">Kode voucher kupon diskon, batas minimal belanja, dan status aktif.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1 sm:col-span-2">
                <span className="font-mono font-bold text-[#8C582B] block">7. public.ab_test_campaigns</span>
                <span className="text-[11px] text-[#7A695D] block">Data eksperimen Agile Marketing (Variasi A vs B, impressions, konversi, omset).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-1">
                <span className="font-mono font-bold text-[#8C582B] block">8. public.admin_profiles</span>
                <span className="text-[11px] text-[#7A695D] block">Hak akses terotentikasi Supabase Auth khusus pengelola cafe.</span>
              </div>
            </div>
          </div>

          {/* RLS Security Explanations */}
          <div className="p-4 rounded-2xl bg-[#FAF3EA] border border-[#E0D2C3] space-y-2">
            <h4 className="font-bold text-sm text-[#1C120C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C582B]" />
              <span>Kebijakan Keamanan Database (Row Level Security - RLS):</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#523E32]">
              <li><strong>Pelanggan Publik:</strong> Hanya memiliki izin <code className="bg-white/80 px-1 py-0.5 rounded font-mono">SELECT</code> untuk membaca menu, cabang, dan promo aktif, serta izin <code className="bg-white/80 px-1 py-0.5 rounded font-mono">INSERT</code> untuk membuat pesanan baru (checkout).</li>
              <li><strong>Proteksi Admin:</strong> Halaman Dashboard Admin diproteksi dengan otentikasi login. Hanya user terautentikasi (<code className="bg-white/80 px-1 py-0.5 rounded font-mono">authenticated</code>) yang dapat melihat metrik keuangan, mengubah menu, mengelola promo, dan mengakses analisis pelanggan RFM.</li>
            </ul>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#1C120C] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#8C582B]" />
              <span>Langkah yang Harus Dilakukan untuk Mengaktifkan Supabase:</span>
            </h4>
            <ol className="space-y-2 list-decimal list-inside bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4DC] leading-relaxed">
              <li>
                Buka <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#8C582B] font-bold underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a> dan buat project baru (gratis).
              </li>
              <li>
                Masuk ke menu <strong>SQL Editor</strong> di dashboard Supabase Anda.
              </li>
              <li>
                Klik tombol <strong>"Salin Script SQL Schema & RLS"</strong> di bawah ini, lalu tempelkan (*paste*) ke SQL Editor Supabase dan klik <strong>Run</strong>.
              </li>
              <li>
                Buka menu <strong>Project Settings -&gt; API</strong> di Supabase, lalu salin <strong>Project URL</strong> dan <strong>anon/public API Key</strong>.
              </li>
              <li>
                Isikan nilai tersebut ke environment variable aplikasi:
                <pre className="mt-1.5 bg-[#1C120C] text-[#FAF7F2] p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."`}
                </pre>
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer with 1-Click Copy */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#7A695D]">
            File skema lengkap tersimpan di: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E0D2C3]">/supabase/schema.sql</code>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopySql}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#C59A6F] text-[#1C120C] text-xs font-bold hover:bg-[#D5AA7F] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Script SQL Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Script SQL Schema & RLS</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1C120C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332117] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

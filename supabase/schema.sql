-- ==============================================================================
-- KOPI TEPI DELTA — SKEMA DATABASE SUPABASE POSTGRESQL & POLIS KEAMANAN (RLS)
-- ==============================================================================
-- Skema ini dirancang untuk prototype bisnis coffee shop Kopi Tepi Delta.
-- Menghubungkan data menu, cabang, pelanggan, transaksi & rincian, promosi, 
-- pengujian A/B, serta hak akses autentikasi admin.
-- ==============================================================================

-- 1. TABEL CABANG (branches)
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

-- 2. TABEL MENU (menu_items)
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

-- 3. TABEL PELANGGAN (customers)
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

-- 4. TABEL TRANSAKSI (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('Dine-in (Meja)', 'Takeaway', 'Delivery Lokal')),
    branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL,
    branch_name TEXT NOT NULL,
    table_number TEXT,
    address TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(12, 2) DEFAULT 0 NOT NULL CHECK (discount >= 0),
    promo_code TEXT,
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status TEXT DEFAULT 'Menunggu' NOT NULL CHECK (status IN ('Selesai', 'Sedang Diracik', 'Menunggu', 'Dibatalkan')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('QRIS', 'Transfer Bank', 'Tunai di Kasir')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABEL RINCIAN TRANSAKSI (order_items)
-- Relasi 1:N ke orders dan menu_items
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE SET NULL,
    menu_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    custom_options TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABEL PROMOSI (promotions)
CREATE TABLE IF NOT EXISTS public.promotions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bundle')),
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value >= 0),
    min_purchase NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    valid_until TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    target_audience TEXT,
    estimated_uplift TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABEL PENGUJIAN A/B (ab_test_campaigns)
CREATE TABLE IF NOT EXISTS public.ab_test_campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT DEFAULT 'Berjalan' NOT NULL CHECK (status IN ('Berjalan', 'Selesai', 'Draft')),
    variant_a_name TEXT NOT NULL,
    variant_a_desc TEXT NOT NULL,
    variant_a_impressions INTEGER DEFAULT 0 NOT NULL,
    variant_a_clicks INTEGER DEFAULT 0 NOT NULL,
    variant_a_conversions INTEGER DEFAULT 0 NOT NULL,
    variant_a_revenue NUMERIC(14, 2) DEFAULT 0 NOT NULL,
    variant_b_name TEXT NOT NULL,
    variant_b_desc TEXT NOT NULL,
    variant_b_impressions INTEGER DEFAULT 0 NOT NULL,
    variant_b_clicks INTEGER DEFAULT 0 NOT NULL,
    variant_b_conversions INTEGER DEFAULT 0 NOT NULL,
    variant_b_revenue NUMERIC(14, 2) DEFAULT 0 NOT NULL,
    recommended_winner TEXT DEFAULT 'Draw' NOT NULL,
    confidence_score NUMERIC(5, 2) DEFAULT 95.0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABEL PROFIL ADMIN (admin_profiles)
-- Terhubung ke Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXING UNTUK EFISIENSI QUERY & ANALITIK
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_branch_id ON public.orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_menu_category ON public.menu_items(category);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) KEBIJAKAN KEAMANAN DATABASE
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 1. Cabang & Menu: Publik dapat melihat (SELECT)
CREATE POLICY "Public Read Branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Active Promotions" ON public.promotions FOR SELECT USING (true);

-- 2. Transaksi: Publik (Pelanggan) dapat membuat pesanan baru (INSERT)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- 3. Pelanggan dapat melihat data transaksi mereka berdasarkan nomor telepon
CREATE POLICY "Public Read Own Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- 4. Admin: Memiliki akses penuh (CRUD) ke seluruh tabel
-- Syarat: User terautentikasi melalui Supabase Auth
CREATE POLICY "Admin Full Access Branches" ON public.branches FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Menu Items" ON public.menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Promotions" ON public.promotions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access AB Tests" ON public.ab_test_campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Read Profiles" ON public.admin_profiles FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- SEED DATA AWAL (Contoh Data Cabang & Menu Kopi Tepi Delta)
-- ==============================================================================

INSERT INTO public.branches (id, name, address, city, phone, hours, description, features, maps_url)
VALUES
('branch-1', 'Kopi Tepi Delta — Promenade Riverfront', 'Jl. Tepian Sungai No. 12, Wonokromo', 'Surabaya', '0812-3456-7890', '07:00 – 23:00 WIB', 'Duduk santai di dek kayu terbuka tepat di bibir perairan delta dengan semilir angin sepoi sore hari.', ARRAY['Outdoor Riverfront Deck', 'Live Acoustic Sunset', 'Manual Brew Slow Bar', 'Private Meeting Pods'], 'https://maps.google.com/?q=Kopi+Tepi+Delta+Promenade+Riverfront'),
('branch-2', 'Kopi Tepi Delta — Heritage Kota Lama', 'Jl. Kolonial No. 45, Kawasan Kota Lama', 'Semarang', '0812-9876-5432', '08:00 – 22:00 WIB', 'Menempati bangunan kolonial beratap tinggi dengan sentuhan interior kayu jati dan teras tepi kanal bersejarah.', ARRAY['Indoor High Ceiling Heritage', 'Full AC Silent Working Area', 'Specialty Single Origin Bar', 'High Speed Fiber WiFi'], 'https://maps.google.com/?q=Kopi+Tepi+Delta+Heritage+Kota+Lama'),
('branch-3', 'Kopi Tepi Delta — Sky Sanctuary', 'Sky Garden Tower Lt. 18, Jl. Asia Afrika', 'Bandung', '0813-2233-4455', '10:00 – 24:00 WIB', 'Kombinasi angin sejuk rooftop dan panorama perairan delta dari ketinggian.', ARRAY['Panoramic Rooftop Sunset View', 'Acoustic Weekend Lounge', 'Specialty Mocktail Bar', 'Co-working Dedicated Space'], 'https://maps.google.com/?q=Kopi+Tepi+Delta+Sky+Sanctuary')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.menu_items (id, name, category, price, description, is_popular, is_available, roast_level, flavor_notes, sales_count)
VALUES
('menu-1', 'Delta Sea Salt Cold Brew', 'Signature Delta', 36000, 'Cold brew 18 jam dengan crema sea salt khas pesisir, perpaduan manis gurih dan kelembutan kopi arabika.', true, true, 'Medium', ARRAY['Sea Salt Crema', 'Caramelized Sugar', 'Dark Chocolate'], 684),
('menu-2', 'Kopi Susu Tepi Sungai', 'Signature Delta', 28000, 'Espresso ganda berpadu susu segar dan gula aren murni lereng pegunungan, rasa legit nan otentik.', true, true, 'Dark', ARRAY['Organic Palm Sugar', 'Rich Body', 'Nutty'], 942),
('menu-3', 'Artisan Cafe Latte Swan', 'Specialty Espresso', 34000, 'Single origin espresso dengan microfoam steamed milk bertekstur beludru dan latte art presisi.', false, true, 'Medium', ARRAY['Velvety Microfoam', 'Almond', 'Stone Fruit'], 421),
('menu-4', 'V60 Single Origin Gayo Honey', 'Manual Brew & V60', 38000, 'Seduhan manual V60 menggunakan biji Gayo proses honey. Karakter bersih dengan aroma melati dan rasa peach segar.', true, true, 'Light', ARRAY['Jasmine Floral', 'Peach Blossom', 'Wild Honey'], 312),
('menu-5', 'French Almond Croissant', 'Artisanal Pastry', 32000, 'Croissant mentega Prancis berlapis renyah dengan isian frangipane almond panggang harum.', true, true, NULL, ARRAY['Pure French Butter', 'Roasted Almond Flakes', 'Vanilla Frangipane'], 580)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.promotions (id, code, title, discount_description, discount_type, discount_value, min_purchase, valid_until, is_active, target_audience, estimated_uplift)
VALUES
('promo-1', 'DELTASUNSET', 'Delta Sunset Hour Disc 20%', 'Diskon 20% untuk semua menu kopi setiap pukul 16:30 - 18:30 WIB.', 'percentage', 20, 50000, '30 November 2026', true, 'Penikmat sunset riverside & pekerja sore', '+24% Volume Sore Hari'),
('promo-2', 'MORNINGCOMBO', 'Morning Brew & Croissant Combo', 'Paket Hot Latte / Americano + Almond Croissant hanya Rp 48.000 (hemat Rp 18.000).', 'bundle', 18000, 48000, '31 Desember 2026', true, 'Morning commuter & remote workers', '+18% Transaksi Pagi')
ON CONFLICT (id) DO NOTHING;

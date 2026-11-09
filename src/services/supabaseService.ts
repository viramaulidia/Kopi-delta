import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MenuItem, Branch, Customer, Order, Promo, ABTestCampaign } from '../types';

export interface DatabaseStatus {
  isConfigured: boolean;
  isConnected: boolean;
  provider: 'Supabase PostgreSQL' | 'Simulasi Lokal (In-Memory)';
  error?: string;
}

/**
 * Memeriksa status koneksi ke database Supabase
 */
export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  if (!isSupabaseConfigured()) {
    return {
      isConfigured: false,
      isConnected: false,
      provider: 'Simulasi Lokal (In-Memory)',
      error: 'Environment variable VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum dikonfigurasi.',
    };
  }

  try {
    const { data, error } = await supabase.from('branches').select('id').limit(1);
    if (error) {
      return {
        isConfigured: true,
        isConnected: false,
        provider: 'Supabase PostgreSQL',
        error: error.message,
      };
    }
    return {
      isConfigured: true,
      isConnected: true,
      provider: 'Supabase PostgreSQL',
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      provider: 'Supabase PostgreSQL',
      error: err.message || 'Gagal menghubungi server Supabase.',
    };
  }
}

/**
 * 1. Data Cabang
 */
export async function getBranches(fallbackBranches: Branch[]): Promise<Branch[]> {
  if (!isSupabaseConfigured()) return fallbackBranches;

  try {
    const { data, error } = await supabase.from('branches').select('*');
    if (error || !data || data.length === 0) return fallbackBranches;

    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      address: b.address,
      city: b.city,
      phone: b.phone,
      hours: b.hours,
      description: b.description || '',
      features: b.features || [],
      mapsUrl: b.maps_url || '',
    }));
  } catch {
    return fallbackBranches;
  }
}

/**
 * 2. Data Menu
 */
export async function getMenuItems(fallbackItems: MenuItem[]): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) return fallbackItems;

  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error || !data || data.length === 0) return fallbackItems;

    return data.map((m: any) => ({
      id: m.id,
      name: m.name,
      category: m.category as any,
      price: Number(m.price),
      description: m.description || '',
      image: m.image_url || '',
      isPopular: Boolean(m.is_popular),
      isAvailable: Boolean(m.is_available),
      roastLevel: m.roast_level || undefined,
      notes: m.flavor_notes || [],
      salesCount: m.sales_count || 0,
    }));
  } catch {
    return fallbackItems;
  }
}

/**
 * 3. Data Pelanggan
 */
export async function getCustomers(fallbackCustomers: Customer[]): Promise<Customer[]> {
  if (!isSupabaseConfigured()) return fallbackCustomers;

  try {
    const { data, error } = await supabase.from('customers').select('*');
    if (error || !data || data.length === 0) return fallbackCustomers;

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      tier: c.tier as any,
      visits: c.visits || 1,
      totalSpent: Number(c.total_spent) || 0,
      favoriteDrink: c.favorite_drink || 'Specialty Coffee',
      lastVisit: c.last_visit ? new Date(c.last_visit).toLocaleDateString('id-ID') : 'Baru saja',
    }));
  } catch {
    return fallbackCustomers;
  }
}

/**
 * 4. Data Transaksi & Detail Transaksi
 */
export async function getOrders(fallbackOrders: Order[]): Promise<Order[]> {
  if (!isSupabaseConfigured()) return fallbackOrders;

  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (ordersError || !ordersData || ordersData.length === 0) return fallbackOrders;

    return ordersData.map((o: any) => ({
      id: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      orderType: o.order_type as any,
      branchId: o.branch_id || 'branch-1',
      branchName: o.branch_name,
      tableNumber: o.table_number || undefined,
      address: o.address || undefined,
      items: (o.order_items || []).map((it: any) => ({
        name: it.menu_name,
        quantity: it.quantity,
        price: Number(it.unit_price),
        options: it.custom_options || 'Standar',
      })),
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      promoCode: o.promo_code || undefined,
      total: Number(o.total),
      status: o.status as any,
      paymentMethod: o.payment_method as any,
      timestamp: o.created_at ? o.created_at.replace('T', ' ').substring(0, 16) : '2026-11-05 10:00',
    }));
  } catch {
    return fallbackOrders;
  }
}

/**
 * Menyimpan Transaksi Baru beserta Rincian Item (Relasional)
 */
export async function createOrderInDatabase(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // 1. Insert ke tabel orders
    const { error: orderError } = await supabase.from('orders').insert({
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      order_type: order.orderType,
      branch_id: order.branchId,
      branch_name: order.branchName,
      table_number: order.tableNumber || null,
      address: order.address || null,
      subtotal: order.subtotal,
      discount: order.discount,
      promo_code: order.promoCode || null,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
    });

    if (orderError) {
      console.warn('Gagal menyimpan pesanan ke Supabase:', orderError.message);
      return false;
    }

    // 2. Insert detail transaksi ke tabel order_items
    if (order.items.length > 0) {
      const itemsPayload = order.items.map((it) => ({
        order_id: order.id,
        menu_name: it.name,
        quantity: it.quantity,
        unit_price: it.price,
        custom_options: it.options,
        subtotal: it.price * it.quantity,
      }));

      await supabase.from('order_items').insert(itemsPayload);
    }

    return true;
  } catch (err) {
    console.warn('Exception saat createOrderInDatabase:', err);
    return false;
  }
}

/**
 * 5. Data Promosi
 */
export async function getPromotions(fallbackPromos: Promo[]): Promise<Promo[]> {
  if (!isSupabaseConfigured()) return fallbackPromos;

  try {
    const { data, error } = await supabase.from('promotions').select('*');
    if (error || !data || data.length === 0) return fallbackPromos;

    return data.map((p: any) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      discountDescription: p.discount_description,
      discountType: p.discount_type as any,
      discountValue: Number(p.discount_value),
      minPurchase: Number(p.min_purchase),
      validUntil: p.valid_until,
      isActive: Boolean(p.is_active),
      targetAudience: p.target_audience || 'Semua Pengunjung',
      estimatedUplift: p.estimated_uplift || '+15% Volume',
    }));
  } catch {
    return fallbackPromos;
  }
}

/**
 * 6. Data Pengujian A/B
 */
export async function getABTests(fallbackTests: ABTestCampaign[]): Promise<ABTestCampaign[]> {
  if (!isSupabaseConfigured()) return fallbackTests;

  try {
    const { data, error } = await supabase.from('ab_test_campaigns').select('*');
    if (error || !data || data.length === 0) return fallbackTests;

    return data.map((ab: any) => ({
      id: ab.id,
      title: ab.title,
      goal: ab.goal,
      startDate: ab.start_date,
      endDate: ab.end_date,
      status: ab.status as any,
      variantA: {
        name: ab.variant_a_name,
        description: ab.variant_a_desc,
        impressions: ab.variant_a_impressions,
        clicks: ab.variant_a_clicks,
        conversions: ab.variant_a_conversions,
        revenue: Number(ab.variant_a_revenue),
      },
      variantB: {
        name: ab.variant_b_name,
        description: ab.variant_b_desc,
        impressions: ab.variant_b_impressions,
        clicks: ab.variant_b_clicks,
        conversions: ab.variant_b_conversions,
        revenue: Number(ab.variant_b_revenue),
      },
      recommendedWinner: ab.recommended_winner as any,
      confidenceScore: Number(ab.confidence_score),
    }));
  } catch {
    return fallbackTests;
  }
}

export type ProductCategory = 
  | 'Semua'
  | 'Specialty Espresso'
  | 'Cold Brew Series'
  | 'Manual Brew & V60'
  | 'Signature Delta'
  | 'Artisanal Pastry'
  | 'Savory Bites';

export interface MenuItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  isPopular?: boolean;
  isAvailable: boolean;
  roastLevel?: 'Light' | 'Medium' | 'Dark';
  notes?: string[];
  salesCount: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  sugarLevel: 'Normal' | 'Less Sugar (50%)' | 'No Sugar (0%)';
  iceLevel: 'Normal Ice' | 'Less Ice' | 'No Ice' | 'Hot';
  milkType: 'Fresh Milk' | 'Oat Milk (+Rp 8.000)' | 'Almond Milk (+Rp 9.000)';
  notes?: string;
}

export interface Promo {
  id: string;
  code: string;
  title: string;
  discountDescription: string;
  discountType: 'percentage' | 'fixed' | 'bundle';
  discountValue: number; // 20 for 20%, or 15000 for Rp 15k
  minPurchase: number;
  validUntil: string;
  image?: string;
  isActive: boolean;
  targetAudience: string;
  estimatedUplift: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  description: string;
  features: string[];
  mapsUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'Dine-in (Meja)' | 'Takeaway' | 'Delivery Lokal';
  branchId: string;
  branchName: string;
  tableNumber?: string;
  address?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    options: string;
  }[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: 'Selesai' | 'Sedang Diracik' | 'Menunggu' | 'Dibatalkan';
  paymentMethod: 'QRIS' | 'Transfer Bank' | 'Tunai di Kasir';
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'Delta Platinum' | 'Delta Gold' | 'Delta Silver' | 'Delta Member';
  visits: number;
  totalSpent: number;
  favoriteDrink: string;
  lastVisit: string;
}

export interface ABTestCampaign {
  id: string;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'Berjalan' | 'Selesai' | 'Draft';
  variantA: {
    name: string;
    description: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  variantB: {
    name: string;
    description: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  recommendedWinner: 'Variant A' | 'Variant B' | 'Draw';
  confidenceScore: number;
}

export type RFMSegmentType =
  | 'Pelanggan Loyal'
  | 'Pelanggan Potensial'
  | 'Pelanggan Baru'
  | 'Perlu Perhatian'
  | 'Beresiko Churn';

export interface RFMCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  recencyDays: number;
  lastOrderDate: string;
  frequency: number;
  monetary: number;
  rScore: number; // 1-5
  fScore: number; // 1-5
  mScore: number; // 1-5
  rfmScore: string;
  segment: RFMSegmentType;
  recommendedAction: string;
  favoriteMenu: string;
  preferredBranch: string;
}

export interface RFMSegmentSummary {
  segment: RFMSegmentType;
  count: number;
  percentage: number;
  totalMonetary: number;
  avgMonetary: number;
  description: string;
  marketingAction: string;
  badgeColor: string;
}

export interface ContextualPromoRecommendation {
  id: string;
  promoCode: string;
  title: string;
  targetSegment: RFMSegmentType;
  targetBranch: string;
  timeSlot: string;
  timeCategory: 'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Weekend' | 'Fleksibel';
  discountDescription: string;
  discountType: 'percentage' | 'fixed' | 'bundle';
  discountValue: number;
  minPurchase: number;
  validUntil: string;
  recommendationReason: string;
  matchingCustomerCount: number;
  matchingCustomers: { name: string; phone: string; recencyDays: number; totalSpent: number }[];
  isActivated: boolean;
  targetObjective: string;
  ruleCategory: 'Bundling Loyalitas' | 'Win-Back Churn' | 'Aktivasi Pelanggan Baru' | 'Cross-Sell Potensial' | 'Re-Engagement';
}


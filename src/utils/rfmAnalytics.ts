import { Order, Customer, RFMCustomer, RFMSegmentSummary, RFMSegmentType, MenuItem } from '../types';

export function calculateRFM(
  orders: Order[],
  customers: Customer[],
  referenceDateStr: string = '2026-11-05'
): {
  rfmCustomers: RFMCustomer[];
  segmentSummaries: RFMSegmentSummary[];
  totalMonetary: number;
  avgFrequency: number;
  avgMonetary: number;
} {
  const refDate = new Date(referenceDateStr).getTime();

  // Aggregate orders by customer name / phone
  const customerMap = new Map<string, {
    orders: Order[];
    customerInfo?: Customer;
  }>();

  // Initialize with known customers
  customers.forEach((c) => {
    customerMap.set(c.phone, { orders: [], customerInfo: c });
  });

  // Attach orders
  orders.forEach((o) => {
    const key = o.customerPhone;
    if (!customerMap.has(key)) {
      customerMap.set(key, { orders: [o] });
    } else {
      customerMap.get(key)!.orders.push(o);
    }
  });

  const rfmCustomers: RFMCustomer[] = [];

  customerMap.forEach(({ orders: custOrders, customerInfo }, phone) => {
    if (custOrders.length === 0 && !customerInfo) return;

    const name = customerInfo?.name || custOrders[0]?.customerName || 'Pelanggan';
    const email = customerInfo?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@user.id`;
    const id = customerInfo?.id || `CUST-${phone.slice(-4)}`;

    // Calculate Monetary: sum of order total
    const monetary = custOrders.reduce((sum, o) => sum + o.total, 0);

    // Calculate Frequency: total order count
    const frequency = custOrders.length;

    // Calculate Recency: difference in days from refDate to latest order
    let latestTimestamp = '2026-08-01';
    custOrders.forEach((o) => {
      if (o.timestamp > latestTimestamp) {
        latestTimestamp = o.timestamp;
      }
    });

    const orderTime = new Date(latestTimestamp.slice(0, 10)).getTime();
    const diffDays = Math.max(0, Math.round((refDate - orderTime) / (1000 * 60 * 60 * 24)));
    const recencyDays = diffDays;

    // Calculate Favorite Menu & Preferred Branch
    const menuCounts: { [key: string]: number } = {};
    const branchCounts: { [key: string]: number } = {};

    custOrders.forEach((o) => {
      branchCounts[o.branchName] = (branchCounts[o.branchName] || 0) + 1;
      o.items.forEach((it) => {
        menuCounts[it.name] = (menuCounts[it.name] || 0) + it.quantity;
      });
    });

    let favoriteMenu = customerInfo?.favoriteDrink || 'Delta Sea Salt Cold Brew';
    let maxMenuCount = 0;
    Object.entries(menuCounts).forEach(([m, count]) => {
      if (count > maxMenuCount) {
        maxMenuCount = count;
        favoriteMenu = m;
      }
    });

    let preferredBranch = 'Promenade Riverfront';
    let maxBranchCount = 0;
    Object.entries(branchCounts).forEach(([b, count]) => {
      if (count > maxBranchCount) {
        maxBranchCount = count;
        preferredBranch = b;
      }
    });

    // Score R (1-5)
    let rScore = 1;
    if (recencyDays <= 3) rScore = 5;
    else if (recencyDays <= 7) rScore = 4;
    else if (recencyDays <= 15) rScore = 3;
    else if (recencyDays <= 30) rScore = 2;
    else rScore = 1;

    // Score F (1-5)
    let fScore = 1;
    if (frequency >= 8) fScore = 5;
    else if (frequency >= 5) fScore = 4;
    else if (frequency >= 3) fScore = 3;
    else if (frequency >= 2) fScore = 2;
    else fScore = 1;

    // Score M (1-5)
    let mScore = 1;
    if (monetary >= 500000) mScore = 5;
    else if (monetary >= 300000) mScore = 4;
    else if (monetary >= 180000) mScore = 3;
    else if (monetary >= 75000) mScore = 2;
    else mScore = 1;

    // Segment Definition
    let segment: RFMSegmentType = 'Pelanggan Potensial';
    let recommendedAction = 'Kirim rekomendasi menu baru & promo akhir pekan.';

    if (rScore >= 4 && fScore >= 4 && mScore >= 4) {
      segment = 'Pelanggan Loyal';
      recommendedAction = 'Apresiasi VIP: Gratis Upsize selamanya & undangan eksklusif sesi cupping biji sangrai baru.';
    } else if (rScore >= 4 && fScore <= 2) {
      segment = 'Pelanggan Baru';
      recommendedAction = 'Kirim WhatsApp sambutan & voucher diskon 15% untuk transaksi kedua (Second Visit Incentive).';
    } else if (rScore <= 2 && (fScore >= 3 || mScore >= 3)) {
      segment = 'Perlu Perhatian';
      recommendedAction = 'Kampanye "Kami Rindu Anda": Kirim pesan WhatsApp personal dengan penawaran free pastry pendamping kopi.';
    } else if (rScore === 1 && fScore <= 2) {
      segment = 'Beresiko Churn';
      recommendedAction = 'Reaktivasi: Voucher diskon 25% Delta Sunset Hour untuk menarik kembali ke cafe.';
    } else {
      segment = 'Pelanggan Potensial';
      recommendedAction = 'Dorong loyalitas: Tantangan 5 Stamp Kopi Tepi Delta untuk dapat merchandise tumbler eksklusif.';
    }

    rfmCustomers.push({
      id,
      name,
      phone,
      email,
      recencyDays,
      lastOrderDate: latestTimestamp.slice(0, 10),
      frequency,
      monetary,
      rScore,
      fScore,
      mScore,
      rfmScore: `${rScore}${fScore}${mScore}`,
      segment,
      recommendedAction,
      favoriteMenu,
      preferredBranch,
    });
  });

  // Sort by monetary desc
  rfmCustomers.sort((a, b) => b.monetary - a.monetary);

  // Segment Summaries
  const segmentOrder: RFMSegmentType[] = [
    'Pelanggan Loyal',
    'Pelanggan Potensial',
    'Pelanggan Baru',
    'Perlu Perhatian',
    'Beresiko Churn',
  ];

  const totalMonetary = rfmCustomers.reduce((sum, c) => sum + c.monetary, 0);
  const totalCustomers = rfmCustomers.length;

  const segmentSummaries: RFMSegmentSummary[] = segmentOrder.map((seg) => {
    const inSeg = rfmCustomers.filter((c) => c.segment === seg);
    const count = inSeg.length;
    const segMonetary = inSeg.reduce((sum, c) => sum + c.monetary, 0);
    const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
    const avgMonetary = count > 0 ? Math.round(segMonetary / count) : 0;

    let description = '';
    let marketingAction = '';
    let badgeColor = '';

    switch (seg) {
      case 'Pelanggan Loyal':
        description = 'Frekuensi tinggi, belanja besar, dan rutin berkunjung dalam waktu dekat.';
        marketingAction = 'Berikan privilese VIP, program referral teman, dan tasting menu sangrai baru.';
        badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        break;
      case 'Pelanggan Potensial':
        description = 'Pelanggan aktif dengan tren belanja positif yang siap naik kelas menjadi loyalis.';
        marketingAction = 'Tawarkan bundling paket sarapan, tantangan stamp card, dan promo hari kerja.';
        badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
        break;
      case 'Pelanggan Baru':
        description = 'Baru bertransaksi 1-2 kali dalam 7 hari terakhir.';
        marketingAction = 'Fokus pada retensi kunjungan kedua melalui voucher digital WhatsApp.';
        badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
        break;
      case 'Perlu Perhatian':
        description = 'Pernah berbelanja banyak tetapi sudah 2–4 minggu tidak berkunjung lagi.';
        marketingAction = 'Pemicu re-engagement dengan pesan "Kami Kangen Kamu" dan diskon nostalgia.';
        badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
        break;
      case 'Beresiko Churn':
        description = 'Sudah lebih dari 30 hari tidak ada transaksi.';
        marketingAction = 'Win-back campaign berani dengan promo diskon besar untuk memancing kedatangan ulang.';
        badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
        break;
    }

    return {
      segment: seg,
      count,
      percentage,
      totalMonetary: segMonetary,
      avgMonetary,
      description,
      marketingAction,
      badgeColor,
    };
  });

  const avgFrequency =
    totalCustomers > 0
      ? parseFloat((rfmCustomers.reduce((s, c) => s + c.frequency, 0) / totalCustomers).toFixed(1))
      : 0;
  const avgMonetary = totalCustomers > 0 ? Math.round(totalMonetary / totalCustomers) : 0;

  return {
    rfmCustomers,
    segmentSummaries,
    totalMonetary,
    avgFrequency,
    avgMonetary,
  };
}

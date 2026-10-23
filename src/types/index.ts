export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready to Dispatch'
  | 'Dispatched'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Failed Delivery';

export type PaymentMethod = 'COD' | 'Bank Transfer';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface ProductVariant {
  id: string;
  name: string;
  scent?: string;
  size?: string;
  color?: string;
  priceDelta: number;
  stockQty: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stockQty: number;
  lowStockThreshold: number;
  images: string[];
  shortDesc: string;
  longDesc: string;
  occasionTags: string[];
  isCustomizable?: boolean;
  leadTimeDays?: number;
  dimensions?: string;
  material?: string;
  weightGrams?: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  scentNotes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  isFeatured?: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
  customNote?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
}

export interface DeliveryAddress {
  address: string;
  city: string;
  district: string;
  postalCode?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface Order {
  id: string; // e.g. FLM-00017
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  courier?: {
    name: string;
    trackingNo: string;
    dispatchedDate?: string;
  };
  giftNote?: string;
  notes?: string;
  isEmailVerified?: boolean;
  verificationCode?: string;
  statusHistory: StatusHistoryEntry[];
  source?: {
    utmSource?: string;
    utmCampaign?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  addresses: DeliveryAddress[];
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  isEmailVerified?: boolean;
  isFlaggedForCOD?: boolean;
  notes?: string;
}

export interface DistrictRate {
  district: string;
  province: string;
  rate: number;
  estimatedDays: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiresAt: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  status: 'approved' | 'pending';
  verifiedPurchase: boolean;
  image?: string;
}

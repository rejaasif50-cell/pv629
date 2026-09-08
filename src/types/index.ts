export type OrderStatus =
  | 'Order Received'
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Design Processing'
  | 'Printing'
  | 'Quality Check'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'Pending Verification' | 'Verified' | 'Rejected' | 'Refunded';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface CardService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  offerPrice: number;
  deliveryCharge: number;
  turnaroundTime: string;
  uploadRequirements: string;
  iconName?: string;
  badge?: string;
  active: boolean;
  sampleFrontUrl?: string;
  sampleBackUrl?: string;
}

export interface OrderItem {
  orderId: string; // e.g. REZA-PVC-2026-000001
  userId: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  
  serviceId: string;
  serviceName: string;
  cardHolderName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  grandTotal: number;
  
  deliveryType: 'Standard Delivery' | 'Express Delivery' | 'Urgent Same-Day Dispatch';
  
  frontImageUrl: string;
  frontImageName?: string;
  backImageUrl?: string;
  backImageName?: string;
  documentUrl?: string;
  documentName?: string;
  
  paymentMethod: 'UPI' | 'PhonePe / GPay' | 'NetBanking / Card';
  transactionId?: string;
  paymentScreenshot?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingDate?: string;
  expectedDeliveryDate?: string;
  
  adminNote?: string;
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountAmount: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: string;
  status: 'active' | 'inactive';
  usageCount: number;
}

export interface SiteSettings {
  websiteName: string;
  tagline: string;
  logoUrl: string;
  upiId: string;
  upiMerchantName: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  standardDeliveryCharge: number;
  expressDeliveryCharge: number;
  freeShippingThreshold: number;
  announcementBanner: string;
  bannerEnabled: boolean;
  maxUploadSizeMB: number;
  aboutUsText: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // empty means admin
  title: string;
  message: string;
  type: 'order' | 'payment' | 'info' | 'alert';
  orderId?: string;
  read: boolean;
  createdAt: string;
}

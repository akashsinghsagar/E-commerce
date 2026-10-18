/* ============================================================
   LADDI — Core Type Definitions
   ============================================================ */

// ── Product Types ────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  fabric: string;
  careInstructions: string;
  categoryId: string;
  categoryName: string;
  collectionIds: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  subcategory?: string;
  fit?: string;
  occasion?: string;
  isBestseller?: boolean;
}

// ── Category & Collection Types ──────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  position: number;
  isActive: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
}

// ── Cart Types ───────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

// ── Wishlist Types ───────────────────────────────────────────

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  slug: string;
  addedAt: string;
}

// ── Order Types ──────────────────────────────────────────────

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'rto';

export type PaymentStatus = 
  | 'pending'
  | 'cod_pending'
  | 'cod_collected'
  | 'cod_settled'
  | 'paid'
  | 'refunded'
  | 'failed';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'cod';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Shipment Types ───────────────────────────────────────────

export type ShipmentStatus = 
  | 'created'
  | 'booked'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'rto_initiated'
  | 'rto_delivered'
  | 'cancelled';

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  isManual: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierName: string;
  awbNumber?: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
}

// ── Vendor Types ─────────────────────────────────────────────

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

// ── Purchase Order Types ─────────────────────────────────────

export type PurchaseOrderStatus = 
  | 'draft'
  | 'ordered'
  | 'confirmed_by_vendor'
  | 'dispatched'
  | 'in_transit'
  | 'partially_received'
  | 'received'
  | 'delayed'
  | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  orderedQuantity: number;
  receivedQuantity: number;
  damagedQuantity: number;
  costPerUnit: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedArrival?: string;
  trackingNumber?: string;
  totalCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Inventory Movement Types ─────────────────────────────────

export type InventoryMovementType = 
  | 'purchase_received'
  | 'order_placed'
  | 'order_cancelled'
  | 'return_received'
  | 'manual_adjustment'
  | 'damaged';

export interface InventoryMovement {
  id: string;
  variantId: string;
  type: InventoryMovementType;
  quantity: number;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

// ── COD Settlement Types ─────────────────────────────────────

export type SettlementStatus = 
  | 'pending'
  | 'collected'
  | 'in_transit'
  | 'settled'
  | 'disputed';

export interface CodSettlement {
  id: string;
  orderId: string;
  orderNumber: string;
  expectedAmount: number;
  collectedAmount?: number;
  deductions?: number;
  settledAmount?: number;
  settlementReference?: string;
  settlementDate?: string;
  status: SettlementStatus;
  courierName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── User & Auth Types ────────────────────────────────────────

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  addresses: DeliveryAddress[];
  createdAt: string;
}

// ── Contact & Newsletter ─────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

// ── Filter & Sort Types ──────────────────────────────────────

export interface ProductFilters {
  category?: string;
  collection?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'name';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

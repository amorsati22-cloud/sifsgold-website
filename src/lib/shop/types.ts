export type ProductImage = {
  url: string;
  alt_text: string;
  primary?: boolean;
};

export type ProductVariantOption = {
  name: string;
  options: string[];
};

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type CartLine = {
  id?: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  product?: ProductRow;
  variant?: ProductVariantRow;
};

export type ProductRow = {
  id: string;
  storefront_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: string | null;
  brand: string | null;
  sku: string;
  weight_oz: number | null;
  pro_only: boolean;
  pro_only_categories: string[] | null;
  price: number;
  compare_at_price: number | null;
  inventory_count: number;
  track_inventory: boolean;
  backorder_allowed: boolean;
  images: ProductImage[];
  variants: ProductVariantOption[];
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
  average_rating: number | null;
  total_reviews: number;
  active: boolean;
  ingredients: string | null;
  usage_instructions: string | null;
  warnings: string | null;
  storefront?: StorefrontRow;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string | null;
  sku: string | null;
  price_override: number | null;
  inventory_count: number;
  image_url: string | null;
  attributes: Record<string, string>;
};

export type StorefrontRow = {
  id: string;
  store_name: string;
  store_slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  verified: boolean;
  return_policy: string | null;
  shipping_policy: string | null;
  store_active: boolean;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type OrderRow = {
  id: string;
  order_number: string;
  buyer_id: string | null;
  buyer_email: string;
  buyer_name: string;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  subtotal: number | null;
  shipping_cost: number | null;
  tax: number | null;
  discount: number | null;
  total: number;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
};

export type ShippingRateOption = {
  id: string;
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  estimated_days: number | null;
  storefront_id?: string;
};

export type ReturnReason =
  | "wrong_item"
  | "damaged"
  | "changed_mind"
  | "didnt_work"
  | "allergic_reaction";

-- Beauty Supply Store marketplace schema for Sif's Gold
-- Run in Supabase SQL editor after public.profiles exists.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- product_categories (reference)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_categories (
  id text PRIMARY KEY,
  parent_category text REFERENCES public.product_categories(id),
  label text NOT NULL,
  icon text,
  display_order integer DEFAULT 0
);

INSERT INTO public.product_categories (id, parent_category, label, icon, display_order) VALUES
  ('hair_color', NULL, 'Hair Color', 'palette', 10),
  ('hair_tools', NULL, 'Hair Tools', 'scissors', 20),
  ('skincare', NULL, 'Skincare', 'sparkles', 30),
  ('nail_supplies', NULL, 'Nail Supplies', 'hand', 40),
  ('salon_furniture', NULL, 'Salon Furniture', 'armchair', 50),
  ('barber_supplies', NULL, 'Barber Supplies', 'razor', 60),
  ('lash_brow', NULL, 'Lash & Brow', 'eye', 70),
  ('medspa', NULL, 'Med Spa', 'syringe', 80),
  ('retail', NULL, 'Retail & Merch', 'shopping-bag', 90)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- storefronts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.storefronts (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  store_slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  verified boolean DEFAULT false,
  verified_at timestamptz,
  verification_documents jsonb DEFAULT '[]'::jsonb,
  payout_method text DEFAULT 'stripe_express'
    CHECK (payout_method IN ('stripe_express', 'manual')),
  stripe_connect_account_id text,
  default_shipping_origin_zip text,
  return_policy text,
  shipping_policy text,
  customer_service_email text,
  store_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT storefronts_slug_format CHECK (
    store_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

CREATE INDEX IF NOT EXISTS storefronts_slug_idx ON public.storefronts (store_slug);
CREATE INDEX IF NOT EXISTS storefronts_active_idx ON public.storefronts (store_active)
  WHERE store_active = true;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storefront_id uuid NOT NULL REFERENCES public.storefronts(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  category text REFERENCES public.product_categories(id),
  brand text,
  sku text NOT NULL,
  upc text,
  weight_oz decimal(8,2),
  dimensions jsonb,
  ingredients text,
  usage_instructions text,
  warnings text,
  pro_only boolean DEFAULT false,
  pro_only_categories text[] DEFAULT '{}',
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  cost decimal(10,2),
  inventory_count integer DEFAULT 0,
  inventory_low_threshold integer DEFAULT 5,
  track_inventory boolean DEFAULT true,
  backorder_allowed boolean DEFAULT false,
  images jsonb DEFAULT '[]'::jsonb,
  variants jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  bestseller boolean DEFAULT false,
  new_arrival boolean DEFAULT false,
  promoted boolean DEFAULT false,
  promoted_until timestamptz,
  tags text[] DEFAULT '{}',
  search_keywords text[] DEFAULT '{}',
  average_rating decimal(3,2),
  total_reviews integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_storefront_idx ON public.products (storefront_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category);
CREATE INDEX IF NOT EXISTS products_active_idx ON public.products (active) WHERE active = true;
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING gin (search_keywords);

-- ---------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text,
  sku text,
  price_override decimal(10,2),
  inventory_count integer DEFAULT 0,
  image_url text,
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_variants_product_idx ON public.product_variants (product_id);

-- ---------------------------------------------------------------------------
-- inventory_reservations (5-minute checkout holds)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS inventory_reservations_expires_idx
  ON public.inventory_reservations (expires_at);

-- ---------------------------------------------------------------------------
-- cart_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  added_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS cart_items_user_idx ON public.cart_items (user_id);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  buyer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_email text NOT NULL,
  buyer_name text NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  status text DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment', 'paid', 'processing', 'shipped', 'delivered',
      'cancelled', 'refunded', 'partially_refunded'
    )),
  subtotal decimal(10,2),
  shipping_cost decimal(10,2),
  tax decimal(10,2),
  discount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  stripe_payment_intent_id text,
  stripe_charge_id text,
  shipping_method text,
  tracking_number text,
  tracking_url text,
  carrier text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  buyer_notes text,
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_buyer_idx ON public.orders (buyer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_number_idx ON public.orders (order_number);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  storefront_id uuid REFERENCES public.storefronts(id) ON DELETE SET NULL,
  product_name_snapshot text NOT NULL,
  variant_name_snapshot text,
  sku_snapshot text,
  unit_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total decimal(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_storefront_idx ON public.order_items (storefront_id);

-- ---------------------------------------------------------------------------
-- product_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  verified_purchase boolean DEFAULT true,
  helpful_count integer DEFAULT 0,
  response_from_brand text,
  responded_at timestamptz,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (product_id, buyer_id, order_id)
);

CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON public.product_reviews (product_id)
  WHERE approved = true;

-- ---------------------------------------------------------------------------
-- product_question_answers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_question_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  asked_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  question text NOT NULL,
  answered_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  answer text,
  created_at timestamptz DEFAULT now(),
  answered_at timestamptz
);

-- ---------------------------------------------------------------------------
-- wishlist
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id, variant_id)
);

-- ---------------------------------------------------------------------------
-- returns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  reason text NOT NULL
    CHECK (reason IN ('wrong_item', 'damaged', 'changed_mind', 'didnt_work', 'allergic_reaction')),
  reason_details text,
  status text DEFAULT 'requested'
    CHECK (status IN ('requested', 'approved', 'shipped_back', 'received', 'refunded', 'denied')),
  refund_amount decimal(10,2),
  return_shipping_label_url text,
  requested_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  received_at timestamptz,
  refunded_at timestamptz,
  stripe_refund_id text
);

CREATE INDEX IF NOT EXISTS returns_order_idx ON public.returns (order_id);

-- ---------------------------------------------------------------------------
-- shipping_zones
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storefront_id uuid NOT NULL REFERENCES public.storefronts(id) ON DELETE CASCADE,
  name text NOT NULL,
  country_codes text[] DEFAULT '{US}',
  state_codes text[],
  min_weight decimal(8,2),
  max_weight decimal(8,2),
  flat_rate decimal(10,2),
  free_shipping_threshold decimal(10,2)
);

-- ---------------------------------------------------------------------------
-- order number sequence helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  yr text := to_char(now(), 'YYYY');
  seq bigint;
BEGIN
  SELECT COALESCE(MAX(
    NULLIF(regexp_replace(order_number, '^SG-' || yr || '-', ''), '')::bigint
  ), 0) + 1
  INTO seq
  FROM public.orders
  WHERE order_number LIKE 'SG-' || yr || '-%';

  RETURN 'SG-' || yr || '-' || lpad(seq::text, 6, '0');
END;
$$;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS storefronts_updated_at ON public.storefronts;
CREATE TRIGGER storefronts_updated_at
  BEFORE UPDATE ON public.storefronts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.storefronts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_reservations ENABLE ROW LEVEL SECURITY;

-- storefronts
DROP POLICY IF EXISTS "Public read active storefronts" ON public.storefronts;
CREATE POLICY "Public read active storefronts" ON public.storefronts
  FOR SELECT USING (store_active = true);

DROP POLICY IF EXISTS "Storefront owners manage own" ON public.storefronts;
CREATE POLICY "Storefront owners manage own" ON public.storefronts
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- products: public read active; pro-only gated in app layer + policy for licensed pros
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (
    active = true
    AND (
      pro_only = false
      OR EXISTS (
        SELECT 1 FROM public.pro_profiles pp
        WHERE pp.id = auth.uid() AND pp.license_verified = true
      )
    )
  );

DROP POLICY IF EXISTS "Storefronts manage own products" ON public.products;
CREATE POLICY "Storefronts manage own products" ON public.products
  FOR ALL USING (storefront_id = auth.uid()) WITH CHECK (storefront_id = auth.uid());

-- product_variants
DROP POLICY IF EXISTS "Public read variants of visible products" ON public.product_variants;
CREATE POLICY "Public read variants of visible products" ON public.product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.active = true
    )
  );

DROP POLICY IF EXISTS "Storefronts manage own variants" ON public.product_variants;
CREATE POLICY "Storefronts manage own variants" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.storefront_id = auth.uid()
    )
  );

-- cart_items
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
CREATE POLICY "Users manage own cart" ON public.cart_items
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- orders
DROP POLICY IF EXISTS "Buyers read own orders" ON public.orders;
CREATE POLICY "Buyers read own orders" ON public.orders
  FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Buyers insert own orders" ON public.orders;
CREATE POLICY "Buyers insert own orders" ON public.orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- order_items
DROP POLICY IF EXISTS "Buyers read own order items" ON public.order_items;
CREATE POLICY "Buyers read own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Storefronts read their order items" ON public.order_items;
CREATE POLICY "Storefronts read their order items" ON public.order_items
  FOR SELECT USING (storefront_id = auth.uid());

-- product_reviews
DROP POLICY IF EXISTS "Public read approved reviews" ON public.product_reviews;
CREATE POLICY "Public read approved reviews" ON public.product_reviews
  FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Buyers create reviews on their orders" ON public.product_reviews;
CREATE POLICY "Buyers create reviews on their orders" ON public.product_reviews
  FOR INSERT WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid() AND o.status = 'delivered'
    )
  );

DROP POLICY IF EXISTS "Brands respond to reviews" ON public.product_reviews;
CREATE POLICY "Brands respond to reviews" ON public.product_reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.storefront_id = auth.uid()
    )
  );

-- wishlist
DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist;
CREATE POLICY "Users manage own wishlist" ON public.wishlist
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- returns
DROP POLICY IF EXISTS "Buyers manage own returns" ON public.returns;
CREATE POLICY "Buyers manage own returns" ON public.returns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Buyers request returns" ON public.returns;
CREATE POLICY "Buyers request returns" ON public.returns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Storefronts manage returns on their items" ON public.returns;
CREATE POLICY "Storefronts manage returns on their items" ON public.returns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.order_items oi
      WHERE oi.id = order_item_id AND oi.storefront_id = auth.uid()
    )
  );

-- shipping_zones
DROP POLICY IF EXISTS "Public read shipping zones" ON public.shipping_zones;
CREATE POLICY "Public read shipping zones" ON public.shipping_zones
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Storefronts manage shipping zones" ON public.shipping_zones;
CREATE POLICY "Storefronts manage shipping zones" ON public.shipping_zones
  FOR ALL USING (storefront_id = auth.uid()) WITH CHECK (storefront_id = auth.uid());

-- inventory_reservations
DROP POLICY IF EXISTS "Users manage own reservations" ON public.inventory_reservations;
CREATE POLICY "Users manage own reservations" ON public.inventory_reservations
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- product Q&A
DROP POLICY IF EXISTS "Public read answered questions" ON public.product_question_answers;
CREATE POLICY "Public read answered questions" ON public.product_question_answers
  FOR SELECT USING (answer IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users ask questions" ON public.product_question_answers;
CREATE POLICY "Authenticated users ask questions" ON public.product_question_answers
  FOR INSERT WITH CHECK (asked_by = auth.uid());

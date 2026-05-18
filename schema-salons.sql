-- Multi-pro salon / studio dashboard (Wave 4 — salon ops)
-- Run after: profiles, pro_profiles, services, appointments, pricing.tiers

-- ---------------------------------------------------------------------------
-- salons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  legal_name text,
  encrypted_ein text,
  ein_iv text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  zip text,
  country text DEFAULT 'US',
  phone text,
  website_url text,
  instagram_handle text,
  description text,
  logo_url text,
  cover_image_url text,
  timezone text DEFAULT 'America/Chicago',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  subscription_tier text REFERENCES pricing.tiers(id),
  slug text UNIQUE,
  cancellation_policy text,
  no_show_policy text,
  deposit_policy text,
  default_deposit_percent decimal(5,2) DEFAULT 0,
  is_public boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS salons_owner_idx ON public.salons (owner_id);
CREATE INDEX IF NOT EXISTS salons_slug_idx ON public.salons (slug) WHERE slug IS NOT NULL;

-- ---------------------------------------------------------------------------
-- salon_staff
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'pro' CHECK (role IN ('owner', 'manager', 'pro', 'apprentice')),
  commission_split decimal(5,2),
  booth_rent_amount decimal(10,2),
  booth_rent_frequency text CHECK (booth_rent_frequency IS NULL OR booth_rent_frequency IN ('weekly', 'monthly')),
  start_date date,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated', 'invited')),
  can_set_own_prices boolean DEFAULT false,
  can_take_own_bookings boolean DEFAULT true,
  calendar_color text,
  stripe_connect_account_id text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (salon_id, pro_id)
);

CREATE INDEX IF NOT EXISTS salon_staff_salon_idx ON public.salon_staff (salon_id, status);
CREATE INDEX IF NOT EXISTS salon_staff_pro_idx ON public.salon_staff (pro_id);

-- ---------------------------------------------------------------------------
-- salon_staff_invites
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'pro' CHECK (role IN ('manager', 'pro', 'apprentice')),
  commission_split decimal(5,2),
  invited_by uuid NOT NULL REFERENCES public.profiles(id),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- salon_services (salon-wide menu)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  price_amount decimal(10,2) NOT NULL,
  price_type text DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'starting_at', 'custom_quote')),
  price_high decimal(10,2),
  deposit_amount decimal(10,2) DEFAULT 0,
  bookable_online boolean DEFAULT true,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_services_salon_idx ON public.salon_services (salon_id, active);

-- Per-pro overrides
CREATE TABLE IF NOT EXISTS public.salon_staff_service_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.salon_staff(id) ON DELETE CASCADE,
  salon_service_id uuid NOT NULL REFERENCES public.salon_services(id) ON DELETE CASCADE,
  price_amount decimal(10,2),
  duration_minutes integer,
  active boolean DEFAULT true,
  UNIQUE (staff_id, salon_service_id)
);

-- ---------------------------------------------------------------------------
-- salon_inventory
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  brand text,
  sku text,
  unit text NOT NULL DEFAULT 'count' CHECK (unit IN ('oz', 'count', 'ml', 'g', 'lb')),
  quantity_on_hand decimal(10,2) NOT NULL DEFAULT 0,
  reorder_point decimal(10,2) DEFAULT 0,
  cost_per_unit decimal(10,2),
  retail_price decimal(10,2),
  supplier text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_inventory_salon_idx ON public.salon_inventory (salon_id);

CREATE TABLE IF NOT EXISTS public.salon_inventory_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid NOT NULL REFERENCES public.salon_inventory(id) ON DELETE CASCADE,
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES public.salon_staff(id) ON DELETE SET NULL,
  quantity_used decimal(10,2) NOT NULL,
  note text,
  used_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- salon_payouts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.salon_staff(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  gross_revenue decimal(10,2) NOT NULL,
  commission_split decimal(5,2),
  booth_rent_deduction decimal(10,2) DEFAULT 0,
  other_deductions decimal(10,2) DEFAULT 0,
  net_owed decimal(10,2) NOT NULL,
  stripe_transfer_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS salon_payouts_salon_idx ON public.salon_payouts (salon_id, created_at DESC);

-- Link appointments to salon for master calendar
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS salon_id uuid REFERENCES public.salons(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS appointments_salon_idx ON public.appointments (salon_id, scheduled_start)
  WHERE salon_id IS NOT NULL;

-- Stripe Connect on pro_profiles (staff payouts)
ALTER TABLE public.pro_profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_salon_owner(p_salon_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salons s WHERE s.id = p_salon_id AND s.owner_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_salon_manager(p_salon_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salon_staff ss
    WHERE ss.salon_id = p_salon_id
      AND ss.pro_id = p_user_id
      AND ss.status = 'active'
      AND ss.role IN ('owner', 'manager')
  ) OR public.is_salon_owner(p_salon_id, p_user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_salon_member(p_salon_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_salon_owner(p_salon_id, p_user_id)
    OR EXISTS (
      SELECT 1 FROM public.salon_staff ss
      WHERE ss.salon_id = p_salon_id
        AND ss.pro_id = p_user_id
        AND ss.status IN ('active', 'on_leave')
    );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_staff_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_staff_service_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_inventory_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public salons readable" ON public.salons;
CREATE POLICY "Public salons readable" ON public.salons
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Owners manage salons" ON public.salons;
CREATE POLICY "Owners manage salons" ON public.salons
  FOR ALL USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Salon staff visible to members" ON public.salon_staff;
CREATE POLICY "Salon staff visible to members" ON public.salon_staff
  FOR SELECT USING (public.is_salon_member(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Salon owners manage staff" ON public.salon_staff;
CREATE POLICY "Salon owners manage staff" ON public.salon_staff
  FOR ALL USING (public.is_salon_manager(salon_id, auth.uid()))
  WITH CHECK (public.is_salon_manager(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Salon services public read" ON public.salon_services;
CREATE POLICY "Salon services public read" ON public.salon_services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND s.is_public = true)
  );

DROP POLICY IF EXISTS "Salon managers manage services" ON public.salon_services;
CREATE POLICY "Salon managers manage services" ON public.salon_services
  FOR ALL USING (public.is_salon_manager(salon_id, auth.uid()))
  WITH CHECK (public.is_salon_manager(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Salon inventory members read" ON public.salon_inventory;
CREATE POLICY "Salon inventory members read" ON public.salon_inventory
  FOR SELECT USING (public.is_salon_member(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Salon inventory managers write" ON public.salon_inventory;
CREATE POLICY "Salon inventory managers write" ON public.salon_inventory
  FOR ALL USING (public.is_salon_manager(salon_id, auth.uid()))
  WITH CHECK (public.is_salon_manager(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Salon payouts managers" ON public.salon_payouts;
CREATE POLICY "Salon payouts managers" ON public.salon_payouts
  FOR ALL USING (public.is_salon_manager(salon_id, auth.uid()))
  WITH CHECK (public.is_salon_manager(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Service role salons" ON public.salons;
CREATE POLICY "Service role salons" ON public.salons FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.salon_staff_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers manage invites" ON public.salon_staff_invites;
CREATE POLICY "Managers manage invites" ON public.salon_staff_invites
  FOR ALL USING (public.is_salon_manager(salon_id, auth.uid()))
  WITH CHECK (public.is_salon_manager(salon_id, auth.uid()));

DROP POLICY IF EXISTS "Invitee read by token" ON public.salon_staff_invites;
CREATE POLICY "Invitee read by token" ON public.salon_staff_invites
  FOR SELECT USING (true);

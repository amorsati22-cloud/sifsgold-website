-- Services menu (Wave 4 Prompt 19)
-- Run after pro_profiles exists. Migrates legacy services columns if present.

-- ---------------------------------------------------------------------------
-- service_categories (reference)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  parent_category text,
  icon text,
  display_order integer DEFAULT 0
);

INSERT INTO public.service_categories (id, label, parent_category, icon, display_order) VALUES
  ('hair', 'Hair', NULL, 'Scissors', 10),
  ('hair_color', 'Hair Color', 'hair', 'Palette', 11),
  ('hair_cut', 'Hair Cut', 'hair', 'Scissors', 12),
  ('hair_styling', 'Hair Styling', 'hair', 'Sparkles', 13),
  ('hair_extensions', 'Extensions', 'hair', 'Layers', 14),
  ('hair_treatments', 'Hair Treatments', 'hair', 'Droplets', 15),
  ('barbering', 'Barbering', NULL, 'User', 20),
  ('makeup', 'Makeup', NULL, 'Brush', 30),
  ('makeup_bridal', 'Bridal Makeup', 'makeup', 'Heart', 31),
  ('makeup_special_event', 'Special Event', 'makeup', 'Star', 32),
  ('nails', 'Nails', NULL, 'Hand', 40),
  ('nails_manicure', 'Manicure', 'nails', 'Hand', 41),
  ('nails_pedicure', 'Pedicure', 'nails', 'Footprints', 42),
  ('lashes', 'Lashes', NULL, 'Eye', 50),
  ('brows', 'Brows', NULL, 'ScanEye', 51),
  ('skincare', 'Skincare', NULL, 'Sun', 60),
  ('facials', 'Facials', 'skincare', 'Sparkle', 61),
  ('waxing', 'Waxing', NULL, 'Flame', 70),
  ('massage', 'Massage', NULL, 'HeartPulse', 80),
  ('fitness', 'Fitness', NULL, 'Dumbbell', 90),
  ('tattoo', 'Tattoo', NULL, 'PenTool', 100),
  ('piercing', 'Piercing', NULL, 'Gem', 110),
  ('med_spa', 'Med Spa', NULL, 'Syringe', 120),
  ('consultation', 'Consultation', NULL, 'MessageCircle', 5),
  ('other', 'Other', NULL, 'MoreHorizontal', 999)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  parent_category = EXCLUDED.parent_category,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ---------------------------------------------------------------------------
-- services — migrate from Prompt 18 stub if needed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL,
  name text NOT NULL,
  category text,
  description text,
  duration_minutes integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Legacy columns → new schema
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_amount decimal(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'fixed';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_high decimal(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS requires_consultation boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS consultation_required_for_first_visit boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS max_per_day integer;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS prerequisites text[] DEFAULT '{}';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS aftercare_instructions text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS cancellation_policy text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deposit_required boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deposit_amount decimal(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS visible boolean DEFAULT true;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS bookable_online boolean DEFAULT true;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Migrate price_cents → price_amount, active → visible
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'price_cents'
  ) THEN
    UPDATE public.services
    SET price_amount = COALESCE(price_amount, price_cents / 100.0)
    WHERE price_amount IS NULL AND price_cents IS NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'active'
  ) THEN
    UPDATE public.services
    SET visible = COALESCE(visible, active)
    WHERE active IS NOT NULL;
  END IF;
END $$;

ALTER TABLE public.services ALTER COLUMN duration_minutes SET NOT NULL;
ALTER TABLE public.services ALTER COLUMN price_amount SET NOT NULL;

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_price_type_check;
ALTER TABLE public.services ADD CONSTRAINT services_price_type_check
  CHECK (price_type IN ('fixed', 'starting_at', 'custom_quote'));

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_pro_id_fkey;
ALTER TABLE public.services
  ADD CONSTRAINT services_pro_id_fkey
  FOREIGN KEY (pro_id) REFERENCES public.pro_profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS services_pro_visible_idx ON public.services (pro_id, display_order)
  WHERE visible = true;

-- ---------------------------------------------------------------------------
-- service_addons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration_minutes integer,
  price_amount decimal(10,2) NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_addons_service_idx ON public.service_addons (service_id, display_order);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read service categories" ON public.service_categories;
CREATE POLICY "Public read service categories"
  ON public.service_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read visible services" ON public.services;
CREATE POLICY "Public read visible services"
  ON public.services FOR SELECT
  USING (
    visible = true
    AND EXISTS (
      SELECT 1 FROM public.pro_profiles p
      WHERE p.id = services.pro_id
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros read own services" ON public.services;
CREATE POLICY "Pros read own services"
  ON public.services FOR SELECT
  USING (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Pros manage own services" ON public.services;
CREATE POLICY "Pros manage own services"
  ON public.services FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Public read addons for visible services" ON public.service_addons;
CREATE POLICY "Public read addons for visible services"
  ON public.service_addons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.services s
      JOIN public.pro_profiles p ON p.id = s.pro_id
      WHERE s.id = service_addons.service_id
        AND s.visible = true
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros manage own addons" ON public.service_addons;
CREATE POLICY "Pros manage own addons"
  ON public.service_addons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_addons.service_id AND s.pro_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_addons.service_id AND s.pro_id = auth.uid())
  );

-- Pro public profiles, portfolio, credentials, and testimonials
-- Run in Supabase SQL editor after profiles + services tables exist.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- services (minimal stub if not already present from Wave 2)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  duration_minutes integer,
  price_cents integer,
  category text,
  active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- pro_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pro_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  headline text,
  bio text,
  location_city text,
  location_state text,
  location_country text DEFAULT 'US',
  specialties text[] DEFAULT '{}',
  license_state text,
  license_number text,
  license_verified boolean DEFAULT false,
  license_expiry date,
  years_experience integer,
  languages_spoken text[] DEFAULT '{}',
  avatar_url text,
  cover_image_url text,
  instagram_handle text,
  tiktok_handle text,
  pinterest_handle text,
  website_url text,
  book_status text DEFAULT 'fully_open'
    CHECK (book_status IN ('fully_open', 'request_only', 'closed', 'exclusive')),
  accepting_new_clients boolean DEFAULT true,
  visible_in_search boolean DEFAULT true,
  pronouns text,
  accessibility_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pro_profiles_username_format CHECK (
    username ~ '^[a-z][a-z0-9._]{1,28}[a-z0-9]$'
    AND username !~ '^[._]'
    AND username !~ '[._]$'
    AND username !~ '[._]{2,}'
  )
);

CREATE INDEX IF NOT EXISTS pro_profiles_username_idx ON public.pro_profiles (lower(username));
CREATE INDEX IF NOT EXISTS pro_profiles_visible_idx ON public.pro_profiles (visible_in_search)
  WHERE visible_in_search = true;

-- Link services.pro_id to pro_profiles when column exists without FK
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'services_pro_id_fkey'
  ) THEN
    ALTER TABLE public.services
      ADD CONSTRAINT services_pro_id_fkey
      FOREIGN KEY (pro_id) REFERENCES public.pro_profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- portfolio_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  image_url text NOT NULL,
  thumb_url text,
  caption text,
  alt_text text NOT NULL DEFAULT '',
  service_type uuid REFERENCES public.services(id) ON DELETE SET NULL,
  before_image_url text,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS portfolio_items_pro_id_idx ON public.portfolio_items (pro_id, display_order);

-- ---------------------------------------------------------------------------
-- credentials
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  type text NOT NULL
    CHECK (type IN ('license', 'certification', 'continuing_education', 'award')),
  name text NOT NULL,
  issuing_authority text,
  issue_date date,
  expiry_date date,
  credential_number text,
  verification_url text,
  verification_document_path text,
  public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credentials_pro_public_idx ON public.credentials (pro_id)
  WHERE public = true;

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_name text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  pro_reply text,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  approved_by_pro boolean DEFAULT false,
  featured boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS testimonials_pro_approved_idx ON public.testimonials (pro_id, created_at DESC)
  WHERE approved_by_pro = true;

-- ---------------------------------------------------------------------------
-- updated_at trigger
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

DROP TRIGGER IF EXISTS pro_profiles_updated_at ON public.pro_profiles;
CREATE TRIGGER pro_profiles_updated_at
  BEFORE UPDATE ON public.pro_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- pro_profiles
DROP POLICY IF EXISTS "Public read profiles marked visible" ON public.pro_profiles;
CREATE POLICY "Public read profiles marked visible"
  ON public.pro_profiles FOR SELECT
  USING (visible_in_search = true);

DROP POLICY IF EXISTS "Pros read own profile always" ON public.pro_profiles;
CREATE POLICY "Pros read own profile always"
  ON public.pro_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Pros update own profile" ON public.pro_profiles;
CREATE POLICY "Pros update own profile"
  ON public.pro_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Pros insert own profile" ON public.pro_profiles;
CREATE POLICY "Pros insert own profile"
  ON public.pro_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- portfolio_items
DROP POLICY IF EXISTS "Public read all portfolio items" ON public.portfolio_items;
CREATE POLICY "Public read all portfolio items"
  ON public.portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pro_profiles p
      WHERE p.id = portfolio_items.pro_id
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros manage own portfolio items" ON public.portfolio_items;
CREATE POLICY "Pros manage own portfolio items"
  ON public.portfolio_items FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- credentials
DROP POLICY IF EXISTS "Public read public credentials" ON public.credentials;
CREATE POLICY "Public read public credentials"
  ON public.credentials FOR SELECT
  USING (
    public = true
    AND EXISTS (
      SELECT 1 FROM public.pro_profiles p
      WHERE p.id = credentials.pro_id
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros read own credentials" ON public.credentials;
CREATE POLICY "Pros read own credentials"
  ON public.credentials FOR SELECT
  USING (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Pros manage own credentials" ON public.credentials;
CREATE POLICY "Pros manage own credentials"
  ON public.credentials FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- testimonials
DROP POLICY IF EXISTS "Public read approved testimonials" ON public.testimonials;
CREATE POLICY "Public read approved testimonials"
  ON public.testimonials FOR SELECT
  USING (
    approved_by_pro = true
    AND EXISTS (
      SELECT 1 FROM public.pro_profiles p
      WHERE p.id = testimonials.pro_id
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros read own testimonials" ON public.testimonials;
CREATE POLICY "Pros read own testimonials"
  ON public.testimonials FOR SELECT
  USING (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Clients insert testimonials" ON public.testimonials;
CREATE POLICY "Clients insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Pros approve their testimonials" ON public.testimonials;
CREATE POLICY "Pros approve their testimonials"
  ON public.testimonials FOR UPDATE
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- services (public read for visible pros)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services"
  ON public.services FOR SELECT
  USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM public.pro_profiles p
      WHERE p.id = services.pro_id
        AND (p.visible_in_search = true OR auth.uid() = p.id)
    )
  );

DROP POLICY IF EXISTS "Pros manage own services" ON public.services;
CREATE POLICY "Pros manage own services"
  ON public.services FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- ---------------------------------------------------------------------------
-- Storage buckets (run in dashboard or via API)
-- pro-avatars, pro-covers, portfolio-images, credential-documents (private)
-- ---------------------------------------------------------------------------

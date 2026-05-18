-- Client dashboard: favorites, vision boards, loyalty (Wave 4)
-- Run after public.profiles, pro_profiles, and appointments exist.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- client_favorites
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE (client_id, pro_id)
);

CREATE INDEX IF NOT EXISTS client_favorites_client_idx ON public.client_favorites (client_id);

-- ---------------------------------------------------------------------------
-- client_vision_history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_vision_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  title text,
  image_urls text[] DEFAULT '{}',
  notes text,
  attached_to_appointment uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  privacy text DEFAULT 'private' CHECK (privacy IN ('private', 'pro_only', 'attached_only'))
);

CREATE INDEX IF NOT EXISTS client_vision_client_idx ON public.client_vision_history (client_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- client_loyalty
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_loyalty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  total_appointments integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  last_visit date,
  preferred_services uuid[] DEFAULT '{}',
  notes text,
  UNIQUE (client_id, pro_id)
);

-- ---------------------------------------------------------------------------
-- client_pro_views (recently browsed pros — last 30 days)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_pro_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE (client_id, pro_id)
);

CREATE INDEX IF NOT EXISTS client_pro_views_client_idx ON public.client_pro_views (client_id, viewed_at DESC);

-- ---------------------------------------------------------------------------
-- client_settings (notifications + privacy)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_settings (
  client_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_reminders boolean DEFAULT true,
  sms_reminders boolean DEFAULT false,
  marketing_email boolean DEFAULT false,
  profile_visible boolean DEFAULT false,
  vision_boards_visible_to_pros boolean DEFAULT true,
  location_city text,
  location_state text,
  location_lat double precision,
  location_lng double precision,
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.client_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_vision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_pro_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_settings ENABLE ROW LEVEL SECURITY;

-- favorites
DROP POLICY IF EXISTS "Clients manage own favorites" ON public.client_favorites;
CREATE POLICY "Clients manage own favorites"
  ON public.client_favorites FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- vision
DROP POLICY IF EXISTS "Clients manage own vision" ON public.client_vision_history;
CREATE POLICY "Clients manage own vision"
  ON public.client_vision_history FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Pros read vision attached to their appointments" ON public.client_vision_history;
CREATE POLICY "Pros read vision attached to their appointments"
  ON public.client_vision_history FOR SELECT
  USING (
    attached_to_appointment IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = attached_to_appointment
        AND a.pro_id = auth.uid()
    )
  );

-- loyalty
DROP POLICY IF EXISTS "Clients read own loyalty" ON public.client_loyalty;
CREATE POLICY "Clients read own loyalty"
  ON public.client_loyalty FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "Pros read loyalty with their clients" ON public.client_loyalty;
CREATE POLICY "Pros read loyalty with their clients"
  ON public.client_loyalty FOR SELECT
  USING (pro_id = auth.uid());

-- pro views
DROP POLICY IF EXISTS "Clients manage own pro views" ON public.client_pro_views;
CREATE POLICY "Clients manage own pro views"
  ON public.client_pro_views FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- settings
DROP POLICY IF EXISTS "Clients manage own settings" ON public.client_settings;
CREATE POLICY "Clients manage own settings"
  ON public.client_settings FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- Sif's Gold — Daily affirmations + Beauty Body Map
-- Run after public.profiles exists.
-- Seeds: npx tsx scripts/gen-affirmations-sql.ts

CREATE TABLE IF NOT EXISTS public.daily_affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('self_worth', 'craft_pride', 'client_care', 'rest_recovery', 'abundance')
  ),
  target_audience text[] NOT NULL DEFAULT '{}',
  season text CHECK (season IN ('winter', 'spring', 'summer', 'fall')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS daily_affirmations_category_idx ON public.daily_affirmations (category);
CREATE INDEX IF NOT EXISTS daily_affirmations_active_idx ON public.daily_affirmations (active);

CREATE TABLE IF NOT EXISTS public.user_affirmation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  affirmation_id uuid NOT NULL REFERENCES public.daily_affirmations(id) ON DELETE CASCADE,
  shown_at timestamptz NOT NULL DEFAULT now(),
  saved boolean NOT NULL DEFAULT false,
  shared_to_platform text
);

CREATE INDEX IF NOT EXISTS user_affirmation_history_user_idx
  ON public.user_affirmation_history (user_id, shown_at DESC);

CREATE TABLE IF NOT EXISTS public.beauty_body_zones (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon_svg text
);

CREATE TABLE IF NOT EXISTS public.beauty_body_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id text NOT NULL REFERENCES public.beauty_body_zones(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  average_duration_minutes integer NOT NULL,
  average_price_range text NOT NULL,
  finding_pros_filter jsonb NOT NULL DEFAULT '{}',
  what_to_expect text,
  prep_tips text,
  aftercare text
);

CREATE INDEX IF NOT EXISTS beauty_body_services_zone_idx ON public.beauty_body_services (zone_id);

ALTER TABLE public.daily_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_affirmation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beauty_body_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beauty_body_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read affirmations" ON public.daily_affirmations;
CREATE POLICY "Public read affirmations"
  ON public.daily_affirmations FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Users manage affirmation history" ON public.user_affirmation_history;
CREATE POLICY "Users manage affirmation history"
  ON public.user_affirmation_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public read body zones" ON public.beauty_body_zones;
CREATE POLICY "Public read body zones"
  ON public.beauty_body_zones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read body services" ON public.beauty_body_services;
CREATE POLICY "Public read body services"
  ON public.beauty_body_services FOR SELECT USING (true);

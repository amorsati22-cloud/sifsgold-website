-- Sif's Gold Photo Studio — pro portfolio editing & consent-gated sharing
-- Run after public.profiles, public.portfolio_items exist.

-- ---------------------------------------------------------------------------
-- Appointments (minimal + photo consent — extend if table already exists)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  scheduled_at timestamptz,
  completed_at timestamptz,
  client_consent_for_photos boolean NOT NULL DEFAULT false,
  photo_consent_requested_at timestamptz,
  photo_consent_token text UNIQUE,
  photo_consent_granted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointments_pro_id_idx ON public.appointments (pro_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS appointments_client_id_idx ON public.appointments (client_id);
CREATE INDEX IF NOT EXISTS appointments_consent_token_idx ON public.appointments (photo_consent_token)
  WHERE photo_consent_token IS NOT NULL;

-- If appointments already exists, add consent columns:
DO $$
BEGIN
  ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_consent_for_photos boolean NOT NULL DEFAULT false;
  ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS photo_consent_requested_at timestamptz;
  ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS photo_consent_token text;
  ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS photo_consent_granted_at timestamptz;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- photo_studio_assets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.photo_studio_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text,
  type text NOT NULL DEFAULT 'single'
    CHECK (type IN ('before_after', 'single', 'social_post', 'gallery')),
  original_image_url text NOT NULL,
  edited_image_url text,
  before_image_url text,
  after_image_url text,
  watermark_applied boolean NOT NULL DEFAULT false,
  background_removed boolean NOT NULL DEFAULT false,
  linked_portfolio_item_id uuid REFERENCES public.portfolio_items(id) ON DELETE SET NULL,
  linked_appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  linked_client_consent boolean NOT NULL DEFAULT false,
  crop_data jsonb,
  edit_state jsonb,
  export_history jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS photo_studio_assets_user_idx
  ON public.photo_studio_assets (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- watermark_templates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.watermark_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  position text NOT NULL DEFAULT 'bottom_right'
    CHECK (position IN ('bottom_right', 'bottom_left', 'top_right', 'top_left', 'center')),
  opacity decimal(3,2) NOT NULL DEFAULT 0.85
    CHECK (opacity >= 0 AND opacity <= 1),
  text_content text NOT NULL DEFAULT 'Sif''s Gold',
  font_family text NOT NULL DEFAULT 'Montserrat',
  font_color text NOT NULL DEFAULT '#FFFFFF',
  background_blur boolean NOT NULL DEFAULT true,
  default_template boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS watermark_templates_user_idx
  ON public.watermark_templates (user_id);

-- ---------------------------------------------------------------------------
-- Storage bucket: photo-studio (private paths; public URLs via getPublicUrl if policy allows)
-- Create in Dashboard: Storage → New bucket → photo-studio (public read optional per path)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_studio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watermark_templates ENABLE ROW LEVEL SECURITY;

-- appointments: pro and client see own
DROP POLICY IF EXISTS "Pros manage own appointments" ON public.appointments;
CREATE POLICY "Pros manage own appointments"
  ON public.appointments FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Clients read own appointments" ON public.appointments;
CREATE POLICY "Clients read own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients update photo consent" ON public.appointments;
CREATE POLICY "Clients update photo consent"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- photo_studio_assets
DROP POLICY IF EXISTS "Users manage own photo studio assets" ON public.photo_studio_assets;
CREATE POLICY "Users manage own photo studio assets"
  ON public.photo_studio_assets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- watermark_templates
DROP POLICY IF EXISTS "Users manage own watermark templates" ON public.watermark_templates;
CREATE POLICY "Users manage own watermark templates"
  ON public.watermark_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage policies (run after bucket exists):
-- INSERT/UPDATE/SELECT/DELETE where (storage.foldername(name))[1] = auth.uid()::text

-- Pro operations dashboard (Wave 4 Prompt 22)
-- Run after pro_profiles, services, appointments, profiles exist.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- pro_earnings_snapshots
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pro_earnings_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  gross_revenue decimal(10,2) DEFAULT 0,
  platform_fees decimal(10,2) DEFAULT 0,
  net_revenue decimal(10,2) DEFAULT 0,
  appointment_count integer DEFAULT 0,
  avg_appointment_value decimal(10,2) DEFAULT 0,
  top_service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  new_clients integer DEFAULT 0,
  repeat_clients integer DEFAULT 0,
  UNIQUE (pro_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS pro_earnings_snapshots_pro_date_idx
  ON public.pro_earnings_snapshots (pro_id, snapshot_date DESC);

-- ---------------------------------------------------------------------------
-- pro_client_notes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pro_client_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_key text,
  formula_notes text,
  allergies text,
  preferences text,
  birthday date,
  last_visit date,
  next_visit date,
  referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  private_notes text,
  favorite boolean DEFAULT false,
  guest_name text,
  guest_email text,
  guest_phone text,
  UNIQUE (pro_id, client_id),
  CONSTRAINT pro_client_notes_identity CHECK (
    client_id IS NOT NULL OR guest_key IS NOT NULL
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS pro_client_notes_guest_key_idx
  ON public.pro_client_notes (pro_id, guest_key)
  WHERE guest_key IS NOT NULL;

-- ---------------------------------------------------------------------------
-- pro_business_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pro_business_settings (
  id uuid PRIMARY KEY REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  business_name text,
  tax_id_encrypted text,
  business_email text,
  business_phone text,
  business_address text,
  accepts_tips boolean DEFAULT true,
  default_tip_percentages integer[] DEFAULT ARRAY[15, 20, 25],
  requires_cancellation_policy_acceptance boolean DEFAULT true,
  auto_confirm_bookings boolean DEFAULT false,
  new_client_intake_required boolean DEFAULT true,
  intake_form_template_id uuid,
  default_deposit_percent integer DEFAULT 0,
  cancellation_policy text DEFAULT '24h_full_refund',
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- intake_form_templates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.intake_form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  fields jsonb DEFAULT '[]',
  service_category text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pro_business_settings
  DROP CONSTRAINT IF EXISTS pro_business_settings_intake_fkey;

ALTER TABLE public.pro_business_settings
  ADD CONSTRAINT pro_business_settings_intake_fkey
  FOREIGN KEY (intake_form_template_id) REFERENCES public.intake_form_templates(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.pro_earnings_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_form_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pros manage own earnings snapshots" ON public.pro_earnings_snapshots;
CREATE POLICY "Pros manage own earnings snapshots"
  ON public.pro_earnings_snapshots FOR ALL
  USING (pro_id = auth.uid())
  WITH CHECK (pro_id = auth.uid());

DROP POLICY IF EXISTS "Pros manage own client notes" ON public.pro_client_notes;
CREATE POLICY "Pros manage own client notes"
  ON public.pro_client_notes FOR ALL
  USING (pro_id = auth.uid())
  WITH CHECK (pro_id = auth.uid());

DROP POLICY IF EXISTS "Pros manage own business settings" ON public.pro_business_settings;
CREATE POLICY "Pros manage own business settings"
  ON public.pro_business_settings FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Pros manage own intake templates" ON public.intake_form_templates;
CREATE POLICY "Pros manage own intake templates"
  ON public.intake_form_templates FOR ALL
  USING (pro_id = auth.uid())
  WITH CHECK (pro_id = auth.uid());

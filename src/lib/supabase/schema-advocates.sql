-- Sif's Gold — Advocates program extensions (Wave 3 Prompt 16)
-- Run AFTER schema.sql (Prompt 11), schema-brand-deals-v2.sql, and schema-admin.sql.
-- Maps application tables: brand_deals → brand_campaigns, brand_deal_applications → campaign_applications.

-- ---------------------------------------------------------------------------
-- Extend advocate_profiles (baseline from schema-brand-deals-v2.sql)
-- ---------------------------------------------------------------------------
ALTER TABLE public.advocate_profiles
  ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.advocate_applications(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'gold' CHECK (tier IN ('gold', 'platinum')),
  ADD COLUMN IF NOT EXISTS stripe_connect_onboarded boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS agreement_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS agreement_version text,
  ADD COLUMN IF NOT EXISTS specialty_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ftc_strike_dates timestamptz[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
  ADD COLUMN IF NOT EXISTS ftc_training_acknowledged_at timestamptz,
  ADD COLUMN IF NOT EXISTS sample_content_urls text[] DEFAULT '{}';

-- Sync specialty_tags from specialties if empty
UPDATE public.advocate_profiles
SET specialty_tags = specialties
WHERE specialty_tags = '{}' AND specialties IS NOT NULL AND array_length(specialties, 1) > 0;

-- ---------------------------------------------------------------------------
-- advocate_earnings — all revenue streams (brand deals also logged in campaign_payouts)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advocate_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (
    source_type IN ('brand_deal', 'subscription_referral', 'product_affiliate', 'booking_referral')
  ),
  source_id uuid,
  amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL DEFAULT 0,
  net_to_advocate decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'paid', 'refunded')
  ),
  stripe_transfer_id text,
  tax_year integer NOT NULL DEFAULT (extract(year from now()))::integer
);

CREATE INDEX IF NOT EXISTS advocate_earnings_advocate_idx ON public.advocate_earnings (advocate_id);
CREATE INDEX IF NOT EXISTS advocate_earnings_tax_year_idx ON public.advocate_earnings (advocate_id, tax_year);

-- ---------------------------------------------------------------------------
-- advocate_tax_documents — 1099-NEC at $2,000+ gross per IRS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advocate_tax_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  tax_year integer NOT NULL,
  form_type text NOT NULL CHECK (form_type IN ('1099-NEC', '1099-K')),
  total_amount decimal(10,2) NOT NULL,
  file_url text,
  generated_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  UNIQUE (advocate_id, tax_year, form_type)
);

-- ---------------------------------------------------------------------------
-- ftc_disclosures — per-post compliance tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ftc_disclosures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  brand_deal_id uuid REFERENCES public.brand_campaigns(id) ON DELETE SET NULL,
  platform text NOT NULL CHECK (
    platform IN ('instagram', 'tiktok', 'youtube', 'sifs_gold')
  ),
  post_url text,
  disclosure_text text NOT NULL,
  compliance_status text NOT NULL DEFAULT 'under_review' CHECK (
    compliance_status IN ('compliant', 'non_compliant', 'under_review')
  ),
  reviewed_at timestamptz,
  reviewer_email text
);

CREATE INDEX IF NOT EXISTS ftc_disclosures_advocate_idx ON public.ftc_disclosures (advocate_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.advocate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advocate_tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ftc_disclosures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Advocates read own earnings" ON public.advocate_earnings;
CREATE POLICY "Advocates read own earnings"
  ON public.advocate_earnings FOR SELECT
  USING (auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Service role all advocate_earnings" ON public.advocate_earnings;
CREATE POLICY "Service role all advocate_earnings"
  ON public.advocate_earnings FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Advocates read own tax documents" ON public.advocate_tax_documents;
CREATE POLICY "Advocates read own tax documents"
  ON public.advocate_tax_documents FOR SELECT
  USING (auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Service role all advocate_tax_documents" ON public.advocate_tax_documents;
CREATE POLICY "Service role all advocate_tax_documents"
  ON public.advocate_tax_documents FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Advocates manage own ftc disclosures" ON public.ftc_disclosures;
CREATE POLICY "Advocates manage own ftc disclosures"
  ON public.ftc_disclosures FOR ALL
  USING (auth.uid() = advocate_id)
  WITH CHECK (auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Service role all ftc_disclosures" ON public.ftc_disclosures;
CREATE POLICY "Service role all ftc_disclosures"
  ON public.ftc_disclosures FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

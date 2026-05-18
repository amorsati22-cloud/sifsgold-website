-- Brand Deal Marketplace v2 — campaigns, contracts, escrow, FTC compliance
-- Run after public.profiles exists.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- advocate_profiles (Wave 3 Prompt 16 baseline)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advocate_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  specialties text[] DEFAULT '{}',
  instagram_handle text,
  tiktok_handle text,
  follower_count integer DEFAULT 0,
  stripe_connect_account_id text,
  ftc_strike_count integer DEFAULT 0,
  marketplace_suspended boolean DEFAULT false,
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- brand_campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_partner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  objective text NOT NULL
    CHECK (objective IN ('awareness', 'product_launch', 'sales', 'ugc_generation')),
  campaign_type text NOT NULL
    CHECK (campaign_type IN (
      'sponsored_post', 'gifted_product', 'paid_review', 'tutorial',
      'tutorial_series', 'live_event', 'long_term_ambassador'
    )),
  total_budget decimal(10,2) NOT NULL,
  max_advocates integer NOT NULL,
  per_advocate_compensation decimal(10,2) NOT NULL,
  compensation_type text NOT NULL
    CHECK (compensation_type IN (
      'flat_fee', 'product_gift', 'flat_plus_product', 'commission_only', 'flat_plus_commission'
    )),
  product_value decimal(10,2),
  commission_percent decimal(5,2),
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  platforms_required text[] DEFAULT '{}',
  application_deadline date NOT NULL,
  delivery_deadline date NOT NULL,
  payment_terms text DEFAULT 'on_delivery'
    CHECK (payment_terms IN ('net_7', 'net_30', 'on_delivery')),
  target_advocate_specialties text[] DEFAULT '{}',
  target_advocate_min_followers integer,
  target_advocate_locations text[] DEFAULT '{}',
  ftc_disclosure_template text,
  exclusivity_clause text DEFAULT 'none'
    CHECK (exclusivity_clause IN ('none', 'category_30_day', 'category_60_day')),
  usage_rights text DEFAULT 'organic_only'
    CHECK (usage_rights IN ('organic_only', 'paid_amplification_allowed', 'full_rights')),
  status text DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'paused', 'closed', 'completed')),
  escrow_funded boolean DEFAULT false,
  escrow_amount decimal(10,2),
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_campaigns_brand_idx ON public.brand_campaigns (brand_partner_id);
CREATE INDEX IF NOT EXISTS brand_campaigns_status_idx ON public.brand_campaigns (status);

-- ---------------------------------------------------------------------------
-- campaign_contracts (before applications.contract_id FK)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.brand_campaigns(id) ON DELETE CASCADE,
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  application_id uuid,
  contract_terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  compensation_amount decimal(10,2) NOT NULL,
  compensation_type text NOT NULL,
  products_to_ship jsonb DEFAULT '[]'::jsonb,
  shipping_address jsonb,
  signed_by_brand boolean DEFAULT false,
  brand_signed_at timestamptz,
  brand_signed_ip inet,
  signed_by_advocate boolean DEFAULT false,
  advocate_signed_at timestamptz,
  advocate_signed_ip inet,
  contract_pdf_url text,
  status text DEFAULT 'pending_signatures'
    CHECK (status IN ('pending_signatures', 'active', 'completed', 'terminated', 'disputed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (campaign_id, advocate_id)
);

-- ---------------------------------------------------------------------------
-- campaign_applications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.brand_campaigns(id) ON DELETE CASCADE,
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  pitch text NOT NULL,
  portfolio_samples jsonb DEFAULT '[]'::jsonb,
  proposed_timeline text,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  review_notes text,
  contract_id uuid REFERENCES public.campaign_contracts(id) ON DELETE SET NULL,
  UNIQUE (campaign_id, advocate_id)
);

ALTER TABLE public.campaign_contracts
  DROP CONSTRAINT IF EXISTS campaign_contracts_application_id_fkey;

ALTER TABLE public.campaign_contracts
  ADD CONSTRAINT campaign_contracts_application_id_fkey
  FOREIGN KEY (application_id) REFERENCES public.campaign_applications(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- campaign_deliverables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.campaign_contracts(id) ON DELETE CASCADE,
  deliverable_type text NOT NULL,
  description text,
  due_date date,
  submitted_url text,
  submitted_at timestamptz,
  ftc_disclosure_text text,
  ftc_compliance_verified boolean DEFAULT false,
  brand_approved boolean DEFAULT false,
  brand_approved_at timestamptz,
  brand_revision_requested boolean DEFAULT false,
  revision_notes text,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'paid_out')),
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- campaign_payouts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.campaign_contracts(id) ON DELETE CASCADE,
  deliverable_id uuid REFERENCES public.campaign_deliverables(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  net_to_advocate decimal(10,2) NOT NULL,
  stripe_transfer_id text,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  triggered_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- campaign_disputes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.brand_campaigns(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES public.campaign_contracts(id) ON DELETE SET NULL,
  raised_by_type text NOT NULL CHECK (raised_by_type IN ('brand', 'advocate')),
  raised_by_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL
    CHECK (reason IN ('deliverable_not_met', 'late_delivery', 'misrepresented_audience', 'payment_dispute')),
  description text NOT NULL,
  evidence jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'open'
    CHECK (status IN ('open', 'under_review', 'resolved_for_brand', 'resolved_for_advocate', 'resolved_split')),
  admin_notes text,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- FTC strikes & annual earnings (1099-NEC at $2K+)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advocate_ftc_strikes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  deliverable_id uuid REFERENCES public.campaign_deliverables(id) ON DELETE SET NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.advocate_annual_earnings (
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  tax_year integer NOT NULL,
  gross_earnings decimal(12,2) DEFAULT 0,
  nec_generated boolean DEFAULT false,
  nec_generated_at timestamptz,
  PRIMARY KEY (advocate_id, tax_year)
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS brand_campaigns_updated_at ON public.brand_campaigns;
CREATE TRIGGER brand_campaigns_updated_at
  BEFORE UPDATE ON public.brand_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS campaign_contracts_updated_at ON public.campaign_contracts;
CREATE TRIGGER campaign_contracts_updated_at
  BEFORE UPDATE ON public.campaign_contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.advocate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advocate_ftc_strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advocate_annual_earnings ENABLE ROW LEVEL SECURITY;

-- advocate_profiles
DROP POLICY IF EXISTS "Public read advocate profiles" ON public.advocate_profiles;
CREATE POLICY "Public read advocate profiles" ON public.advocate_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Advocates manage own profile" ON public.advocate_profiles;
CREATE POLICY "Advocates manage own profile" ON public.advocate_profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- brand_campaigns
DROP POLICY IF EXISTS "Public read published campaigns" ON public.brand_campaigns;
CREATE POLICY "Public read published campaigns" ON public.brand_campaigns
  FOR SELECT USING (status = 'published' AND escrow_funded = true);

DROP POLICY IF EXISTS "Brands manage own campaigns" ON public.brand_campaigns;
CREATE POLICY "Brands manage own campaigns" ON public.brand_campaigns
  FOR ALL USING (brand_partner_id = auth.uid()) WITH CHECK (brand_partner_id = auth.uid());

-- applications
DROP POLICY IF EXISTS "Advocates manage own applications" ON public.campaign_applications;
CREATE POLICY "Advocates manage own applications" ON public.campaign_applications
  FOR ALL USING (advocate_id = auth.uid()) WITH CHECK (advocate_id = auth.uid());

DROP POLICY IF EXISTS "Brands read campaign applications" ON public.campaign_applications;
CREATE POLICY "Brands read campaign applications" ON public.campaign_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brand_campaigns c
      WHERE c.id = campaign_id AND c.brand_partner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Brands update application status" ON public.campaign_applications;
CREATE POLICY "Brands update application status" ON public.campaign_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.brand_campaigns c
      WHERE c.id = campaign_id AND c.brand_partner_id = auth.uid()
    )
  );

-- contracts
DROP POLICY IF EXISTS "Parties read own contracts" ON public.campaign_contracts;
CREATE POLICY "Parties read own contracts" ON public.campaign_contracts
  FOR SELECT USING (
    advocate_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.brand_campaigns c
      WHERE c.id = campaign_id AND c.brand_partner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Parties update own contract signatures" ON public.campaign_contracts;
CREATE POLICY "Parties update own contract signatures" ON public.campaign_contracts
  FOR UPDATE USING (
    advocate_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.brand_campaigns c
      WHERE c.id = campaign_id AND c.brand_partner_id = auth.uid()
    )
  );

-- deliverables
DROP POLICY IF EXISTS "Parties manage contract deliverables" ON public.campaign_deliverables;
CREATE POLICY "Parties manage contract deliverables" ON public.campaign_deliverables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.campaign_contracts cc
      WHERE cc.id = contract_id
        AND (
          cc.advocate_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.brand_campaigns c
            WHERE c.id = cc.campaign_id AND c.brand_partner_id = auth.uid()
          )
        )
    )
  );

-- payouts
DROP POLICY IF EXISTS "Parties read payouts" ON public.campaign_payouts;
CREATE POLICY "Parties read payouts" ON public.campaign_payouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaign_contracts cc
      WHERE cc.id = contract_id
        AND (
          cc.advocate_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.brand_campaigns c
            WHERE c.id = cc.campaign_id AND c.brand_partner_id = auth.uid()
          )
        )
    )
  );

-- disputes
DROP POLICY IF EXISTS "Parties manage disputes" ON public.campaign_disputes;
CREATE POLICY "Parties manage disputes" ON public.campaign_disputes
  FOR ALL USING (raised_by_id = auth.uid()) WITH CHECK (raised_by_id = auth.uid());

DROP POLICY IF EXISTS "Parties read related disputes" ON public.campaign_disputes;
CREATE POLICY "Parties read related disputes" ON public.campaign_disputes
  FOR SELECT USING (
    raised_by_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campaign_contracts cc
      JOIN public.brand_campaigns c ON c.id = cc.campaign_id
      WHERE cc.id = contract_id AND (cc.advocate_id = auth.uid() OR c.brand_partner_id = auth.uid())
    )
  );

-- strikes & earnings
DROP POLICY IF EXISTS "Advocates read own strikes" ON public.advocate_ftc_strikes;
CREATE POLICY "Advocates read own strikes" ON public.advocate_ftc_strikes
  FOR SELECT USING (advocate_id = auth.uid());

DROP POLICY IF EXISTS "Advocates read own earnings" ON public.advocate_annual_earnings;
CREATE POLICY "Advocates read own earnings" ON public.advocate_annual_earnings
  FOR SELECT USING (advocate_id = auth.uid());

-- Loyalty programs (pros, salons, brands) — points, tiers, referrals
-- Run after public.profiles, public.services, public.products, public.appointments exist.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday date;

-- ---------------------------------------------------------------------------
-- loyalty_programs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_type text NOT NULL CHECK (owner_type IN ('pro', 'salon', 'brand')),
  name text NOT NULL,
  description text,
  points_per_dollar decimal(5,2) DEFAULT 1.0,
  points_per_appointment integer DEFAULT 0,
  points_per_referral integer DEFAULT 100,
  enrollment_bonus integer DEFAULT 0,
  birthday_bonus integer DEFAULT 50,
  tiers jsonb NOT NULL DEFAULT '[
    {"name":"Bronze","threshold":0,"perks":["5%_discount"]},
    {"name":"Silver","threshold":500,"perks":["10%_discount","priority_booking"]},
    {"name":"Gold","threshold":1500,"perks":["15%_discount","birthday_bonus"]}
  ]'::jsonb,
  expiration_months integer,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS loyalty_programs_owner_unique ON public.loyalty_programs (owner_id);
CREATE INDEX IF NOT EXISTS loyalty_programs_owner_idx ON public.loyalty_programs (owner_id, active);

-- ---------------------------------------------------------------------------
-- loyalty_memberships
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.loyalty_programs(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  points_balance integer DEFAULT 0,
  lifetime_points_earned integer DEFAULT 0,
  current_tier text DEFAULT 'Bronze',
  next_tier_threshold integer,
  referral_code text UNIQUE NOT NULL,
  referred_by_member_id uuid REFERENCES public.loyalty_memberships(id) ON DELETE SET NULL,
  last_activity timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  UNIQUE (program_id, member_id)
);

CREATE INDEX IF NOT EXISTS loyalty_memberships_program_idx ON public.loyalty_memberships (program_id);
CREATE INDEX IF NOT EXISTS loyalty_memberships_member_idx ON public.loyalty_memberships (member_id);
CREATE INDEX IF NOT EXISTS loyalty_memberships_referral_idx ON public.loyalty_memberships (referral_code);

-- ---------------------------------------------------------------------------
-- loyalty_transactions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.loyalty_memberships(id) ON DELETE CASCADE,
  transaction_type text NOT NULL
    CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'adjust', 'bonus')),
  points_change integer NOT NULL,
  source text
    CHECK (source IN ('appointment', 'referral', 'birthday', 'enrollment', 'product_purchase', 'manual', 'redemption_refund')),
  source_id uuid,
  description text,
  balance_after integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS loyalty_transactions_membership_idx
  ON public.loyalty_transactions (membership_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- loyalty_rewards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.loyalty_programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  cost_points integer NOT NULL,
  reward_type text NOT NULL
    CHECK (reward_type IN ('service_discount', 'product_discount', 'free_service', 'free_product', 'experience')),
  discount_amount decimal(10,2),
  discount_percent decimal(5,2),
  linked_service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  linked_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  max_per_member integer,
  max_redemptions_total integer,
  redemptions_count integer DEFAULT 0,
  expires_at date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS loyalty_rewards_program_idx ON public.loyalty_rewards (program_id, active);

-- ---------------------------------------------------------------------------
-- loyalty_redemptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.loyalty_memberships(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES public.loyalty_rewards(id) ON DELETE CASCADE,
  redeemed_at timestamptz DEFAULT now(),
  used_at timestamptz,
  status text DEFAULT 'redeemed'
    CHECK (status IN ('redeemed', 'used', 'expired', 'refunded')),
  redemption_code text UNIQUE NOT NULL,
  points_used integer NOT NULL
);

CREATE INDEX IF NOT EXISTS loyalty_redemptions_membership_idx ON public.loyalty_redemptions (membership_id);

-- ---------------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_membership_id uuid NOT NULL REFERENCES public.loyalty_memberships(id) ON DELETE CASCADE,
  referred_email text NOT NULL,
  referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  status text DEFAULT 'sent'
    CHECK (status IN ('sent', 'signed_up', 'first_appointment_complete', 'rewarded')),
  first_appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  reward_paid_at timestamptz,
  referrer_points_awarded integer DEFAULT 0,
  referred_points_awarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON public.referrals (referrer_membership_id);
CREATE INDEX IF NOT EXISTS referrals_email_idx ON public.referrals (lower(referred_email));

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners manage loyalty programs" ON public.loyalty_programs;
CREATE POLICY "Owners manage loyalty programs"
  ON public.loyalty_programs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Public read active programs" ON public.loyalty_programs;
CREATE POLICY "Public read active programs"
  ON public.loyalty_programs FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Members read own memberships" ON public.loyalty_memberships;
CREATE POLICY "Members read own memberships"
  ON public.loyalty_memberships FOR SELECT
  USING (member_id = auth.uid());

DROP POLICY IF EXISTS "Owners read program memberships" ON public.loyalty_memberships;
CREATE POLICY "Owners read program memberships"
  ON public.loyalty_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_programs p
      WHERE p.id = program_id AND p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members enroll themselves" ON public.loyalty_memberships;
CREATE POLICY "Members enroll themselves"
  ON public.loyalty_memberships FOR INSERT
  WITH CHECK (member_id = auth.uid());

DROP POLICY IF EXISTS "Members read own transactions" ON public.loyalty_transactions;
CREATE POLICY "Members read own transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_memberships m
      WHERE m.id = membership_id AND m.member_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners read program transactions" ON public.loyalty_transactions;
CREATE POLICY "Owners read program transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_memberships m
      JOIN public.loyalty_programs p ON p.id = m.program_id
      WHERE m.id = membership_id AND p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public read active rewards" ON public.loyalty_rewards;
CREATE POLICY "Public read active rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Owners manage rewards" ON public.loyalty_rewards;
CREATE POLICY "Owners manage rewards"
  ON public.loyalty_rewards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_programs p
      WHERE p.id = program_id AND p.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.loyalty_programs p
      WHERE p.id = program_id AND p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members read own redemptions" ON public.loyalty_redemptions;
CREATE POLICY "Members read own redemptions"
  ON public.loyalty_redemptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_memberships m
      WHERE m.id = membership_id AND m.member_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Referrers read own referrals" ON public.referrals;
CREATE POLICY "Referrers read own referrals"
  ON public.referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_memberships m
      WHERE m.id = referrer_membership_id AND m.member_id = auth.uid()
    )
  );

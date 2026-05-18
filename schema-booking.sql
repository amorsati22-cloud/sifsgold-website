-- Booking: availability rules, overrides, appointments (Wave 4 Prompt 20)
-- Run after pro_profiles and services exist.

-- Pro timezone (defaults to America/Chicago if not set)
ALTER TABLE public.pro_profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/Chicago';
ALTER TABLE public.pro_profiles ADD COLUMN IF NOT EXISTS booking_buffer_minutes integer DEFAULT 15;

-- ---------------------------------------------------------------------------
-- availability_rules
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Chicago',
  active boolean DEFAULT true,
  effective_from date,
  effective_until date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS availability_rules_pro_idx ON public.availability_rules (pro_id, day_of_week);

-- ---------------------------------------------------------------------------
-- availability_overrides
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  override_date date NOT NULL,
  type text NOT NULL CHECK (type IN ('unavailable', 'custom_hours', 'vacation', 'holiday')),
  start_time time,
  end_time time,
  reason text,
  recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS availability_overrides_pro_date_idx
  ON public.availability_overrides (pro_id, override_date);

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  pro_id uuid NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  addon_ids uuid[] DEFAULT '{}',
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  timezone text NOT NULL,
  status text NOT NULL DEFAULT 'pending_confirmation'
    CHECK (status IN (
      'pending_confirmation', 'confirmed', 'in_progress', 'completed',
      'cancelled_by_client', 'cancelled_by_pro', 'no_show'
    )),
  price_total decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) DEFAULT 0,
  deposit_paid boolean DEFAULT false,
  deposit_stripe_payment_intent_id text,
  final_paid boolean DEFAULT false,
  final_stripe_payment_intent_id text,
  client_notes text,
  pro_notes text,
  guest_name text,
  guest_email text,
  guest_phone text,
  vision_attachments text[] DEFAULT '{}',
  created_via text DEFAULT 'web',
  reminder_sent boolean DEFAULT false,
  confirmation_sent boolean DEFAULT false,
  cancellation_reason text,
  cancelled_at timestamptz,
  completed_at timestamptz,
  reserved_until timestamptz,
  reservation_token uuid DEFAULT gen_random_uuid()
);

CREATE INDEX IF NOT EXISTS appointments_pro_start_idx ON public.appointments (pro_id, scheduled_start);
CREATE INDEX IF NOT EXISTS appointments_client_idx ON public.appointments (client_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments (pro_id, status);

-- Prevent overlapping confirmed/pending appointments per pro (excludes cancelled)
CREATE UNIQUE INDEX IF NOT EXISTS appointments_no_overlap_active
  ON public.appointments (pro_id, scheduled_start)
  WHERE status IN ('pending_confirmation', 'confirmed', 'in_progress');

-- ---------------------------------------------------------------------------
-- appointment_status_history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointment_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at timestamptz DEFAULT now(),
  note text
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;

-- availability_rules
DROP POLICY IF EXISTS "Public read availability rules" ON public.availability_rules;
CREATE POLICY "Public read availability rules"
  ON public.availability_rules FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Pros manage own availability rules" ON public.availability_rules;
CREATE POLICY "Pros manage own availability rules"
  ON public.availability_rules FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- availability_overrides
DROP POLICY IF EXISTS "Public read availability overrides" ON public.availability_overrides;
CREATE POLICY "Public read availability overrides"
  ON public.availability_overrides FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Pros manage own availability overrides" ON public.availability_overrides;
CREATE POLICY "Pros manage own availability overrides"
  ON public.availability_overrides FOR ALL
  USING (auth.uid() = pro_id)
  WITH CHECK (auth.uid() = pro_id);

-- appointments
DROP POLICY IF EXISTS "Pros read own appointments" ON public.appointments;
CREATE POLICY "Pros read own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = pro_id);

DROP POLICY IF EXISTS "Clients read own appointments" ON public.appointments;
CREATE POLICY "Clients read own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients update own pending appointments" ON public.appointments;
CREATE POLICY "Clients update own pending appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Inserts/updates for booking APIs use service role (admin client)

-- appointment_status_history
DROP POLICY IF EXISTS "Read history for own appointments" ON public.appointment_status_history;
CREATE POLICY "Read history for own appointments"
  ON public.appointment_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_status_history.appointment_id
        AND (a.pro_id = auth.uid() OR a.client_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Realtime (enable in Supabase dashboard: appointments, availability_rules)
-- ---------------------------------------------------------------------------

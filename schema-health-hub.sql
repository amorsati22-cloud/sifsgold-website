-- Sif's Gold Health Hub — wellness tracking (not medical records)
-- Run in Supabase SQL editor after public.profiles exists.
-- Requires: pgcrypto, profiles table

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Encryption helpers (SECURITY DEFINER for decrypt on read via RPC)
-- Store HEALTH_HUB_ENCRYPTION_KEY in Supabase Vault / project secrets.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.encrypt_health_text(plain text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key text;
BEGIN
  IF plain IS NULL OR btrim(plain) = '' THEN
    RETURN NULL;
  END IF;
  key := current_setting('app.health_hub_encryption_key', true);
  IF key IS NULL OR key = '' THEN
    RAISE EXCEPTION 'health_hub_encryption_key is not configured';
  END IF;
  RETURN encode(
    pgp_sym_encrypt(plain, key, 'compress-algo=1, cipher-algo=aes256'),
  'base64');
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_health_text(cipher text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key text;
BEGIN
  IF cipher IS NULL OR btrim(cipher) = '' THEN
    RETURN NULL;
  END IF;
  key := current_setting('app.health_hub_encryption_key', true);
  IF key IS NULL OR key = '' THEN
    RAISE EXCEPTION 'health_hub_encryption_key is not configured';
  END IF;
  RETURN pgp_sym_decrypt(decode(cipher, 'base64'), key);
END;
$$;

REVOKE ALL ON FUNCTION public.encrypt_health_text(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decrypt_health_text(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.encrypt_health_text(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrypt_health_text(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- health_hub_settings (id = user profile id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_hub_settings (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  daily_pulse_enabled boolean NOT NULL DEFAULT false,
  cycle_sync_enabled boolean NOT NULL DEFAULT false,
  medication_tracker_enabled boolean NOT NULL DEFAULT false,
  hydration_tracker_enabled boolean NOT NULL DEFAULT false,
  preshift_ritual_enabled boolean NOT NULL DEFAULT false,
  hydration_goal_oz decimal(5,1) NOT NULL DEFAULT 64
    CHECK (hydration_goal_oz >= 32 AND hydration_goal_oz <= 100),
  reauthenticate_after_minutes integer NOT NULL DEFAULT 5
    CHECK (reauthenticate_after_minutes IN (1, 5, 15, 60)),
  data_retention_days integer NOT NULL DEFAULT 365
    CHECK (data_retention_days >= 30 AND data_retention_days <= 3650),
  export_format text NOT NULL DEFAULT 'csv'
    CHECK (export_format IN ('csv', 'json')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- daily_pulse_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_pulse_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at timestamptz NOT NULL DEFAULT now(),
  energy_level integer NOT NULL CHECK (energy_level BETWEEN 1 AND 10),
  mood_label text NOT NULL CHECK (mood_label IN ('great', 'good', 'okay', 'low', 'rough')),
  sleep_hours decimal(3,1) CHECK (sleep_hours IS NULL OR (sleep_hours >= 0 AND sleep_hours <= 24)),
  sleep_quality integer CHECK (sleep_quality IS NULL OR (sleep_quality BETWEEN 1 AND 10)),
  stress_level integer CHECK (stress_level IS NULL OR (stress_level BETWEEN 1 AND 10)),
  physical_feeling text[] DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS daily_pulse_logs_user_logged_idx
  ON public.daily_pulse_logs (user_id, logged_at DESC);

-- ---------------------------------------------------------------------------
-- cycle_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cycle_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  flow_intensity text CHECK (flow_intensity IN ('spotting', 'light', 'medium', 'heavy', 'none')),
  symptoms text[] DEFAULT '{}',
  cycle_day integer CHECK (cycle_day IS NULL OR cycle_day > 0),
  phase text CHECK (phase IN ('menstrual', 'follicular', 'ovulatory', 'luteal')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS cycle_logs_user_date_idx
  ON public.cycle_logs (user_id, log_date DESC);

-- ---------------------------------------------------------------------------
-- medication_entries & medication_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medication_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  dosage text,
  frequency text CHECK (frequency IN ('daily', 'twice_daily', 'as_needed', 'weekly')),
  start_date date,
  end_date date,
  prescribed_by text,
  purpose_category text CHECK (purpose_category IN (
    'allergies', 'birth_control', 'mental_health', 'pain', 'other'
  )),
  reminders_enabled boolean NOT NULL DEFAULT false,
  reminder_times time[] DEFAULT '{}',
  notes text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS medication_entries_user_idx
  ON public.medication_entries (user_id) WHERE active = true;

CREATE TABLE IF NOT EXISTS public.medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES public.medication_entries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  taken_at timestamptz NOT NULL DEFAULT now(),
  skipped boolean NOT NULL DEFAULT false,
  skip_reason text
);

CREATE INDEX IF NOT EXISTS medication_logs_med_taken_idx
  ON public.medication_logs (medication_id, taken_at DESC);

-- ---------------------------------------------------------------------------
-- hydration_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hydration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at timestamptz NOT NULL DEFAULT now(),
  amount_oz decimal(5,1) NOT NULL CHECK (amount_oz > 0 AND amount_oz <= 128),
  beverage_type text NOT NULL DEFAULT 'water'
    CHECK (beverage_type IN ('water', 'tea', 'coffee', 'electrolytes', 'other'))
);

CREATE INDEX IF NOT EXISTS hydration_logs_user_logged_idx
  ON public.hydration_logs (user_id, logged_at DESC);

-- ---------------------------------------------------------------------------
-- preshift_ritual_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.preshift_ritual_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  steps_completed text[] DEFAULT '{}',
  mood_before integer CHECK (mood_before IS NULL OR (mood_before BETWEEN 1 AND 10)),
  mood_after integer CHECK (mood_after IS NULL OR (mood_after BETWEEN 1 AND 10)),
  intention text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS preshift_ritual_sessions_user_started_idx
  ON public.preshift_ritual_sessions (user_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- RLS — users own data; service_role explicitly denied
-- ---------------------------------------------------------------------------
ALTER TABLE public.health_hub_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_pulse_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preshift_ritual_sessions ENABLE ROW LEVEL SECURITY;

-- health_hub_settings (id = auth user)
DROP POLICY IF EXISTS "Users access only own health settings" ON public.health_hub_settings;
CREATE POLICY "Users access only own health settings"
  ON public.health_hub_settings FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role never reads health settings" ON public.health_hub_settings;
CREATE POLICY "Service role never reads health settings"
  ON public.health_hub_settings FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- daily_pulse_logs
DROP POLICY IF EXISTS "Users access only own daily pulse" ON public.daily_pulse_logs;
CREATE POLICY "Users access only own daily pulse"
  ON public.daily_pulse_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads daily pulse" ON public.daily_pulse_logs;
CREATE POLICY "Service role never reads daily pulse"
  ON public.daily_pulse_logs FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- cycle_logs
DROP POLICY IF EXISTS "Users access only own cycle logs" ON public.cycle_logs;
CREATE POLICY "Users access only own cycle logs"
  ON public.cycle_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads cycle logs" ON public.cycle_logs;
CREATE POLICY "Service role never reads cycle logs"
  ON public.cycle_logs FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- medication_entries
DROP POLICY IF EXISTS "Users access only own medications" ON public.medication_entries;
CREATE POLICY "Users access only own medications"
  ON public.medication_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads medications" ON public.medication_entries;
CREATE POLICY "Service role never reads medications"
  ON public.medication_entries FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- medication_logs
DROP POLICY IF EXISTS "Users access only own medication logs" ON public.medication_logs;
CREATE POLICY "Users access only own medication logs"
  ON public.medication_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads medication logs" ON public.medication_logs;
CREATE POLICY "Service role never reads medication logs"
  ON public.medication_logs FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- hydration_logs
DROP POLICY IF EXISTS "Users access only own hydration" ON public.hydration_logs;
CREATE POLICY "Users access only own hydration"
  ON public.hydration_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads hydration" ON public.hydration_logs;
CREATE POLICY "Service role never reads hydration"
  ON public.hydration_logs FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- preshift_ritual_sessions
DROP POLICY IF EXISTS "Users access only own ritual sessions" ON public.preshift_ritual_sessions;
CREATE POLICY "Users access only own ritual sessions"
  ON public.preshift_ritual_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role never reads ritual sessions" ON public.preshift_ritual_sessions;
CREATE POLICY "Service role never reads ritual sessions"
  ON public.preshift_ritual_sessions FOR ALL
  TO service_role
  USING (false)
  WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- Configure encryption key (run once per environment):
-- ALTER DATABASE postgres SET app.health_hub_encryption_key = 'your-32+-char-secret';
-- Or set via Supabase Dashboard → Database → Settings → custom GUC
-- ---------------------------------------------------------------------------

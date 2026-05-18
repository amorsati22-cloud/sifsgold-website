-- Video calls (Daily.co) — Wave feature
-- Run after public.profiles, public.appointments, public.brand_campaigns exist.
-- beauty_challenges FK omitted until that table ships; linked_class_id is reserved.

-- ---------------------------------------------------------------------------
-- services: virtual consultation delivery
-- ---------------------------------------------------------------------------
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'in_person';
ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_service_type_check;
ALTER TABLE public.services ADD CONSTRAINT services_service_type_check
  CHECK (service_type IN ('in_person', 'virtual_consultation', 'hybrid'));

-- ---------------------------------------------------------------------------
-- appointments: link to video session
-- ---------------------------------------------------------------------------
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS video_call_session_id uuid;

-- ---------------------------------------------------------------------------
-- video_call_settings (one row per pro profile)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_settings (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_calls_enabled boolean DEFAULT false,
  requires_500_paid_subscribers_check boolean DEFAULT true,
  consultation_rate_per_minute decimal(10,2),
  recording_allowed boolean DEFAULT false,
  recording_default_consent text DEFAULT 'opt_in'
    CHECK (recording_default_consent IN ('opt_in', 'opt_out', 'disabled')),
  default_call_duration_minutes integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- video_call_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  room_url text UNIQUE,
  daily_room_id text,
  session_type text NOT NULL DEFAULT 'consultation'
    CHECK (session_type IN ('consultation', 'class', 'brand_meeting', 'support')),
  host_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  linked_appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  linked_brand_deal_id uuid REFERENCES public.brand_campaigns(id) ON DELETE SET NULL,
  linked_class_id uuid,
  max_participants integer DEFAULT 4,
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  status text DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'ended', 'cancelled', 'no_show')),
  recording_enabled boolean DEFAULT false,
  recording_url text,
  recording_consent_required boolean DEFAULT true,
  total_participants integer DEFAULT 0,
  timezone text DEFAULT 'America/Chicago',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS video_call_sessions_host_idx ON public.video_call_sessions (host_id, scheduled_start);
CREATE INDEX IF NOT EXISTS video_call_sessions_appointment_idx ON public.video_call_sessions (linked_appointment_id);
CREATE INDEX IF NOT EXISTS video_call_sessions_status_idx ON public.video_call_sessions (status, scheduled_start);

-- ---------------------------------------------------------------------------
-- video_call_participants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.video_call_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_email text,
  joined_at timestamptz,
  left_at timestamptz,
  duration_seconds integer,
  role text DEFAULT 'participant'
    CHECK (role IN ('host', 'co_host', 'participant', 'observer')),
  recording_consent boolean DEFAULT false,
  recording_consent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS video_call_participants_session_idx ON public.video_call_participants (session_id);

-- ---------------------------------------------------------------------------
-- video_call_recordings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.video_call_sessions(id) ON DELETE CASCADE,
  recording_url text NOT NULL,
  storage_path text,
  duration_seconds integer,
  file_size_bytes bigint,
  status text DEFAULT 'processing'
    CHECK (status IN ('processing', 'ready', 'failed', 'deleted')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS video_call_recordings_session_idx ON public.video_call_recordings (session_id);
CREATE INDEX IF NOT EXISTS video_call_recordings_expires_idx ON public.video_call_recordings (expires_at)
  WHERE status = 'ready';

-- ---------------------------------------------------------------------------
-- video_call_chat_messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.video_call_sessions(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  message text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  to_recipient_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS video_call_chat_session_idx ON public.video_call_chat_messages (session_id, sent_at);

-- ---------------------------------------------------------------------------
-- Cost tracking ($0.004/participant-minute)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_cost_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.video_call_sessions(id) ON DELETE SET NULL,
  participant_id uuid REFERENCES public.video_call_participants(id) ON DELETE SET NULL,
  participant_minutes decimal(12,4) NOT NULL,
  cost_usd decimal(10,4) NOT NULL,
  logged_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Milestone notify list
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_call_milestone_notify (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- FK appointments → session (after sessions table exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_video_call_session_id_fkey'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_video_call_session_id_fkey
      FOREIGN KEY (video_call_session_id) REFERENCES public.video_call_sessions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.video_call_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_cost_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_milestone_notify ENABLE ROW LEVEL SECURITY;

-- video_call_settings: owner only
DROP POLICY IF EXISTS "Users manage own video call settings" ON public.video_call_settings;
CREATE POLICY "Users manage own video call settings"
  ON public.video_call_settings FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- sessions: host + participants read; host write
DROP POLICY IF EXISTS "Host manages video sessions" ON public.video_call_sessions;
CREATE POLICY "Host manages video sessions"
  ON public.video_call_sessions FOR ALL
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Participants read video sessions" ON public.video_call_sessions;
CREATE POLICY "Participants read video sessions"
  ON public.video_call_sessions FOR SELECT
  USING (
    auth.uid() = host_id
    OR EXISTS (
      SELECT 1 FROM public.video_call_participants p
      WHERE p.session_id = id AND p.user_id = auth.uid()
    )
  );

-- participants
DROP POLICY IF EXISTS "Session members read participants" ON public.video_call_participants;
CREATE POLICY "Session members read participants"
  ON public.video_call_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id
        AND (s.host_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.video_call_participants p2
          WHERE p2.session_id = s.id AND p2.user_id = auth.uid()
        ))
    )
  );

DROP POLICY IF EXISTS "Host manages participants" ON public.video_call_participants;
CREATE POLICY "Host manages participants"
  ON public.video_call_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users update own participant row" ON public.video_call_participants;
CREATE POLICY "Users update own participant row"
  ON public.video_call_participants FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- recordings: host + session participants
DROP POLICY IF EXISTS "Session members read recordings" ON public.video_call_recordings;
CREATE POLICY "Session members read recordings"
  ON public.video_call_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id
        AND (s.host_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.video_call_participants p
          WHERE p.session_id = s.id AND p.user_id = auth.uid()
        ))
    )
  );

-- chat
DROP POLICY IF EXISTS "Session members read chat" ON public.video_call_chat_messages;
CREATE POLICY "Session members read chat"
  ON public.video_call_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id
        AND (s.host_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.video_call_participants p
          WHERE p.session_id = s.id AND p.user_id = auth.uid()
        ))
    )
  );

DROP POLICY IF EXISTS "Session members send chat" ON public.video_call_chat_messages;
CREATE POLICY "Session members send chat"
  ON public.video_call_chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.video_call_sessions s
      WHERE s.id = session_id
        AND (s.host_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.video_call_participants p
          WHERE p.session_id = s.id AND p.user_id = auth.uid()
        ))
    )
  );

-- milestone notify
DROP POLICY IF EXISTS "Users manage milestone notify" ON public.video_call_milestone_notify;
CREATE POLICY "Users manage milestone notify"
  ON public.video_call_milestone_notify FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- service_role used by API routes (create room, webhooks, cron) — do not revoke

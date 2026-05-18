-- Pass-a-Note messaging v2 — groups, voice, files, polls, scheduled messages
-- Run after schema-messaging.sql

-- ---------------------------------------------------------------------------
-- threads extensions
-- ---------------------------------------------------------------------------
ALTER TABLE public.threads
  ADD COLUMN IF NOT EXISTS max_participants integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS created_by_role text
    CHECK (created_by_role IS NULL OR created_by_role IN ('pro', 'salon', 'school', 'admin')),
  ADD COLUMN IF NOT EXISTS group_purpose text
    CHECK (group_purpose IS NULL OR group_purpose IN ('team', 'class', 'event_planning', 'client_consult_group')),
  ADD COLUMN IF NOT EXISTS group_key_version integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS group_settings jsonb DEFAULT '{"who_can_add":"admins","who_can_post":"all"}'::jsonb;

-- Ensure group thread_type supported (already in v1 CHECK)
COMMENT ON COLUMN public.threads.thread_type IS 'dm | group | appointment';

-- ---------------------------------------------------------------------------
-- messages extensions
-- ---------------------------------------------------------------------------
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS message_type text DEFAULT 'text'
    CHECK (message_type IN ('text', 'voice_note', 'file', 'poll', 'system')),
  ADD COLUMN IF NOT EXISTS voice_note_duration_seconds integer,
  ADD COLUMN IF NOT EXISTS voice_note_waveform jsonb,
  ADD COLUMN IF NOT EXISTS file_metadata jsonb,
  ADD COLUMN IF NOT EXISTS poll_data jsonb,
  ADD COLUMN IF NOT EXISTS scheduled_for timestamptz,
  ADD COLUMN IF NOT EXISTS delivered boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS messages_scheduled_idx
  ON public.messages (scheduled_for)
  WHERE scheduled_for IS NOT NULL AND delivered = false;

-- ---------------------------------------------------------------------------
-- poll_responses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.poll_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selected_options text[] NOT NULL DEFAULT '{}',
  voted_at timestamptz DEFAULT now(),
  UNIQUE (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS poll_responses_message_idx ON public.poll_responses (message_id);

-- ---------------------------------------------------------------------------
-- thread_pinned_messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.thread_pinned_messages (
  thread_id uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  pinned_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pinned_at timestamptz DEFAULT now(),
  PRIMARY KEY (thread_id, message_id)
);

-- ---------------------------------------------------------------------------
-- thread_announcements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.thread_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS thread_announcements_thread_idx ON public.thread_announcements (thread_id);

-- ---------------------------------------------------------------------------
-- RLS for new tables
-- ---------------------------------------------------------------------------
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_pinned_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants vote on polls" ON public.poll_responses;
CREATE POLICY "Participants vote on polls"
  ON public.poll_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.thread_participants tp ON tp.thread_id = m.thread_id
      WHERE m.id = message_id AND tp.user_id = auth.uid()
    )
  )
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Participants manage pins" ON public.thread_pinned_messages;
CREATE POLICY "Participants manage pins"
  ON public.thread_pinned_messages FOR ALL
  USING (public.is_thread_participant(thread_id, auth.uid()))
  WITH CHECK (public.is_thread_participant(thread_id, auth.uid()));

DROP POLICY IF EXISTS "Participants read announcements" ON public.thread_announcements;
CREATE POLICY "Participants read announcements"
  ON public.thread_announcements FOR SELECT
  USING (public.is_thread_participant(thread_id, auth.uid()));

DROP POLICY IF EXISTS "Admins create announcements" ON public.thread_announcements;
CREATE POLICY "Admins create announcements"
  ON public.thread_announcements FOR INSERT
  WITH CHECK (
    public.is_thread_participant(thread_id, auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.thread_participants
      WHERE thread_id = thread_announcements.thread_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Storage bucket: message-voice (private) — path {thread_id}/{user_id}/{id}.enc
-- Storage bucket: message-files (private) — same pattern
-- Policies: (storage.foldername(name))[1] = thread_id AND participant check via JWT

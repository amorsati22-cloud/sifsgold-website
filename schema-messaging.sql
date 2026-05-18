-- Pass a Note messaging (Wave 4 Prompt 23)
-- Run after profiles and appointments exist.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- threads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz,
  thread_type text NOT NULL CHECK (thread_type IN ('dm', 'group', 'appointment')),
  linked_appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  title text,
  avatar_url text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  encrypted_last_preview text,
  preview_iv text
);

CREATE INDEX IF NOT EXISTS threads_last_message_idx ON public.threads (last_message_at DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- thread_participants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.thread_participants (
  thread_id uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  muted boolean DEFAULT false,
  last_read_at timestamptz,
  bubble_style text DEFAULT 'gold',
  PRIMARY KEY (thread_id, user_id)
);

CREATE INDEX IF NOT EXISTS thread_participants_user_idx ON public.thread_participants (user_id);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  encrypted_body text NOT NULL,
  iv text NOT NULL,
  encrypted_attachments text,
  attachments_iv text,
  reply_to_message_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  edited boolean DEFAULT false,
  edited_at timestamptz,
  deleted boolean DEFAULT false,
  delivered_to uuid[] DEFAULT '{}',
  read_by uuid[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS messages_thread_created_idx ON public.messages (thread_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- message_reactions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_reactions (
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);

-- ---------------------------------------------------------------------------
-- blocked_users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_users (
  blocker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_at timestamptz DEFAULT now(),
  reason text,
  PRIMARY KEY (blocker_id, blocked_id)
);

-- ---------------------------------------------------------------------------
-- message_reports (moderation)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  reported_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;

-- Helper: user is participant
CREATE OR REPLACE FUNCTION public.is_thread_participant(tid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.thread_participants
    WHERE thread_id = tid AND user_id = uid
  );
$$;

-- threads
DROP POLICY IF EXISTS "Participants read threads" ON public.threads;
CREATE POLICY "Participants read threads"
  ON public.threads FOR SELECT
  USING (public.is_thread_participant(id, auth.uid()));

DROP POLICY IF EXISTS "Authenticated create threads" ON public.threads;
CREATE POLICY "Authenticated create threads"
  ON public.threads FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

DROP POLICY IF EXISTS "Participants update threads" ON public.threads;
CREATE POLICY "Participants update threads"
  ON public.threads FOR UPDATE
  USING (public.is_thread_participant(id, auth.uid()));

-- thread_participants
DROP POLICY IF EXISTS "Participants read membership" ON public.thread_participants;
CREATE POLICY "Participants read membership"
  ON public.thread_participants FOR SELECT
  USING (public.is_thread_participant(thread_id, auth.uid()));

DROP POLICY IF EXISTS "Users join or admins add" ON public.thread_participants;
CREATE POLICY "Users join or admins add"
  ON public.thread_participants FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.thread_participants tp
        WHERE tp.thread_id = thread_participants.thread_id
          AND tp.user_id = auth.uid()
          AND tp.role = 'admin'
      )
      OR EXISTS (
        SELECT 1 FROM public.threads t
        WHERE t.id = thread_participants.thread_id AND t.created_by = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users update own participant row" ON public.thread_participants;
CREATE POLICY "Users update own participant row"
  ON public.thread_participants FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users leave thread" ON public.thread_participants;
CREATE POLICY "Users leave thread"
  ON public.thread_participants FOR DELETE
  USING (user_id = auth.uid());

-- messages
DROP POLICY IF EXISTS "Participants read messages" ON public.messages;
CREATE POLICY "Participants read messages"
  ON public.messages FOR SELECT
  USING (public.is_thread_participant(thread_id, auth.uid()));

DROP POLICY IF EXISTS "Participants send messages" ON public.messages;
CREATE POLICY "Participants send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_thread_participant(thread_id, auth.uid())
  );

DROP POLICY IF EXISTS "Sender edits own messages" ON public.messages;
CREATE POLICY "Sender edits own messages"
  ON public.messages FOR UPDATE
  USING (sender_id = auth.uid() AND public.is_thread_participant(thread_id, auth.uid()));

-- reactions
DROP POLICY IF EXISTS "Participants manage reactions" ON public.message_reactions;
CREATE POLICY "Participants manage reactions"
  ON public.message_reactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_reactions.message_id
        AND public.is_thread_participant(m.thread_id, auth.uid())
    )
  );

-- blocked_users
DROP POLICY IF EXISTS "Users manage own blocks" ON public.blocked_users;
CREATE POLICY "Users manage own blocks"
  ON public.blocked_users FOR ALL
  USING (blocker_id = auth.uid())
  WITH CHECK (blocker_id = auth.uid());

-- reports
DROP POLICY IF EXISTS "Users create reports" ON public.message_reports;
CREATE POLICY "Users create reports"
  ON public.message_reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users read own reports" ON public.message_reports;
CREATE POLICY "Users read own reports"
  ON public.message_reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threads;

-- Unified notifications (in-app, web push, email digest)
-- Run after public.profiles exists.

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN (
    'booking', 'message', 'payment', 'marketing', 'system', 'loyalty', 'brand_deal', 'review'
  )),
  type text NOT NULL,
  title text NOT NULL,
  body text,
  icon_url text,
  action_url text,
  read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications (user_id, read)
  WHERE read = false;

CREATE INDEX IF NOT EXISTS notifications_user_category_idx
  ON public.notifications (user_id, category, created_at DESC);

-- ---------------------------------------------------------------------------
-- notification_preferences (1:1 with profiles)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  push_enabled boolean NOT NULL DEFAULT false,
  email_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT false,
  categories jsonb NOT NULL DEFAULT '{
    "booking": {"in_app": true, "push": true, "email": true},
    "message": {"in_app": true, "push": true, "email": true},
    "payment": {"in_app": true, "push": true, "email": true},
    "marketing": {"in_app": true, "push": false, "email": false},
    "system": {"in_app": true, "push": true, "email": true},
    "loyalty": {"in_app": true, "push": true, "email": true},
    "brand_deal": {"in_app": true, "push": true, "email": true},
    "review": {"in_app": true, "push": true, "email": true}
  }'::jsonb,
  quiet_hours_start time,
  quiet_hours_end time,
  digest_frequency text NOT NULL DEFAULT 'daily'
    CHECK (digest_frequency IN ('never', 'daily', 'weekly')),
  digest_last_sent_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- push_subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh_key text NOT NULL,
  auth_key text NOT NULL,
  user_agent text,
  last_used_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_active_idx
  ON public.push_subscriptions (user_id)
  WHERE active = true;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY notifications_delete_own ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY notification_preferences_select_own ON public.notification_preferences
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY notification_preferences_insert_own ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY notification_preferences_update_own ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY push_subscriptions_select_own ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY push_subscriptions_insert_own ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY push_subscriptions_update_own ON public.push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY push_subscriptions_delete_own ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Service role bypasses RLS for dispatch/cron.

-- Realtime (enable in Supabase dashboard if not auto):
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

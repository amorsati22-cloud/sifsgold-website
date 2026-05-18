-- Live streaming (Daily.co + Stripe tips)
-- Run after public.profiles exists.

-- Streamer Stripe Connect (pros / schools / brands use profile id)
ALTER TABLE public.pro_profiles ADD COLUMN IF NOT EXISTS stripe_connect_account_id text;
ALTER TABLE public.pro_profiles ADD COLUMN IF NOT EXISTS stripe_connect_onboarded boolean DEFAULT false;

-- ---------------------------------------------------------------------------
-- live_streams
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'tutorial'
    CHECK (category IN ('tutorial', 'product_launch', 'q_and_a', 'class', 'event')),
  tags text[] DEFAULT '{}',
  scheduled_start timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  status text DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  duration_minutes integer,
  max_viewers_concurrent integer DEFAULT 0,
  total_unique_viewers integer DEFAULT 0,
  total_tips_received decimal(10,2) DEFAULT 0,
  recording_url text,
  recording_available boolean DEFAULT true,
  accepts_tips boolean DEFAULT true,
  minimum_tip decimal(10,2) DEFAULT 1.00,
  visibility text DEFAULT 'public'
    CHECK (visibility IN ('public', 'followers_only', 'paid_subscribers', 'private')),
  access_code text,
  broadcasting_url text,
  daily_room_name text,
  rtmp_url text,
  hls_playback_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS live_streams_streamer_idx ON public.live_streams (streamer_id, scheduled_start);
CREATE INDEX IF NOT EXISTS live_streams_status_idx ON public.live_streams (status, scheduled_start);
CREATE INDEX IF NOT EXISTS live_streams_category_idx ON public.live_streams (category) WHERE status IN ('live', 'scheduled');

-- ---------------------------------------------------------------------------
-- stream_viewers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stream_viewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  watch_duration_seconds integer,
  UNIQUE (stream_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS stream_viewers_stream_idx ON public.stream_viewers (stream_id);

-- ---------------------------------------------------------------------------
-- stream_comments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stream_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  posted_at timestamptz DEFAULT now(),
  moderated boolean DEFAULT false,
  pinned boolean DEFAULT false,
  highlighted boolean DEFAULT false,
  reactions jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS stream_comments_stream_idx ON public.stream_comments (stream_id, posted_at DESC);

-- ---------------------------------------------------------------------------
-- stream_tips
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stream_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  tipper_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  streamer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  message text,
  stripe_payment_intent_id text UNIQUE,
  platform_fee decimal(10,2) NOT NULL DEFAULT 0,
  net_to_streamer decimal(10,2) NOT NULL DEFAULT 0,
  payout_status text DEFAULT 'pending'
    CHECK (payout_status IN ('pending', 'completed', 'failed')),
  stripe_transfer_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stream_tips_stream_idx ON public.stream_tips (stream_id, created_at DESC);
CREATE INDEX IF NOT EXISTS stream_tips_streamer_idx ON public.stream_tips (streamer_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_tips ENABLE ROW LEVEL SECURITY;

-- Public read for public live/ended streams
DROP POLICY IF EXISTS "Public read public streams" ON public.live_streams;
CREATE POLICY "Public read public streams"
  ON public.live_streams FOR SELECT
  USING (visibility = 'public' OR auth.uid() = streamer_id);

DROP POLICY IF EXISTS "Streamers manage own streams" ON public.live_streams;
CREATE POLICY "Streamers manage own streams"
  ON public.live_streams FOR ALL
  USING (auth.uid() = streamer_id)
  WITH CHECK (auth.uid() = streamer_id);

DROP POLICY IF EXISTS "Anyone read non-moderated comments on public streams" ON public.stream_comments;
CREATE POLICY "Anyone read non-moderated comments on public streams"
  ON public.stream_comments FOR SELECT
  USING (
    moderated = false
    AND EXISTS (
      SELECT 1 FROM public.live_streams s
      WHERE s.id = stream_id AND (s.visibility = 'public' OR s.streamer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated users post comments" ON public.stream_comments;
CREATE POLICY "Authenticated users post comments"
  ON public.stream_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.live_streams s
      WHERE s.id = stream_id AND s.status = 'live'
    )
  );

DROP POLICY IF EXISTS "Streamers moderate comments" ON public.stream_comments;
CREATE POLICY "Streamers moderate comments"
  ON public.stream_comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.live_streams s
      WHERE s.id = stream_id AND s.streamer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Viewers manage own viewer row" ON public.stream_viewers;
CREATE POLICY "Viewers manage own viewer row"
  ON public.stream_viewers FOR ALL
  USING (viewer_id = auth.uid())
  WITH CHECK (viewer_id = auth.uid());

DROP POLICY IF EXISTS "Public read stream tips aggregates" ON public.stream_tips;
CREATE POLICY "Public read stream tips aggregates"
  ON public.stream_tips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.live_streams s
      WHERE s.id = stream_id AND (s.visibility = 'public' OR s.streamer_id = auth.uid())
    )
  );

-- Enable realtime for comments (run in Supabase dashboard if needed):
-- alter publication supabase_realtime add table stream_comments;

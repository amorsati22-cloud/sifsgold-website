-- Beauty Challenges + Advocate content feed
-- Run after profiles, advocate_profiles, brand_campaigns exist.

CREATE TABLE IF NOT EXISTS public.beauty_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL CHECK (
    challenge_type IN ('self_care', 'skill_building', 'creative', 'community')
  ),
  duration_days integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  cover_image_url text,
  prize text,
  sponsor_brand_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ftc_disclosure_required boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  participant_count integer NOT NULL DEFAULT 0,
  daily_prompts jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.beauty_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  days_completed integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  public boolean NOT NULL DEFAULT true,
  UNIQUE (challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.challenge_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.beauty_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  check_in_date date NOT NULL DEFAULT CURRENT_DATE,
  photo_url text,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved boolean NOT NULL DEFAULT false,
  UNIQUE (challenge_id, user_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.advocate_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  post_type text NOT NULL CHECK (
    post_type IN ('tip', 'tutorial', 'before_after', 'brand_partner')
  ),
  title text NOT NULL,
  body text NOT NULL,
  image_urls text[] NOT NULL DEFAULT '{}',
  video_url text,
  linked_brand_deal_id uuid REFERENCES public.brand_campaigns(id) ON DELETE SET NULL,
  ftc_disclosure_text text,
  status text NOT NULL DEFAULT 'pending_review' CHECK (
    status IN ('pending_review', 'published', 'rejected')
  ),
  published_at timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  like_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.post_engagement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.advocate_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('view', 'like', 'save', 'share')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, action)
);

CREATE TABLE IF NOT EXISTS public.advocate_followers (
  advocate_id uuid NOT NULL REFERENCES public.advocate_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (advocate_id, user_id)
);

CREATE INDEX IF NOT EXISTS beauty_challenges_active_idx ON public.beauty_challenges (active, end_date);
CREATE INDEX IF NOT EXISTS advocate_posts_status_idx ON public.advocate_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS challenge_check_ins_review_idx ON public.challenge_check_ins (approved, created_at);

ALTER TABLE public.beauty_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advocate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advocate_followers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active challenges" ON public.beauty_challenges;
CREATE POLICY "Public read active challenges"
  ON public.beauty_challenges FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Users manage own participation" ON public.challenge_participants;
CREATE POLICY "Users manage own participation"
  ON public.challenge_participants FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public read approved check-ins" ON public.challenge_check_ins;
CREATE POLICY "Public read approved check-ins"
  ON public.challenge_check_ins FOR SELECT USING (approved = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own check-ins" ON public.challenge_check_ins;
CREATE POLICY "Users insert own check-ins"
  ON public.challenge_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users read own check-ins" ON public.challenge_check_ins;
CREATE POLICY "Users read own check-ins"
  ON public.challenge_check_ins FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public read published advocate posts" ON public.advocate_posts;
CREATE POLICY "Public read published advocate posts"
  ON public.advocate_posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Advocates manage own posts" ON public.advocate_posts;
CREATE POLICY "Advocates manage own posts"
  ON public.advocate_posts FOR ALL
  USING (auth.uid() = advocate_id) WITH CHECK (auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Users manage own engagement" ON public.post_engagement;
CREATE POLICY "Users manage own engagement"
  ON public.post_engagement FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public read followers count" ON public.advocate_followers;
CREATE POLICY "Public read followers count"
  ON public.advocate_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users follow advocates" ON public.advocate_followers;
CREATE POLICY "Users follow advocates"
  ON public.advocate_followers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users unfollow" ON public.advocate_followers;
CREATE POLICY "Users unfollow"
  ON public.advocate_followers FOR DELETE USING (auth.uid() = user_id);

-- Storage buckets (create in Supabase dashboard): challenge-checkins, advocate-posts (public read for approved URLs).

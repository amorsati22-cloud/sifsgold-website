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

-- Auto-generated (5 challenges, 3 advocate posts)
-- advocate_id in posts must exist in advocate_profiles before running post seeds.

INSERT INTO public.beauty_challenges (
  id, name, description, challenge_type, duration_days, start_date, end_date,
  cover_image_url, prize, sponsor_brand_id, ftc_disclosure_required, active, participant_count, daily_prompts
) VALUES
  ('c0000001-0003-4003-8003-000000000001'::uuid, '7 Days of Self-Care', 'Body-positive rituals for rest, hydration, and joy — no transformation goals, no before/after pressure.', 'self_care', 7, '2026-05-18', '2026-05-24', NULL, 'Featured on Sif''s Gold community spotlight', NULL, false, true, 128, '[{"day":1,"title":"Pause","prompt":"Take five minutes away from screens — breathe, stretch, or sip water."},{"day":2,"title":"Hydrate","prompt":"Drink an extra glass of water and notice how your body feels."},{"day":3,"title":"Gentle touch","prompt":"Apply hand cream or oil slowly — a small act of care for you."},{"day":4,"title":"Boundary","prompt":"Say no to one thing that drains you today."},{"day":5,"title":"Joy","prompt":"Do something that makes you smile with zero productivity goal."},{"day":6,"title":"Rest","prompt":"Protect your sleep window tonight — dim lights, calm routine."},{"day":7,"title":"Gratitude","prompt":"Name three things your body did for you this week."}]'::jsonb),
  ('c0000002-0003-4003-8003-000000000002'::uuid, 'Color Theory Mastery', 'Build formulation confidence with daily study — skill-focused, not appearance-focused.', 'skill_building', 14, '2026-05-18', '2026-05-31', NULL, 'Study guide bundle shout-out', NULL, false, true, 84, '[{"day":1,"title":"Level","prompt":"Review level vs tone on a swatch chart for 10 minutes."},{"day":2,"title":"Underlying pigment","prompt":"Sketch warm vs cool underlying pigment notes."},{"day":3,"title":"Consult","prompt":"Practice explaining one color choice in client-friendly language."},{"day":4,"title":"Strand test","prompt":"Plan a strand test — document timing, not results photos."},{"day":5,"title":"Grey blend","prompt":"Study one grey-blending approach from manufacturer education."},{"day":6,"title":"Correction map","prompt":"Map a color correction flowchart on paper."},{"day":7,"title":"Rest day","prompt":"Rest your eyes — revisit notes tomorrow."},{"day":8,"title":"Formulation","prompt":"Write a formula for a demi refresh without photos."},{"day":9,"title":"Share","prompt":"Teach a peer one concept you learned this week."},{"day":10,"title":"Celebrate craft","prompt":"Celebrate a technique win — not a physical change."}]'::jsonb),
  ('c0000003-0003-4003-8003-000000000003'::uuid, 'Creative Chair Moments', 'Document craft, tools, and process — celebrate artistry without comparison framing.', 'creative', 10, '2026-05-15', '2026-05-24', NULL, NULL, NULL, false, true, 56, '[{"day":1,"title":"Tools flat lay","prompt":"Photograph your tools setup — no faces required."},{"day":2,"title":"Texture","prompt":"Close-up of texture you created (with consent)."},{"day":3,"title":"Palette","prompt":"Share a color palette that inspires today''s work."},{"day":4,"title":"Process","prompt":"Mid-process shot — show the work, not a reveal."},{"day":5,"title":"Education","prompt":"Share one tip you wish you knew as a student."}]'::jsonb),
  ('c0000004-0003-4003-8003-000000000004'::uuid, 'Community Kindness Chain', 'Uplift another pro or client — kindness only, no critique of bodies.', 'community', 5, '2026-05-18', '2026-05-22', NULL, NULL, NULL, false, true, 201, '[{"day":1,"title":"Shout-out","prompt":"Tag a colleague whose work you respect."},{"day":2,"title":"Review","prompt":"Leave a thoughtful review for a pro you booked."},{"day":3,"title":"Mentor","prompt":"Send encouragement to a student in your network."},{"day":4,"title":"Client care","prompt":"Share how you make clients feel safe in your chair."},{"day":5,"title":"Pay it forward","prompt":"Offer a small kindness with no expectation back."}]'::jsonb),
  ('c0000005-0003-4003-8003-000000000005'::uuid, 'Mindful Hands Week', 'Ergonomics and hand care for long days — wellness for pros.', 'self_care', 7, '2026-05-04', '2026-05-10', NULL, NULL, NULL, false, false, 312, '[{"day":1,"title":"Stretch","prompt":"Two-minute wrist and forearm stretch between clients."},{"day":2,"title":"Posture","prompt":"Reset chair height and posture checklist."}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  participant_count = EXCLUDED.participant_count,
  daily_prompts = EXCLUDED.daily_prompts;

INSERT INTO public.advocate_posts (
  id, advocate_id, post_type, title, body, image_urls, video_url,
  linked_brand_deal_id, ftc_disclosure_text, status, published_at, view_count, like_count
) VALUES
  ('p0000001-0004-4004-8004-000000000001'::uuid, '00000000-0000-4000-8000-000000000099'::uuid, 'tip', 'Consultation questions that build trust', 'Ask what maintenance window feels realistic — not what they wish they looked like. Clients open up when goals are collaborative.', ARRAY[]::text[], NULL, NULL, NULL, 'published', '2026-05-18T18:45:58.634Z'::timestamptz, 420, 38),
  ('p0000002-0004-4004-8004-000000000002'::uuid, '00000000-0000-4000-8000-000000000099'::uuid, 'tutorial', 'Gloss refresh without over-processing', 'A demi refresh can revive tone between full services — always strand test and document timing.', ARRAY[]::text[], NULL, NULL, NULL, 'published', '2026-05-18T18:45:58.634Z'::timestamptz, 310, 27),
  ('p0000003-0004-4004-8004-000000000003'::uuid, '00000000-0000-4000-8000-000000000099'::uuid, 'brand_partner', 'Why I reach for this bond builder between services', 'Honest routine on damaged hair — focused on integrity, not transformation promises.', ARRAY[]::text[], NULL, NULL, 'Paid partnership with Partner Brand. #ad #partner Posted on Sif''s Gold. This disclosure is provided in accordance with the U.S. FTC Endorsement Guides (16 CFR Part 255).', 'published', '2026-05-18T18:45:58.634Z'::timestamptz, 890, 64)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  ftc_disclosure_text = EXCLUDED.ftc_disclosure_text;

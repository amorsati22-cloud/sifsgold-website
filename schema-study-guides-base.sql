-- Sif's Gold Study Guides — flashcards, spaced repetition, progress
-- Run in Supabase SQL editor after public.profiles exists.
-- Card rows: run scripts/gen-study-sql.ts then append schema-study-guides-cards.generated.sql
-- (or use the combined schema-study-guides.sql in repo root).

-- ---------------------------------------------------------------------------
-- study_guides
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  program_type text CHECK (
    program_type IN (
      'cosmetology', 'barbering', 'esthetics', 'nail_tech',
      'massage', 'tattoo', 'piercing'
    )
  ),
  state text,
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  description text,
  cover_image_url text,
  total_cards integer NOT NULL DEFAULT 0,
  estimated_hours decimal(4, 1),
  order_index integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS study_guides_program_state_idx
  ON public.study_guides (program_type, state, order_index);

-- ---------------------------------------------------------------------------
-- flashcard_decks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_guide_id uuid NOT NULL REFERENCES public.study_guides(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  card_count integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS flashcard_decks_guide_order_idx
  ON public.flashcard_decks (study_guide_id, order_index);

-- ---------------------------------------------------------------------------
-- flashcards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  front_text text NOT NULL,
  back_text text NOT NULL,
  image_url text,
  mnemonics text,
  exam_relevance integer CHECK (exam_relevance BETWEEN 1 AND 5),
  order_index integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS flashcards_deck_order_idx
  ON public.flashcards (deck_id, order_index);

-- ---------------------------------------------------------------------------
-- user_card_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_card_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  review_count integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  incorrect_count integer NOT NULL DEFAULT 0,
  last_reviewed_at timestamptz,
  next_due_at timestamptz,
  easiness_factor decimal(4, 2) NOT NULL DEFAULT 2.5,
  interval_days integer NOT NULL DEFAULT 1,
  mastery_level text NOT NULL DEFAULT 'new'
    CHECK (mastery_level IN ('new', 'learning', 'familiar', 'mastered')),
  UNIQUE (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS user_card_progress_user_due_idx
  ON public.user_card_progress (user_id, next_due_at);

CREATE INDEX IF NOT EXISTS user_card_progress_user_mastery_idx
  ON public.user_card_progress (user_id, mastery_level);

-- ---------------------------------------------------------------------------
-- study_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deck_id uuid NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  cards_reviewed integer,
  correct_count integer,
  session_duration_seconds integer
);

CREATE INDEX IF NOT EXISTS study_sessions_user_started_idx
  ON public.study_sessions (user_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- user_study_streaks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_study_streaks (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak_days integer NOT NULL DEFAULT 0,
  longest_streak_days integer NOT NULL DEFAULT 0,
  last_study_date date,
  total_study_minutes integer NOT NULL DEFAULT 0,
  total_cards_mastered integer NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.study_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_streaks ENABLE ROW LEVEL SECURITY;

-- Public catalog read
DROP POLICY IF EXISTS "Public read published study guides" ON public.study_guides;
CREATE POLICY "Public read published study guides"
  ON public.study_guides FOR SELECT
  USING (public = true);

DROP POLICY IF EXISTS "Public read decks of public guides" ON public.flashcard_decks;
CREATE POLICY "Public read decks of public guides"
  ON public.flashcard_decks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.study_guides g
      WHERE g.id = study_guide_id AND g.public = true
    )
  );

DROP POLICY IF EXISTS "Public read flashcards of public guides" ON public.flashcards;
CREATE POLICY "Public read flashcards of public guides"
  ON public.flashcards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_decks d
      JOIN public.study_guides g ON g.id = d.study_guide_id
      WHERE d.id = deck_id AND g.public = true
    )
  );

-- User progress
DROP POLICY IF EXISTS "Users manage own card progress" ON public.user_card_progress;
CREATE POLICY "Users manage own card progress"
  ON public.user_card_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own study sessions" ON public.study_sessions;
CREATE POLICY "Users manage own study sessions"
  ON public.study_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own study streaks" ON public.user_study_streaks;
CREATE POLICY "Users manage own study streaks"
  ON public.user_study_streaks FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Deny service_role direct reads on user tables
DROP POLICY IF EXISTS "Service role never reads card progress" ON public.user_card_progress;
CREATE POLICY "Service role never reads card progress"
  ON public.user_card_progress FOR ALL TO service_role
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Service role never reads study sessions" ON public.study_sessions;
CREATE POLICY "Service role never reads study sessions"
  ON public.study_sessions FOR ALL TO service_role
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Service role never reads study streaks" ON public.user_study_streaks;
CREATE POLICY "Service role never reads study streaks"
  ON public.user_study_streaks FOR ALL TO service_role
  USING (false) WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- Seed: guides & decks (150 flashcards follow in generated section)
-- ---------------------------------------------------------------------------
INSERT INTO public.study_guides (
  id, name, program_type, state, level, description, total_cards, estimated_hours, order_index, public
) VALUES
  (
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Texas Cosmetology Theory',
    'cosmetology',
    'TX',
    'intermediate',
    'TDLR-focused theory: sanitation, hair color, anatomy, and NIC-style written prep for Texas operator candidates.',
    50,
    8.0,
    1,
    true
  ),
  (
    'a0000002-0002-4002-8002-000000000002'::uuid,
    'California Cosmetology Theory',
    'cosmetology',
    'CA',
    'intermediate',
    'BBC-aligned theory decks with California hours, scope, and sanitation emphasis.',
    50,
    8.0,
    2,
    true
  ),
  (
    'a0000003-0003-4003-8003-000000000003'::uuid,
    'Florida Cosmetology Theory',
    'cosmetology',
    'FL',
    'intermediate',
    'DBPR-focused decks covering Florida rules, sanitation, color theory, and anatomy.',
    50,
    8.0,
    3,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  total_cards = EXCLUDED.total_cards,
  description = EXCLUDED.description;

INSERT INTO public.flashcard_decks (id, study_guide_id, name, description, order_index, card_count) VALUES
  ('b1000001-0001-4001-8001-000000000101'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'Sanitation Basics', 'Infection control, disinfection, and Texas scope rules.', 1, 17),
  ('b1000002-0002-4002-8002-000000000102'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'Hair Color Theory', 'Level, tone, developers, and corrective color fundamentals.', 2, 17),
  ('b1000003-0003-4003-8003-000000000103'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'Anatomy & Physiology', 'Skin, hair, nails, and microbiology for state board.', 3, 16),
  ('b2000001-0001-4001-8001-000000000201'::uuid, 'a0000002-0002-4002-8002-000000000002'::uuid, 'Sanitation Basics', 'BBC infection control and workstation standards.', 1, 17),
  ('b2000002-0002-4002-8002-000000000202'::uuid, 'a0000002-0002-4002-8002-000000000002'::uuid, 'Hair Color Theory', 'Formulation, lift, and tone for written exam scenarios.', 2, 17),
  ('b2000003-0003-4003-8003-000000000203'::uuid, 'a0000002-0002-4002-8002-000000000002'::uuid, 'Anatomy & Physiology', 'Structure of skin, hair, and nails.', 3, 16),
  ('b3000001-0001-4001-8001-000000000301'::uuid, 'a0000003-0003-4003-8003-000000000003'::uuid, 'Sanitation Basics', 'Florida sanitation statutes and best practices.', 1, 17),
  ('b3000002-0002-4002-8002-000000000302'::uuid, 'a0000003-0003-4003-8003-000000000003'::uuid, 'Hair Color Theory', 'Color wheel, developers, and safety.', 2, 17),
  ('b3000003-0003-4003-8003-000000000303'::uuid, 'a0000003-0003-4003-8003-000000000003'::uuid, 'Anatomy & Physiology', 'Hair growth cycles and skin structure.', 3, 16)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  card_count = EXCLUDED.card_count;

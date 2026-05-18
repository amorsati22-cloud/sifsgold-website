-- Sif's Gold State Board Prep — exams, questions, attempts, subscriptions
-- Run after public.profiles exists.
-- Question seeds: npx tsx scripts/gen-state-board-sql.ts → append schema-state-board-seeds.generated.sql

-- ---------------------------------------------------------------------------
-- state_board_exams
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.state_board_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  program_type text NOT NULL CHECK (
    program_type IN ('cosmetology', 'barbering', 'esthetics', 'nail_tech')
  ),
  exam_name text NOT NULL,
  vendor text NOT NULL,
  total_questions integer NOT NULL DEFAULT 0,
  passing_score integer NOT NULL,
  time_limit_minutes integer NOT NULL,
  required_hours integer NOT NULL,
  statute_citation text NOT NULL,
  board_name text NOT NULL,
  official_link text NOT NULL,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  content_status text NOT NULL DEFAULT 'draft'
    CHECK (content_status IN ('draft', 'published', 'archived')),
  UNIQUE (state, program_type)
);

CREATE INDEX IF NOT EXISTS state_board_exams_state_program_idx
  ON public.state_board_exams (state, program_type);

-- ---------------------------------------------------------------------------
-- questions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.state_board_exams(id) ON DELETE CASCADE,
  question_type text NOT NULL CHECK (
    question_type IN ('multiple_choice', 'true_false', 'flashcard')
  ),
  category text NOT NULL CHECK (
    category IN ('sanitation', 'anatomy', 'chemistry', 'practical', 'state_law')
  ),
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  question_text text NOT NULL,
  choice_a text,
  choice_b text,
  choice_c text,
  choice_d text,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  citation text,
  exam_relevance integer CHECK (exam_relevance BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS questions_exam_category_idx
  ON public.questions (exam_id, category);

CREATE INDEX IF NOT EXISTS questions_exam_type_idx
  ON public.questions (exam_id, question_type);

-- ---------------------------------------------------------------------------
-- practice_test_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.practice_test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES public.state_board_exams(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  time_elapsed_seconds integer,
  questions_answered integer,
  correct_count integer,
  score_percent decimal(5, 2),
  passed boolean,
  category_breakdown jsonb
);

CREATE INDEX IF NOT EXISTS practice_test_attempts_user_idx
  ON public.practice_test_attempts (user_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- user_question_history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answered_correctly boolean NOT NULL,
  time_to_answer_seconds integer,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  attempt_number integer NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS user_question_history_user_idx
  ON public.user_question_history (user_id, attempted_at DESC);

-- ---------------------------------------------------------------------------
-- state_board_subscriptions (notify me)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.state_board_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  state text NOT NULL,
  program_type text NOT NULL,
  notification_email text NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, state, program_type)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.state_board_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_board_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published exams" ON public.state_board_exams;
CREATE POLICY "Public read published exams"
  ON public.state_board_exams FOR SELECT
  USING (content_status = 'published');

DROP POLICY IF EXISTS "Public read questions of published exams" ON public.questions;
CREATE POLICY "Public read questions of published exams"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.state_board_exams e
      WHERE e.id = exam_id AND e.content_status = 'published'
    )
  );

DROP POLICY IF EXISTS "Users manage own attempts" ON public.practice_test_attempts;
CREATE POLICY "Users manage own attempts"
  ON public.practice_test_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own question history" ON public.user_question_history;
CREATE POLICY "Users manage own question history"
  ON public.user_question_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own subscriptions" ON public.state_board_subscriptions;
CREATE POLICY "Users manage own subscriptions"
  ON public.state_board_subscriptions FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can notify for coming soon" ON public.state_board_subscriptions;
CREATE POLICY "Anyone can notify for coming soon"
  ON public.state_board_subscriptions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role never reads attempts" ON public.practice_test_attempts;
CREATE POLICY "Service role never reads attempts"
  ON public.practice_test_attempts FOR ALL TO service_role
  USING (false) WITH CHECK (false);

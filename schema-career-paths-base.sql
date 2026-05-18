-- Sif's Gold Career Paths — roles, milestones, interactive maps
-- Run after public.profiles exists.
-- Seeds: npx tsx scripts/gen-career-sql.ts → append schema-career-paths-seeds.generated.sql

CREATE TABLE IF NOT EXISTS public.career_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('hair', 'skin', 'nails', 'lashes', 'massage', 'tattoo', 'business')
  ),
  description text NOT NULL,
  median_annual_salary integer NOT NULL,
  salary_range_low integer NOT NULL,
  salary_range_high integer NOT NULL,
  bls_source_link text NOT NULL,
  salary_data_year integer NOT NULL,
  required_license_types text[] NOT NULL DEFAULT '{}',
  required_education text NOT NULL,
  typical_continuing_education text NOT NULL,
  specialty_certifications text[] NOT NULL DEFAULT '{}',
  career_advancement text NOT NULL,
  icon text NOT NULL DEFAULT 'Briefcase'
);

CREATE INDEX IF NOT EXISTS career_roles_category_idx ON public.career_roles (category);
CREATE INDEX IF NOT EXISTS career_roles_median_salary_idx ON public.career_roles (median_annual_salary);

CREATE TABLE IF NOT EXISTS public.career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starting_point text NOT NULL CHECK (
    starting_point IN ('high_school', 'career_change', 'currently_licensed', 'experienced_pro')
  ),
  end_role text NOT NULL CHECK (
    end_role IN ('salon_owner', 'platform_artist', 'educator', 'celebrity_stylist')
  ),
  name text NOT NULL,
  description text NOT NULL,
  estimated_total_years integer NOT NULL,
  estimated_total_investment integer NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS career_paths_start_end_idx
  ON public.career_paths (starting_point, end_role);

CREATE TABLE IF NOT EXISTS public.career_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
  milestone_order integer NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  estimated_duration_months integer NOT NULL,
  estimated_cost integer NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  typical_outcomes text[] NOT NULL DEFAULT '{}',
  UNIQUE (path_id, milestone_order)
);

CREATE TABLE IF NOT EXISTS public.career_path_roles (
  path_id uuid NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  milestone_order integer NOT NULL,
  PRIMARY KEY (path_id, role_id, milestone_order)
);

CREATE TABLE IF NOT EXISTS public.user_career_interests (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  interested_roles uuid[] NOT NULL DEFAULT '{}',
  starting_point text CHECK (
    starting_point IN ('high_school', 'career_change', 'currently_licensed', 'experienced_pro')
  ),
  target_role uuid REFERENCES public.career_roles(id) ON DELETE SET NULL,
  saved_path_id uuid REFERENCES public.career_paths(id) ON DELETE SET NULL,
  milestone_progress jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_path_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_career_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read career roles" ON public.career_roles;
CREATE POLICY "Public read career roles"
  ON public.career_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read career paths" ON public.career_paths;
CREATE POLICY "Public read career paths"
  ON public.career_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read milestones" ON public.career_milestones;
CREATE POLICY "Public read milestones"
  ON public.career_milestones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read path roles" ON public.career_path_roles;
CREATE POLICY "Public read path roles"
  ON public.career_path_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own career interests" ON public.user_career_interests;
CREATE POLICY "Users manage own career interests"
  ON public.user_career_interests FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

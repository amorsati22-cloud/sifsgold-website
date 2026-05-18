-- Beauty school dashboard (FERPA-conscious RLS)
-- Run after: profiles, pricing.tiers, state_board_exams

-- ---------------------------------------------------------------------------
-- schools
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  accreditation text,
  state text NOT NULL,
  license_number text,
  encrypted_license_number text,
  license_iv text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state_code text,
  zip text,
  country text DEFAULT 'US',
  phone text,
  email text,
  website text,
  description text,
  logo_url text,
  slug text UNIQUE,
  is_public boolean DEFAULT true,
  subscription_tier text REFERENCES pricing.tiers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS schools_owner_idx ON public.schools (owner_id);

-- ---------------------------------------------------------------------------
-- cohorts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  program_type text NOT NULL CHECK (
    program_type IN ('cosmetology', 'barbering', 'esthetics', 'nail_tech')
  ),
  state text NOT NULL,
  required_hours integer NOT NULL,
  start_date date,
  expected_end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cohorts_school_idx ON public.cohorts (school_id, status);

-- ---------------------------------------------------------------------------
-- students (profile id = student id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE RESTRICT,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  expected_graduation date,
  actual_graduation date,
  status text DEFAULT 'enrolled' CHECK (
    status IN ('enrolled', 'on_leave', 'graduated', 'withdrawn')
  ),
  hours_completed decimal(10,2) DEFAULT 0,
  gpa decimal(3,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS students_cohort_idx ON public.students (cohort_id, status);
CREATE INDEX IF NOT EXISTS students_school_idx ON public.students (school_id);

-- ---------------------------------------------------------------------------
-- instructors
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.instructors (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  specialty text[] DEFAULT '{}',
  license_state text,
  encrypted_license_number text,
  license_iv text,
  start_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS instructors_school_idx ON public.instructors (school_id, status);

-- ---------------------------------------------------------------------------
-- cohort_instructors
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cohort_instructors (
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
  PRIMARY KEY (cohort_id, instructor_id)
);

-- ---------------------------------------------------------------------------
-- syllabus_modules
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syllabus_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  required_hours decimal(10,2) NOT NULL DEFAULT 0,
  module_order integer NOT NULL DEFAULT 0,
  module_type text NOT NULL DEFAULT 'theory' CHECK (
    module_type IN ('theory', 'practical', 'lab', 'clinic')
  ),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS syllabus_modules_cohort_idx ON public.syllabus_modules (cohort_id, module_order);

-- ---------------------------------------------------------------------------
-- student_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.syllabus_modules(id) ON DELETE CASCADE,
  hours_logged decimal(10,2) DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  score decimal(5,2),
  instructor_notes text,
  UNIQUE (student_id, module_id)
);

-- ---------------------------------------------------------------------------
-- hour_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hour_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.syllabus_modules(id) ON DELETE SET NULL,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  logged_at timestamptz DEFAULT now(),
  hours decimal(10,2) NOT NULL,
  activity text NOT NULL CHECK (
    activity IN ('theory_lecture', 'practical_skill_check', 'salon_clinic', 'lab', 'other')
  ),
  service_performed text,
  instructor_id uuid REFERENCES public.instructors(id) ON DELETE SET NULL,
  approved boolean DEFAULT false,
  approved_at timestamptz,
  photo_evidence_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hour_logs_student_idx ON public.hour_logs (student_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS hour_logs_pending_idx ON public.hour_logs (school_id, approved) WHERE approved = false;

-- ---------------------------------------------------------------------------
-- school_communications (audit log — FERPA)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL,
  sent_by uuid NOT NULL REFERENCES public.profiles(id),
  subject text NOT NULL,
  body_preview text,
  recipient_count integer DEFAULT 0,
  template_type text,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER for RLS)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_school_owner(p_school_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.schools s WHERE s.id = p_school_id AND s.owner_id = p_user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_school_instructor(p_school_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.instructors i
    WHERE i.school_id = p_school_id AND i.id = p_user_id AND i.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_school_admin(p_school_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_school_owner(p_school_id, p_user_id)
    OR public.is_school_instructor(p_school_id, p_user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_student(p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students st WHERE st.id = p_user_id AND st.status = 'enrolled'
  );
$$;

CREATE OR REPLACE FUNCTION public.instructor_can_access_student(p_instructor_id uuid, p_student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students st
    JOIN public.cohort_instructors ci ON ci.cohort_id = st.cohort_id
    WHERE st.id = p_student_id AND ci.instructor_id = p_instructor_id
  );
$$;

CREATE OR REPLACE FUNCTION public.can_view_student_record(p_viewer_id uuid, p_student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p_viewer_id = p_student_id
    OR EXISTS (
      SELECT 1 FROM public.students st
      JOIN public.schools sch ON sch.id = st.school_id
      WHERE st.id = p_student_id AND sch.owner_id = p_viewer_id
    )
    OR public.instructor_can_access_student(p_viewer_id, p_student_id);
$$;

-- Roll up approved hours into students.hours_completed
CREATE OR REPLACE FUNCTION public.sync_student_hours()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.approved = true THEN
    UPDATE public.students SET hours_completed = (
      SELECT COALESCE(SUM(hours), 0) FROM public.hour_logs
      WHERE student_id = NEW.student_id AND approved = true
    ) WHERE id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hour_logs_sync_hours ON public.hour_logs;
CREATE TRIGGER hour_logs_sync_hours
  AFTER INSERT OR UPDATE OF approved ON public.hour_logs
  FOR EACH ROW EXECUTE FUNCTION public.sync_student_hours();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hour_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_communications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public schools read" ON public.schools;
CREATE POLICY "Public schools read" ON public.schools FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "School owners manage" ON public.schools;
CREATE POLICY "School owners manage" ON public.schools
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "School admins cohorts" ON public.cohorts;
CREATE POLICY "School admins cohorts" ON public.cohorts
  FOR ALL USING (public.is_school_admin(school_id, auth.uid()))
  WITH CHECK (public.is_school_admin(school_id, auth.uid()));

DROP POLICY IF EXISTS "Students read own row" ON public.students;
CREATE POLICY "Students read own row" ON public.students FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins manage students" ON public.students;
CREATE POLICY "Admins manage students" ON public.students
  FOR ALL USING (
    public.is_school_owner(school_id, auth.uid())
    OR public.instructor_can_access_student(auth.uid(), id)
  )
  WITH CHECK (public.is_school_owner(school_id, auth.uid()));

DROP POLICY IF EXISTS "FERPA student_progress" ON public.student_progress;
CREATE POLICY "FERPA student_progress" ON public.student_progress
  FOR ALL USING (public.can_view_student_record(auth.uid(), student_id))
  WITH CHECK (public.can_view_student_record(auth.uid(), student_id));

DROP POLICY IF EXISTS "FERPA hour_logs" ON public.hour_logs;
CREATE POLICY "FERPA hour_logs" ON public.hour_logs
  FOR ALL USING (public.can_view_student_record(auth.uid(), student_id))
  WITH CHECK (
    student_id = auth.uid()
    OR public.is_school_admin(school_id, auth.uid())
  );

DROP POLICY IF EXISTS "Syllabus school read" ON public.syllabus_modules;
CREATE POLICY "Syllabus school read" ON public.syllabus_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = cohort_id
        AND (public.is_school_admin(c.school_id, auth.uid())
          OR EXISTS (SELECT 1 FROM public.students s WHERE s.cohort_id = c.id AND s.id = auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Syllabus school write" ON public.syllabus_modules;
CREATE POLICY "Syllabus school write" ON public.syllabus_modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.cohorts c WHERE c.id = cohort_id AND public.is_school_owner(c.school_id, auth.uid()))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.cohorts c WHERE c.id = cohort_id AND public.is_school_owner(c.school_id, auth.uid()))
  );

DROP POLICY IF EXISTS "Service role schools" ON public.schools;
CREATE POLICY "Service role schools" ON public.schools FOR ALL TO service_role USING (true) WITH CHECK (true);

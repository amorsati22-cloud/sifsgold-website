import "server-only";

import { addDays, format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getStateBoardProgress } from "@/lib/state-board/data";
import { stateSlugFromCode } from "@/lib/state-board/data";
import type {
  Cohort,
  HourLog,
  School,
  SchoolHomeOverview,
  SchoolStudent,
  StudentBoardPrep,
  SyllabusModule,
} from "@/types/school";

export async function getSchoolHomeOverview(schoolId: string): Promise<SchoolHomeOverview> {
  const supabase = await createClient();
  if (!supabase) {
    return { activeCohorts: 0, enrolledStudents: 0, upcomingGraduations: [], stateBoardPassRate: null };
  }

  const { count: cohortCount } = await supabase
    .from("cohorts")
    .select("id", { count: "exact", head: true })
    .eq("school_id", schoolId)
    .eq("status", "active");

  const { count: studentCount } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("school_id", schoolId)
    .eq("status", "enrolled");

  const cutoff = addDays(new Date(), 60).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const { data: grads } = await supabase
    .from("students")
    .select("id, expected_graduation, profiles(full_name)")
    .eq("school_id", schoolId)
    .eq("status", "enrolled")
    .gte("expected_graduation", today)
    .lte("expected_graduation", cutoff)
    .order("expected_graduation", { ascending: true })
    .limit(10);

  const upcomingGraduations = (grads ?? []).map((g) => ({
    id: g.id as string,
    display_name: (g.profiles as { full_name: string } | null)?.full_name ?? "Student",
    expected_graduation: g.expected_graduation as string,
  }));

  return {
    activeCohorts: cohortCount ?? 0,
    enrolledStudents: studentCount ?? 0,
    upcomingGraduations,
    stateBoardPassRate: null,
  };
}

export async function getSchoolCohorts(schoolId: string): Promise<Cohort[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("cohorts")
    .select("*, students(count)")
    .eq("school_id", schoolId)
    .order("start_date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    school_id: row.school_id as string,
    name: row.name as string,
    program_type: row.program_type as Cohort["program_type"],
    state: row.state as string,
    required_hours: Number(row.required_hours),
    start_date: row.start_date as string | null,
    expected_end_date: row.expected_end_date as string | null,
    status: row.status as Cohort["status"],
    student_count: (row.students as { count: number }[] | null)?.[0]?.count ?? 0,
  }));
}

export async function getCohortDetail(cohortId: string): Promise<{
  cohort: Cohort;
  students: SchoolStudent[];
  modules: SyllabusModule[];
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: cohort } = await supabase.from("cohorts").select("*").eq("id", cohortId).single();
  if (!cohort) return null;

  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(full_name, email)")
    .eq("cohort_id", cohortId);

  const { data: modules } = await supabase
    .from("syllabus_modules")
    .select("*")
    .eq("cohort_id", cohortId)
    .order("module_order", { ascending: true });

  const required = Number(cohort.required_hours);

  return {
    cohort: cohort as Cohort,
    students: (students ?? []).map((s) => {
      const prof = s.profiles as { full_name: string; email: string } | null;
      const hours = Number(s.hours_completed);
      return {
        id: s.id as string,
        cohort_id: s.cohort_id as string,
        school_id: s.school_id as string,
        enrollment_date: s.enrollment_date as string | null,
        expected_graduation: s.expected_graduation as string | null,
        status: s.status as SchoolStudent["status"],
        hours_completed: hours,
        gpa: s.gpa != null ? Number(s.gpa) : null,
        display_name: prof?.full_name ?? "Student",
        email: prof?.email,
        progress_percent: required > 0 ? Math.min(100, Math.round((hours / required) * 100)) : 0,
      };
    }),
    modules: (modules ?? []).map((m) => ({
      id: m.id as string,
      cohort_id: m.cohort_id as string,
      name: m.name as string,
      description: m.description as string | null,
      required_hours: Number(m.required_hours),
      module_order: Number(m.module_order),
      module_type: m.module_type as SyllabusModule["module_type"],
    })),
  };
}

export async function getSchoolStudents(
  schoolId: string,
  filters?: { cohortId?: string; status?: string },
): Promise<SchoolStudent[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let q = supabase
    .from("students")
    .select("*, profiles(full_name, email), cohort:cohorts(name, required_hours)")
    .eq("school_id", schoolId)
    .order("enrollment_date", { ascending: false });

  if (filters?.cohortId) q = q.eq("cohort_id", filters.cohortId);
  if (filters?.status) q = q.eq("status", filters.status);

  const { data } = await q;

  return (data ?? []).map((s) => {
    const prof = s.profiles as { full_name: string; email: string } | null;
    const cohort = s.cohort as { name: string; required_hours: number } | null;
    const required = cohort?.required_hours ?? 1;
    const hours = Number(s.hours_completed);
    return {
      id: s.id as string,
      cohort_id: s.cohort_id as string,
      school_id: s.school_id as string,
      enrollment_date: s.enrollment_date as string | null,
      expected_graduation: s.expected_graduation as string | null,
      status: s.status as SchoolStudent["status"],
      hours_completed: hours,
      gpa: s.gpa != null ? Number(s.gpa) : null,
      display_name: prof?.full_name ?? "Student",
      email: prof?.email,
      cohort_name: cohort?.name,
      progress_percent: Math.min(100, Math.round((hours / required) * 100)),
    };
  });
}

export async function getStudentDetail(studentId: string): Promise<{
  student: SchoolStudent;
  cohort: Cohort;
  modules: SyllabusModule[];
  hourLogs: HourLog[];
  boardPrep: StudentBoardPrep;
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: row } = await supabase
    .from("students")
    .select("*, profiles(full_name, email), cohort:cohorts(*)")
    .eq("id", studentId)
    .single();

  if (!row) return null;

  const prof = row.profiles as { full_name: string; email: string } | null;
  const cohortRaw = row.cohort as Cohort | Cohort[] | null;
  const cohort = (Array.isArray(cohortRaw) ? cohortRaw[0] : cohortRaw) as Cohort;

  const { data: modules } = await supabase
    .from("syllabus_modules")
    .select("*")
    .eq("cohort_id", cohort.id)
    .order("module_order", { ascending: true });

  const { data: logs } = await supabase
    .from("hour_logs")
    .select("*")
    .eq("student_id", studentId)
    .order("logged_at", { ascending: false })
    .limit(50);

  const boardPrep = await getStudentBoardPrep(studentId, cohort.state, cohort.program_type);

  const required = cohort.required_hours;
  const hours = Number(row.hours_completed);

  return {
    student: {
      id: row.id as string,
      cohort_id: row.cohort_id as string,
      school_id: row.school_id as string,
      enrollment_date: row.enrollment_date as string | null,
      expected_graduation: row.expected_graduation as string | null,
      status: row.status as SchoolStudent["status"],
      hours_completed: hours,
      gpa: row.gpa != null ? Number(row.gpa) : null,
      display_name: prof?.full_name ?? "Student",
      email: prof?.email,
      progress_percent: Math.min(100, Math.round((hours / required) * 100)),
    },
    cohort,
    modules: (modules ?? []).map((m) => ({
      id: m.id as string,
      cohort_id: m.cohort_id as string,
      name: m.name as string,
      description: m.description as string | null,
      required_hours: Number(m.required_hours),
      module_order: Number(m.module_order),
      module_type: m.module_type as SyllabusModule["module_type"],
    })),
    hourLogs: (logs ?? []).map((l) => ({
      id: l.id as string,
      student_id: l.student_id as string,
      module_id: l.module_id as string | null,
      hours: Number(l.hours),
      activity: l.activity as HourLog["activity"],
      service_performed: l.service_performed as string | null,
      instructor_id: l.instructor_id as string | null,
      approved: Boolean(l.approved),
      logged_at: l.logged_at as string,
      photo_evidence_url: l.photo_evidence_url as string | null,
    })),
    boardPrep,
  };
}

export async function getStudentBoardPrep(
  userId: string,
  stateCode: string,
  programType: string,
): Promise<StudentBoardPrep> {
  const slug = stateSlugFromCode(stateCode);
  const progress = await getStateBoardProgress(userId, slug, programType);

  const supabase = await createClient();
  let totalQuestions = 300;
  if (supabase) {
    const { data: exam } = await supabase
      .from("state_board_exams")
      .select("total_questions")
      .eq("state", stateCode)
      .eq("program_type", programType)
      .maybeSingle();
    if (exam?.total_questions) totalQuestions = Number(exam.total_questions);
  }

  const { count } = supabase
    ? await supabase
        .from("user_question_history")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
    : { count: 0 };

  const answered = count ?? 0;
  const percentComplete = totalQuestions > 0 ? Math.min(100, Math.round((answered / totalQuestions) * 100)) : 0;

  return {
    questionsAnswered: answered,
    totalQuestions,
    percentComplete,
    readinessPercent: progress.readinessPercent,
    weakestCategory: progress.weakestCategory,
  };
}

export async function getPendingHourLogs(schoolId: string): Promise<HourLog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("hour_logs")
    .select("*, students(id, profiles(full_name))")
    .eq("school_id", schoolId)
    .eq("approved", false)
    .order("logged_at", { ascending: false });

  return (data ?? []).map((l) => ({
    id: l.id as string,
    student_id: l.student_id as string,
    module_id: l.module_id as string | null,
    hours: Number(l.hours),
    activity: l.activity as HourLog["activity"],
    service_performed: l.service_performed as string | null,
    instructor_id: l.instructor_id as string | null,
    approved: false,
    logged_at: l.logged_at as string,
    photo_evidence_url: l.photo_evidence_url as string | null,
    student_name: ((l.students as { profiles: { full_name: string } })?.profiles)?.full_name,
  }));
}

export async function getPublicSchool(schoolIdOrSlug: string): Promise<{
  school: School;
  cohorts: Cohort[];
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const isUuid = /^[0-9a-f-]{36}$/i.test(schoolIdOrSlug);
  let q = supabase.from("schools").select("*").eq("is_public", true);
  q = isUuid ? q.eq("id", schoolIdOrSlug) : q.eq("slug", schoolIdOrSlug);

  const { data: school } = await q.maybeSingle();
  if (!school) return null;

  const cohorts = await getSchoolCohorts(school.id as string);
  return { school: school as School, cohorts: cohorts.filter((c) => c.status === "active") };
}

export function formatSchoolAddress(school: School): string {
  return [school.address_line_1, school.city, school.state_code, school.zip].filter(Boolean).join(", ");
}

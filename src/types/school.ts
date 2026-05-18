export type ProgramType = "cosmetology" | "barbering" | "esthetics" | "nail_tech";
export type CohortStatus = "active" | "completed" | "cancelled";
export type StudentStatus = "enrolled" | "on_leave" | "graduated" | "withdrawn";
export type ModuleType = "theory" | "practical" | "lab" | "clinic";
export type HourActivity =
  | "theory_lecture"
  | "practical_skill_check"
  | "salon_clinic"
  | "lab"
  | "other";

export type School = {
  id: string;
  owner_id: string;
  name: string;
  accreditation: string | null;
  state: string;
  license_number: string | null;
  address_line_1: string | null;
  city: string | null;
  state_code: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  slug: string | null;
  is_public: boolean;
  subscription_tier: string | null;
};

export type Cohort = {
  id: string;
  school_id: string;
  name: string;
  program_type: ProgramType;
  state: string;
  required_hours: number;
  start_date: string | null;
  expected_end_date: string | null;
  status: CohortStatus;
  student_count?: number;
};

export type SchoolStudent = {
  id: string;
  cohort_id: string;
  school_id: string;
  enrollment_date: string | null;
  expected_graduation: string | null;
  status: StudentStatus;
  hours_completed: number;
  gpa: number | null;
  display_name?: string;
  email?: string;
  cohort_name?: string;
  progress_percent?: number;
};

export type SyllabusModule = {
  id: string;
  cohort_id: string;
  name: string;
  description: string | null;
  required_hours: number;
  module_order: number;
  module_type: ModuleType;
};

export type HourLog = {
  id: string;
  student_id: string;
  module_id: string | null;
  hours: number;
  activity: HourActivity;
  service_performed: string | null;
  instructor_id: string | null;
  approved: boolean;
  logged_at: string;
  photo_evidence_url: string | null;
  student_name?: string;
};

export type SchoolHomeOverview = {
  activeCohorts: number;
  enrolledStudents: number;
  upcomingGraduations: { id: string; display_name: string; expected_graduation: string }[];
  stateBoardPassRate: number | null;
};

export type StudentBoardPrep = {
  questionsAnswered: number;
  totalQuestions: number;
  percentComplete: number;
  readinessPercent: number;
  weakestCategory: string | null;
};

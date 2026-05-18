export const SCHOOL_DASHBOARD_NAV = [
  { href: "/dashboard/school/home", label: "Overview" },
  { href: "/dashboard/school/cohorts", label: "Cohorts" },
  { href: "/dashboard/school/students", label: "Students" },
  { href: "/dashboard/school/syllabus", label: "Syllabus" },
  { href: "/dashboard/school/hours", label: "Hours" },
  { href: "/dashboard/school/instructors", label: "Instructors" },
  { href: "/dashboard/school/settings", label: "Settings" },
] as const;

export const STUDENT_SCHOOL_NAV = [
  { href: "/dashboard/student/home", label: "My progress" },
  { href: "/dashboard/student/state-board-prep", label: "State board prep" },
  { href: "/dashboard/messages", label: "Messages" },
] as const;

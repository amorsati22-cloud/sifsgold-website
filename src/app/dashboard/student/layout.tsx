import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { STUDENT_SCHOOL_NAV } from "@/lib/schools/nav";
import { requireEnrolledStudent } from "@/lib/schools/require-student";

export default async function StudentSchoolLayout({ children }: { children: React.ReactNode }) {
  await requireEnrolledStudent();

  return (
    <DashboardShell
      title="My program"
      description="Track your hours, classes, and state board prep."
      nav={[...STUDENT_SCHOOL_NAV]}
    >
      {children}
    </DashboardShell>
  );
}

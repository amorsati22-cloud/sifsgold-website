import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SCHOOL_DASHBOARD_NAV } from "@/lib/schools/nav";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export default async function SchoolDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSchoolDashboardUser();

  return (
    <DashboardShell
      title="School dashboard"
      description="Manage cohorts, students, syllabus, and state board prep — FERPA-conscious access controls."
      nav={[...SCHOOL_DASHBOARD_NAV]}
    >
      {children}
    </DashboardShell>
  );
}

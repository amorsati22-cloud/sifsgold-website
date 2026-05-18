import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdvocateProfileEditor } from "@/components/advocates/AdvocateProfileEditor";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

export default async function AdvocateProfilePage() {
  const { advocate } = await requireAdvocateDashboard();

  return (
    <DashboardShell
      title="Advocate profile"
      description="Public-facing bio and specialties shown to Gold Partners."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <AdvocateProfileEditor
        displayName={advocate?.display_name ?? ""}
        bio={advocate?.bio ?? ""}
        specialtyTags={advocate?.specialty_tags ?? advocate?.specialties ?? []}
        sampleUrls={advocate?.sample_content_urls ?? []}
        featured={Boolean(advocate?.featured)}
      />
    </DashboardShell>
  );
}

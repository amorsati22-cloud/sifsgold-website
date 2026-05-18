import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireProDashboardUser } from "@/lib/dashboard";
import { VIDEO_CALLS_NAV } from "@/lib/video-calls/nav";

export default async function VideoCallsLayout({ children }: { children: React.ReactNode }) {
  await requireProDashboardUser();

  return (
    <DashboardShell
      title="Video calls"
      description="1:1 consultations, group classes, and brand meetings — powered by Daily.co. HIPAA-conscious: disable recording for medical consults."
      nav={[...VIDEO_CALLS_NAV]}
    >
      {children}
    </DashboardShell>
  );
}

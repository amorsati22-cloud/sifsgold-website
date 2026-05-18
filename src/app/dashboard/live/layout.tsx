import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireStreamerDashboardUser } from "@/lib/streaming/require-streamer";
import { LIVE_STREAM_NAV } from "@/lib/streaming/nav";

export default async function LiveDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireStreamerDashboardUser();
  return (
    <DashboardShell title="Live streaming" description="Broadcast tutorials, launches, and events. Tips pay out via Stripe Connect." nav={[...LIVE_STREAM_NAV]}>
      {children}
    </DashboardShell>
  );
}

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PostComposer } from "@/components/advocate-feed/PostComposer";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

export default async function NewAdvocatePostPage() {
  const { supabase, user } = await requireAdvocateDashboard();

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("campaign:brand_campaigns(id, title, campaign_type, compensation_type)")
    .eq("advocate_id", user.id)
    .eq("status", "accepted");

  const brandDeals =
    applications?.flatMap((a) => {
      const c = a.campaign as Record<string, string> | null;
      if (!c?.id) return [];
      return [
        {
          id: c.id,
          title: c.title,
          campaign_type: c.campaign_type,
          compensation_type: c.compensation_type,
        },
      ];
    }) ?? [];

  return (
    <DashboardShell
      title="New post"
      description="Submit for admin review. Brand-partner posts require a linked deal and auto-include FTC disclosure."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <PostComposer brandDeals={brandDeals} />
    </DashboardShell>
  );
}

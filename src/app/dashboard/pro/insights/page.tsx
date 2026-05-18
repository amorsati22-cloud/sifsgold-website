import type { Metadata } from "next";
import { InsightsPanel } from "@/components/pro-ops/InsightsPanel";
import { requireProDashboardUser } from "@/lib/dashboard";
import { getProInsights } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Insights",
  robots: { index: false, follow: false },
};

export default async function ProInsightsPage() {
  const { user } = await requireProDashboardUser();
  const insights = await getProInsights(user.id);

  return <InsightsPanel insights={insights} />;
}

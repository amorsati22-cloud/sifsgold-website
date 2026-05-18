import type { Metadata } from "next";
import { BusinessSettingsForm } from "@/components/pro-ops/BusinessSettingsForm";
import { requireProDashboardUser } from "@/lib/dashboard";
import { getProBusinessSettings } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Business settings",
  robots: { index: false, follow: false },
};

export default async function ProBusinessPage() {
  const { user } = await requireProDashboardUser();
  const settings = await getProBusinessSettings(user.id);

  return <BusinessSettingsForm initial={settings} />;
}

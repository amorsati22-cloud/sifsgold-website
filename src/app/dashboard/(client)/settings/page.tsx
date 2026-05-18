import type { Metadata } from "next";
import { ClientSettingsForm } from "@/components/client-dashboard/ClientSettingsForm";
import { getClientSettings } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function ClientSettingsPage() {
  const { user, profile } = await requireClientDashboardUser();
  const settings = await getClientSettings(user.id);

  if (!settings) {
    return <p className="font-body text-gold-body">Settings unavailable.</p>;
  }

  const displayName = (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <ClientSettingsForm
      settings={settings}
      email={user.email ?? ""}
      displayName={displayName}
    />
  );
}

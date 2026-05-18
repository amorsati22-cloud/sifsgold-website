import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { HealthHubSettingsForm } from "@/components/health-hub/HealthHubSettingsForm";
import { getHealthSettings, getHealthUser } from "@/lib/health-hub/data";
import { redirect } from "next/navigation";

export default async function HealthHubSettingsPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const settings = await getHealthSettings(user.id);
  if (!settings) redirect("/dashboard/health-hub");

  return (
    <HealthHubProtected>
      <HealthHubSettingsForm settings={settings} />
    </HealthHubProtected>
  );
}

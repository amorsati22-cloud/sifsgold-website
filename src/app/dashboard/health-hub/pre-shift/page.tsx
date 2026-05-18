import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { PreShiftRitual } from "@/components/health-hub/PreShiftRitual";
import { getHealthHubOverview, getHealthUser } from "@/lib/health-hub/data";

export default async function PreShiftPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const overview = await getHealthHubOverview(user.id);
  const sessionNumber = overview.todayRitualCount + 1;

  return (
    <HealthHubProtected>
      <PreShiftRitual sessionNumber={sessionNumber} />
    </HealthHubProtected>
  );
}

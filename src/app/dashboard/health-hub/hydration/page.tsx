import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { HydrationPanel } from "@/components/health-hub/HydrationPanel";
import {
  getHealthHubOverview,
  getHealthSettings,
  getHealthUser,
  getHydrationLogs,
} from "@/lib/health-hub/data";
import { HYDRATION_GOAL_DEFAULT } from "@/lib/health-hub/constants";

export default async function HydrationPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const [logs, overview, settings] = await Promise.all([
    getHydrationLogs(user.id, 14),
    getHealthHubOverview(user.id),
    getHealthSettings(user.id),
  ]);

  const goalOz = settings?.hydration_goal_oz ?? HYDRATION_GOAL_DEFAULT;

  return (
    <HealthHubProtected>
    <HydrationPanel
      logs={logs}
      todayOz={overview.todayHydrationOz}
      goalOz={Number(goalOz)}
    />
    </HealthHubProtected>
  );
}

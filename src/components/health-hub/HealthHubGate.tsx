import type { ReactNode } from "react";
import { getHealthSettings, requireHealthAccess } from "@/lib/health-hub/data";
import { getHealthUser } from "@/lib/health-hub/data";
import { OptInScreen } from "@/components/health-hub/OptInScreen";
import { ReauthGate } from "@/components/health-hub/ReauthGate";

export async function HealthHubGate({ children }: { children: ReactNode }) {
  const { user } = await getHealthUser();
  if (!user) return null;

  const settings = await getHealthSettings(user.id);
  const access = await requireHealthAccess(settings);

  if (access.needsOptIn) {
    return <OptInScreen />;
  }

  return <ReauthGate needsReauth={access.needsReauth}>{children}</ReauthGate>;
}

import type { ReactNode } from "react";
import { HealthHubGate } from "@/components/health-hub/HealthHubGate";

export function HealthHubProtected({ children }: { children: ReactNode }) {
  return <HealthHubGate>{children}</HealthHubGate>;
}

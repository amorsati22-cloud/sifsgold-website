import type { Metadata } from "next";
import { HealthHubShell } from "@/components/health-hub/HealthHubShell";

export const metadata: Metadata = {
  title: "Health Hub",
  robots: { index: false, follow: false },
};

export default function HealthHubLayout({ children }: { children: React.ReactNode }) {
  return <HealthHubShell>{children}</HealthHubShell>;
}

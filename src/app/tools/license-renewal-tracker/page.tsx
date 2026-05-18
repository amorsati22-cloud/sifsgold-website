import { LicenseRenewalClient } from "@/components/tools/LicenseRenewalClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("license-renewal-tracker");

export default function Page() {
  return (
    <ToolPageShell slug="license-renewal-tracker" title="License renewal tracker" description="Expiration countdown, CE hours, and reminder windows by state.">
      <LicenseRenewalClient />
    </ToolPageShell>
  );
}

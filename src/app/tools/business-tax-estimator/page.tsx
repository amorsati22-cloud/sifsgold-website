import { BusinessTaxClient } from "@/components/tools/BusinessTaxClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("business-tax-estimator");

export default function Page() {
  return (
    <ToolPageShell slug="business-tax-estimator" title="Business tax estimator" description="Quarterly self-employment tax estimate — not tax advice.">
      <BusinessTaxClient />
    </ToolPageShell>
  );
}

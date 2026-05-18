import { PricingStrategyClient } from "@/components/tools/PricingStrategyClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("pricing-strategy");

export default function Page() {
  return (
    <ToolPageShell slug="pricing-strategy" title="Pricing strategy" description="Market range and starting price from experience, location tier, and specialty.">
      <PricingStrategyClient />
    </ToolPageShell>
  );
}

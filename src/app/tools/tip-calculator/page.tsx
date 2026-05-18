import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { TipCalculatorClient } from "@/components/tools/TipCalculatorClient";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("tip-calculator");

export default function TipCalculatorPage() {
  return (
    <ToolPageShell
      slug="tip-calculator"
      title="Tip calculator"
      description="Service total, tip percentage, and per-person take-home when splitting across the team."
    >
      <TipCalculatorClient />
    </ToolPageShell>
  );
}

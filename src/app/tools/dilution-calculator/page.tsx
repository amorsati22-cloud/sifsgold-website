import { DilutionCalculatorClient } from "@/components/tools/DilutionCalculatorClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("dilution-calculator");

export default function Page() {
  return (
    <ToolPageShell slug="dilution-calculator" title="Dilution calculator" description="Dilute chemicals to a target strength with common presets.">
      <DilutionCalculatorClient />
    </ToolPageShell>
  );
}

import { TimingCalculatorClient } from "@/components/tools/TimingCalculatorClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("timing-calculator");

export default function Page() {
  return (
    <ToolPageShell slug="timing-calculator" title="Timing calculator" description="Stack services, buffers, and calendar block length.">
      <TimingCalculatorClient />
    </ToolPageShell>
  );
}

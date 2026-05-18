import { ColorFormulaClient } from "@/components/tools/ColorFormulaClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("color-formula");

export default function Page() {
  return (
    <ToolPageShell slug="color-formula" title="Color formula" description="Mixing ratio and processing time by developer volume.">
      <ColorFormulaClient />
    </ToolPageShell>
  );
}

import { StateBoardCountdownClient } from "@/components/tools/StateBoardCountdownClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("state-board-countdown");

export default function Page() {
  return (
    <ToolPageShell slug="state-board-countdown" title="State board countdown" description="Days until your exam and a daily study hour target.">
      <StateBoardCountdownClient />
    </ToolPageShell>
  );
}

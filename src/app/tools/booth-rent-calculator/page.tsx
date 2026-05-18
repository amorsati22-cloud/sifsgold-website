import { BoothRentClient } from "@/components/tools/BoothRentClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("booth-rent-calculator");

export default function Page() {
  return (
    <ToolPageShell slug="booth-rent-calculator" title="Booth rent vs commission" description="See which model wins at your expected monthly gross.">
      <BoothRentClient />
    </ToolPageShell>
  );
}

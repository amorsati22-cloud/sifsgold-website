import { AppointmentRoiClient } from "@/components/tools/AppointmentRoiClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("appointment-roi");

export default function Page() {
  return (
    <ToolPageShell slug="appointment-roi" title="Appointment ROI" description="Net profit per hour for each service on your menu.">
      <AppointmentRoiClient />
    </ToolPageShell>
  );
}

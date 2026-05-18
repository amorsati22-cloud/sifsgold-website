import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { MedicationsPanel } from "@/components/health-hub/MedicationsPanel";
import { getHealthUser, getMedicationLogs, getMedications } from "@/lib/health-hub/data";

export default async function MedicationsPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const [medications, logs] = await Promise.all([
    getMedications(user.id),
    getMedicationLogs(user.id, 30),
  ]);

  return (
    <HealthHubProtected>
      <MedicationsPanel medications={medications} logs={logs} />
    </HealthHubProtected>
  );
}

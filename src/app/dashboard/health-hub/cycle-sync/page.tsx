import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { CycleCalendar } from "@/components/health-hub/CycleCalendar";
import { CycleSyncForm } from "@/components/health-hub/CycleSyncForm";
import { CYCLE_DISCLAIMER } from "@/lib/health-hub/constants";
import { getCycleLogs, getHealthUser } from "@/lib/health-hub/data";

export default async function CycleSyncPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const logs = await getCycleLogs(user.id);
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find((l) => l.log_date === today);

  return (
    <HealthHubProtected>
    <div className="space-y-8">
      <p className="rounded-brand-md border border-gold/20 bg-navy-deep/80 p-4 font-body text-sm text-cream/85">
        {CYCLE_DISCLAIMER}
      </p>

      {todayLog?.phase ? (
        <p className="font-body text-sm text-gold">
          Today&apos;s phase: <span className="capitalize">{todayLog.phase.replace("_", " ")}</span>
        </p>
      ) : null}

      <CycleSyncForm today={today} />
      <CycleCalendar logs={logs} />
    </div>
    </HealthHubProtected>
  );
}

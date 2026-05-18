import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { DisclaimerBanner } from "@/components/health-hub/DisclaimerBanner";
import { DailyPulseForm } from "@/components/health-hub/DailyPulseForm";
import { PulseTrendChart } from "@/components/health-hub/PulseTrendChart";
import { correlateSleepWithEnergy } from "@/lib/health-hub/insights-engine";
import { getDailyPulseLogs, getHealthUser } from "@/lib/health-hub/data";

export default async function DailyPulsePage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const logs = await getDailyPulseLogs(user.id, 30);
  const insight = correlateSleepWithEnergy(logs);

  return (
    <HealthHubProtected>
    <div className="space-y-8">
      <DisclaimerBanner />
      <DailyPulseForm />
      <section aria-labelledby="pulse-trend-heading">
        <h2 id="pulse-trend-heading" className="font-heading text-lg text-gold">
          Last 30 days
        </h2>
        <div className="mt-4">
          <PulseTrendChart logs={logs} />
        </div>
      </section>
      {insight ? (
        <aside className="rounded-brand-md border border-teal/30 bg-teal/5 p-4" role="note">
          <p className="font-body text-sm font-semibold text-teal">{insight.title}</p>
          <p className="mt-1 font-body text-sm text-cream/85">{insight.body}</p>
          <p className="mt-2 font-body text-xs text-goldBody">
            Pattern insight from your own logs — not medical advice.
          </p>
        </aside>
      ) : null}
    </div>
    </HealthHubProtected>
  );
}

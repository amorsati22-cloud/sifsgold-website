import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { getHealthInsights, getHealthUser } from "@/lib/health-hub/data";

export default async function InsightsPage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const insights = await getHealthInsights(user.id);

  return (
    <HealthHubProtected>
    <div className="space-y-6">
      <p className="font-body text-sm text-cream/80">
        Patterns calculated from your own data — no AI inference, no sharing with partners.
      </p>

      {insights.length === 0 ? (
        <p className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6 font-body text-sm text-cream/70">
          Log more check-ins across Daily Pulse, Hydration, and Pre-shift Ritual to see cross-tracker
          insights here.
        </p>
      ) : (
        <ul className="space-y-4">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-5"
            >
              <p className="font-heading text-gold">{insight.title}</p>
              <p className="mt-2 font-body text-sm text-cream/85">{insight.body}</p>
              <p className="mt-2 font-body text-xs text-goldBody">
                Wellness awareness only — talk to your healthcare provider for medical decisions.
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </HealthHubProtected>
  );
}

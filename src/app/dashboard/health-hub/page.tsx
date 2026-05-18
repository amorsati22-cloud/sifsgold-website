import Link from "next/link";
import { HealthHubProtected } from "@/components/health-hub/HealthHubProtected";
import { DisclaimerBanner } from "@/components/health-hub/DisclaimerBanner";
import { TrackerCard } from "@/components/health-hub/TrackerCard";
import { getHealthHubOverview, getHealthUser } from "@/lib/health-hub/data";
import { PRIVACY_REMINDER } from "@/lib/health-hub/constants";
import { GoldButton } from "@/components/ui/GoldButton";

export default async function HealthHubHomePage() {
  const { user } = await getHealthUser();
  if (!user) return null;

  const overview = await getHealthHubOverview(user.id);
  const s = overview.settings;

  return (
    <HealthHubProtected>
    <div className="space-y-8">
      <DisclaimerBanner />

      <p className="font-body text-sm text-goldBody">{PRIVACY_REMINDER}</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-gold">Today</h2>
          <p className="mt-1 font-body text-sm text-cream/75">
            {overview.todayPulse
              ? `Last check-in: energy ${overview.todayPulse.energy_level}/10`
              : "No daily check-in yet"}
          </p>
        </div>
        <GoldButton
          label="Start daily check-in"
          href="/dashboard/health-hub/daily-pulse"
          variant="solid"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {s?.daily_pulse_enabled !== false ? (
          <TrackerCard
            title="Daily Pulse"
            href="/dashboard/health-hub/daily-pulse"
            status={overview.todayPulse ? "Logged" : "Open"}
          >
            {overview.todayPulse
              ? `Mood: ${overview.todayPulse.mood_label} · Energy ${overview.todayPulse.energy_level}/10`
              : "Log mood, energy, and sleep"}
          </TrackerCard>
        ) : null}

        {s?.hydration_tracker_enabled ? (
          <TrackerCard
            title="Hydration"
            href="/dashboard/health-hub/hydration"
            status={`${Math.round(overview.todayHydrationOz)} oz`}
          >
            Goal: {s.hydration_goal_oz} oz/day
          </TrackerCard>
        ) : null}

        {s?.medication_tracker_enabled ? (
          <TrackerCard
            title="Medications"
            href="/dashboard/health-hub/medications"
            status={
              overview.medicationsDue > 0
                ? `${overview.medicationsDue} due`
                : "Up to date"
            }
          >
            {overview.medicationsTakenToday} logged today
          </TrackerCard>
        ) : null}

        {s?.preshift_ritual_enabled ? (
          <TrackerCard
            title="Pre-shift Ritual"
            href="/dashboard/health-hub/pre-shift"
            status={
              overview.latestRitualComplete
                ? "Complete"
                : overview.todayRitualCount > 0
                  ? "In progress"
                  : "Not started"
            }
          >
            Today&apos;s ritual #{overview.todayRitualCount + (overview.latestRitualComplete ? 0 : 1)}
          </TrackerCard>
        ) : null}

        {s?.cycle_sync_enabled ? (
          <TrackerCard title="Cycle Sync" href="/dashboard/health-hub/cycle-sync">
            Wellness tracking — no fertility prediction
          </TrackerCard>
        ) : null}
      </div>

      <p className="font-body text-sm text-cream/70">
        <Link
          href="/dashboard/health-hub/insights"
          className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          View cross-tracker insights
        </Link>
        {" · "}
        <Link
          href="/dashboard/health-hub/settings"
          className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Settings
        </Link>
      </p>
    </div>
    </HealthHubProtected>
  );
}

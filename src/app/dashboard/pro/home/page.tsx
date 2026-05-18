import type { Metadata } from "next";
import { endOfDay, startOfDay, addDays } from "date-fns";
import { ProKpiCards } from "@/components/pro-ops/ProKpiCards";
import { ProQuickActions } from "@/components/pro-ops/ProQuickActions";
import { ProTodayTimeline } from "@/components/pro-ops/ProTodayTimeline";
import { ProWeekPreview } from "@/components/pro-ops/ProWeekPreview";
import { getDashboardProProfile, requireProDashboardUser } from "@/lib/dashboard";
import { getProAppointments, getProTodayKpis } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Pro home",
  robots: { index: false, follow: false },
};

export default async function ProHomePage() {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);
  const timezone = (profile as { timezone?: string } | null)?.timezone ?? "America/Chicago";

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekEnd = addDays(todayStart, 7);

  const [kpis, todayAppts, weekAppts] = await Promise.all([
    getProTodayKpis(user.id, timezone),
    getProAppointments(user.id, todayStart, todayEnd),
    getProAppointments(user.id, todayStart, weekEnd),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Today at a glance</h2>
        <ProKpiCards kpis={kpis} />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Quick actions</h2>
        <ProQuickActions />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Today&apos;s schedule</h2>
        <ProTodayTimeline appointments={todayAppts} timezone={timezone} />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Next 7 days</h2>
        <ProWeekPreview appointments={weekAppts} timezone={timezone} />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { HourApprovalList } from "@/components/schools/HourApprovalList";
import { getPendingHourLogs } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Hour logging",
  robots: { index: false, follow: false },
};

export default async function SchoolHoursPage() {
  const { school } = await requireSchoolDashboardUser();
  const pending = await getPendingHourLogs(school.id);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Pending approval</h2>
        <HourApprovalList schoolId={school.id} initialLogs={pending} />
      </section>
      <section className="rounded-brand-lg border border-gold/15 p-4">
        <h2 className="font-heading text-lg text-gold">Bulk class session</h2>
        <p className="mt-2 font-body text-sm text-gold-body">
          Use the API or cohort tools to bulk-log theory hours for an entire class. Individual clinic hours are submitted by students for approval.
        </p>
      </section>
    </div>
  );
}

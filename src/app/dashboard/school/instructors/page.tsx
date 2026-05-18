import type { Metadata } from "next";
import { getSchoolCohorts } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Instructors",
  robots: { index: false, follow: false },
};

export default async function SchoolInstructorsPage() {
  const { school, supabase } = await requireSchoolDashboardUser();
  const cohorts = await getSchoolCohorts(school.id);

  const { data: instructors } = await supabase
    .from("instructors")
    .select("*, profiles(full_name, email)")
    .eq("school_id", school.id);

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-gold-body">
        Invite instructors by email (coming soon). Assign instructors to cohorts from cohort settings.
      </p>
      <ul className="divide-y divide-gold/10 rounded-brand-lg border border-gold/15">
        {(instructors ?? []).map((i) => {
          const p = i.profiles as { full_name: string; email: string } | null;
          return (
            <li key={i.id as string} className="px-4 py-3 font-body text-sm text-cream">
              {p?.full_name ?? "Instructor"} · {p?.email} · {i.status as string}
            </li>
          );
        })}
      </ul>
      {cohorts.length > 0 ? (
        <p className="font-body text-xs text-gold-body">
          Active cohorts: {cohorts.map((c) => c.name).join(", ")}
        </p>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { NewCohortForm } from "@/components/schools/NewCohortForm";
import { getSchoolCohorts } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Cohorts",
  robots: { index: false, follow: false },
};

export default async function SchoolCohortsPage() {
  const { school } = await requireSchoolDashboardUser();
  const cohorts = await getSchoolCohorts(school.id);

  return (
    <div className="space-y-6">
      <NewCohortForm schoolId={school.id} defaultState={school.state} />
      <ul className="divide-y divide-gold/10 rounded-brand-lg border border-gold/15">
        {cohorts.map((c) => (
          <li key={c.id}>
            <Link
              href={`/dashboard/school/cohorts/${c.id}`}
              className="block px-4 py-4 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
            >
              <p className="font-body font-medium text-cream">{c.name}</p>
              <p className="font-body text-xs text-gold-body capitalize">
                {c.program_type} · {c.required_hours}h · {c.student_count ?? 0} students · {c.status}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

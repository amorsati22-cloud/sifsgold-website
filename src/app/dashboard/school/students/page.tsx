import type { Metadata } from "next";
import Link from "next/link";
import { getSchoolCohorts, getSchoolStudents } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Students",
  robots: { index: false, follow: false },
};

type Props = { searchParams: { cohort?: string; status?: string } };

export default async function SchoolStudentsPage({ searchParams }: Props) {
  const { school } = await requireSchoolDashboardUser();
  const [students, cohorts] = await Promise.all([
    getSchoolStudents(school.id, {
      cohortId: searchParams.cohort,
      status: searchParams.status ?? "enrolled",
    }),
    getSchoolCohorts(school.id),
  ]);

  return (
    <div className="space-y-6">
      <form className="flex flex-wrap gap-2">
        <select
          name="cohort"
          defaultValue={searchParams.cohort ?? ""}
          className="rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
        >
          <option value="">All cohorts</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-brand-sm border border-gold/30 px-3 py-2 text-sm text-gold">
          Filter
        </button>
      </form>

      <ul className="divide-y divide-gold/10 rounded-brand-lg border border-gold/15">
        {students.map((s) => (
          <li key={s.id}>
            <Link
              href={`/dashboard/school/students/${s.id}`}
              className="flex justify-between px-4 py-3 hover:bg-white/5"
            >
              <div>
                <p className="font-body text-cream">{s.display_name}</p>
                <p className="font-body text-xs text-gold-body">{s.cohort_name}</p>
              </div>
              <p className="font-body text-sm text-gold">{s.progress_percent}% · {s.hours_completed}h</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

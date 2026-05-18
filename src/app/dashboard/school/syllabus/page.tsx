import type { Metadata } from "next";
import Link from "next/link";
import { getSchoolCohorts } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Syllabus builder",
  robots: { index: false, follow: false },
};

export default async function SchoolSyllabusPage() {
  const { school } = await requireSchoolDashboardUser();
  const cohorts = await getSchoolCohorts(school.id);

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-gold-body">
        Syllabus modules are created per cohort. New cohorts auto-load state templates (e.g. Texas cosmetology 1500h).
        Reorder and edit modules on each cohort page.
      </p>
      <ul className="space-y-2">
        {cohorts.map((c) => (
          <li key={c.id}>
            <Link
              href={`/dashboard/school/cohorts/${c.id}`}
              className="block rounded-brand-sm border border-gold/15 px-4 py-3 font-body text-cream hover:text-gold"
            >
              {c.name} — edit modules →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

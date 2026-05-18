import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { SchoolKpiCards } from "@/components/schools/SchoolKpiCards";
import { getSchoolHomeOverview } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "School overview",
  robots: { index: false, follow: false },
};

export default async function SchoolHomePage() {
  const { school } = await requireSchoolDashboardUser();
  const overview = await getSchoolHomeOverview(school.id);

  const kpis = [
    { label: "Active cohorts", value: String(overview.activeCohorts) },
    { label: "Students enrolled", value: String(overview.enrolledStudents) },
    {
      label: "Graduations (60d)",
      value: String(overview.upcomingGraduations.length),
    },
    {
      label: "Board pass rate",
      value: overview.stateBoardPassRate != null ? `${overview.stateBoardPassRate}%` : "—",
    },
  ];

  return (
    <div className="space-y-10">
      <SchoolKpiCards kpis={kpis} />
      <section>
        <h2 className="mb-3 font-heading text-xl text-gold">Upcoming graduations</h2>
        <ul className="space-y-2 font-body text-sm">
          {overview.upcomingGraduations.length === 0 ? (
            <li className="text-gold-body">None in the next 60 days.</li>
          ) : (
            overview.upcomingGraduations.map((g) => (
              <li key={g.id} className="text-cream">
                <Link href={`/dashboard/school/students/${g.id}`} className="hover:text-gold">
                  {g.display_name}
                </Link>
                <span className="text-gold-body">
                  {" "}
                  — {format(parseISO(g.expected_graduation), "MMM d, yyyy")}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CohortCommunicateForm } from "@/components/schools/CohortCommunicateForm";
import { getCohortDetail } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "Cohort detail",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } };

export default async function CohortDetailPage({ params }: Props) {
  const { school } = await requireSchoolDashboardUser();
  const detail = await getCohortDetail(params.id);
  if (!detail || detail.cohort.school_id !== school.id) notFound();

  const { cohort, students, modules } = detail;

  return (
    <div className="space-y-8">
      <nav className="font-body text-sm text-gold-body">
        <Link href="/dashboard/school/cohorts" className="hover:text-gold">
          Cohorts
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">{cohort.name}</span>
      </nav>

      <header>
        <h1 className="font-heading text-2xl text-gold">{cohort.name}</h1>
        <p className="mt-1 font-body text-sm capitalize text-gold-body">
          {cohort.program_type} · {cohort.state} · {cohort.required_hours} required hours
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Roster</h2>
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s.id} className="rounded-brand-sm border border-gold/10 px-4 py-3">
              <Link href={`/dashboard/school/students/${s.id}`} className="font-body text-cream hover:text-gold">
                {s.display_name}
              </Link>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy">
                <div className="h-full bg-gold" style={{ width: `${s.progress_percent ?? 0}%` }} />
              </div>
              <p className="mt-1 font-body text-xs text-gold-body">
                {s.hours_completed}h / {cohort.required_hours}h
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Syllabus modules</h2>
        <ul className="font-body text-sm text-cream/80">
          {modules.map((m) => (
            <li key={m.id}>
              {m.name} — {m.required_hours}h ({m.module_type})
            </li>
          ))}
        </ul>
      </section>

      <CohortCommunicateForm schoolId={school.id} cohortId={cohort.id} />
    </div>
  );
}

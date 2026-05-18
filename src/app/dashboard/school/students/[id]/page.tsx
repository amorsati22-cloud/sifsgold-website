import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentDetail } from "@/lib/schools/data";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";
import { CATEGORY_LABELS } from "@/lib/state-board/constants";
import type { QuestionCategory } from "@/types/state-board";

export const metadata: Metadata = {
  title: "Student profile",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } };

export default async function SchoolStudentDetailPage({ params }: Props) {
  const { school } = await requireSchoolDashboardUser();
  const detail = await getStudentDetail(params.id);
  if (!detail || detail.student.school_id !== school.id) notFound();

  const { student, cohort, modules, hourLogs, boardPrep } = detail;

  return (
    <div className="space-y-8">
      <nav className="font-body text-sm text-gold-body">
        <Link href="/dashboard/school/students" className="hover:text-gold">
          Students
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">{student.display_name}</span>
      </nav>

      <header>
        <h1 className="font-heading text-2xl text-gold">{student.display_name}</h1>
        <p className="font-body text-sm text-gold-body">
          {cohort.name} · {student.hours_completed}h / {cohort.required_hours}h ({student.progress_percent}%)
        </p>
      </header>

      <section className="rounded-brand-lg border border-gold/15 p-4">
        <h2 className="font-heading text-lg text-gold">State board prep</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          {boardPrep.questionsAnswered} / {boardPrep.totalQuestions} questions practiced (
          {boardPrep.percentComplete}%)
        </p>
        <p className="font-body text-sm text-gold">Readiness estimate: {boardPrep.readinessPercent}%</p>
        {boardPrep.weakestCategory ? (
          <p className="mt-1 font-body text-xs text-gold-body">
            Weak area: {CATEGORY_LABELS[boardPrep.weakestCategory as QuestionCategory] ?? boardPrep.weakestCategory}
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Hours by module</h2>
        <ul className="space-y-2 font-body text-sm">
          {modules.map((m) => (
            <li key={m.id} className="flex justify-between text-cream/80">
              <span>{m.name}</span>
              <span>{m.required_hours}h required</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Clinic & hour log</h2>
        <ul className="max-h-64 space-y-2 overflow-y-auto font-body text-xs text-gold-body">
          {hourLogs.map((l) => (
            <li key={l.id}>
              {l.hours}h · {l.activity} · {l.approved ? "approved" : "pending"} ·{" "}
              {new Date(l.logged_at).toLocaleDateString()}
              {l.service_performed ? ` · ${l.service_performed}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

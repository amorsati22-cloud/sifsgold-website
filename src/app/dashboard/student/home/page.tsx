import type { Metadata } from "next";
import Link from "next/link";
import { StudentHourLogForm } from "@/components/schools/StudentHourLogForm";
import { getStudentBoardPrep } from "@/lib/schools/data";
import { requireEnrolledStudent } from "@/lib/schools/require-student";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My progress",
  robots: { index: false, follow: false },
};

export default async function StudentHomePage() {
  const { student, cohort, school } = await requireEnrolledStudent();
  const supabase = await createClient();
  const boardPrep = await getStudentBoardPrep(student.id, cohort.state, cohort.program_type);

  const { data: modules } = await supabase!
    .from("syllabus_modules")
    .select("*")
    .eq("cohort_id", cohort.id)
    .order("module_order", { ascending: true });

  const progress = cohort.required_hours
    ? Math.min(100, Math.round((student.hours_completed / cohort.required_hours) * 100))
    : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/40 p-6">
        <h2 className="font-heading text-xl text-gold">{school.name}</h2>
        <p className="mt-1 font-body text-sm text-cream/80">{cohort.name}</p>
        <p className="mt-4 font-heading text-3xl text-gold">{progress}%</p>
        <p className="font-body text-sm text-gold-body">
          {student.hours_completed} of {cohort.required_hours} hours toward graduation
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-navy">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-brand-lg border border-gold/15 p-4">
          <h3 className="font-heading text-lg text-gold">State board prep</h3>
          <p className="mt-2 font-body text-sm text-gold-body">
            {boardPrep.percentComplete}% of question bank practiced
          </p>
          <Link
            href="/dashboard/student/state-board-prep"
            className="mt-3 inline-block font-body text-sm text-gold hover:underline"
          >
            Practice now →
          </Link>
        </div>
        <div className="rounded-brand-lg border border-gold/15 p-4">
          <h3 className="font-heading text-lg text-gold">Messages</h3>
          <p className="mt-2 font-body text-sm text-gold-body">Notes from instructors</p>
          <Link href="/dashboard/messages" className="mt-3 inline-block font-body text-sm text-gold hover:underline">
            Open inbox →
          </Link>
        </div>
      </section>

      <StudentHourLogForm
        modules={(modules ?? []).map((m) => ({
          id: m.id as string,
          cohort_id: m.cohort_id as string,
          name: m.name as string,
          description: m.description as string | null,
          required_hours: Number(m.required_hours),
          module_order: Number(m.module_order),
          module_type: m.module_type as "theory",
        }))}
      />
    </div>
  );
}

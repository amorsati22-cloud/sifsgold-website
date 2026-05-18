import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CareerPlanChecklist } from "@/components/career-paths/CareerPlanChecklist";
import { SalaryBlock } from "@/components/career-paths/SalaryBlock";
import { END_ROLE_LABELS, STARTING_POINT_LABELS } from "@/lib/career-paths/constants";
import {
  getCareerUser,
  getPathWithDetails,
  getRole,
  getUserCareerInterests,
  listRoles,
} from "@/lib/career-paths/data";

export const metadata: Metadata = {
  title: "Career plan",
  robots: { index: false, follow: false },
};

export default async function CareerPlanPage() {
  const { user } = await getCareerUser();
  if (!user) redirect("/sign-in?next=/dashboard/career-plan");

  const interests = await getUserCareerInterests(user.id);
  const savedPath = interests?.saved_path_id
    ? await getPathWithDetails(interests.saved_path_id)
    : null;
  const targetRole = interests?.target_role ? await getRole(interests.target_role) : null;
  const quizRoles = interests?.interested_roles?.length
    ? (await Promise.all(interests.interested_roles.map((id) => getRole(id)))).filter(Boolean)
    : [];
  const allRoles = await listRoles();

  return (
    <div className="mx-auto max-w-content space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl text-gold md:text-3xl">Your career plan</h1>
        <p className="mt-2 font-body text-sm text-cream/80">
          Saved paths, milestone checklists, and links to study tools for your current step.
        </p>
      </div>

      {!interests?.saved_path_id && !targetRole && quizRoles.length === 0 ? (
        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
          <p className="text-cream/85">No saved career plan yet.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/career-paths"
              className="text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Explore career paths →
            </Link>
            <Link
              href="/career-paths/quiz"
              className="text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Take the career quiz →
            </Link>
          </div>
        </section>
      ) : null}

      {savedPath ? (
        <section className="space-y-6 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
          <div>
            <h2 className="font-heading text-lg text-gold">Saved path</h2>
            <p className="mt-1 font-medium text-cream">{savedPath.name}</p>
            <p className="mt-2 text-sm text-cream/75">{savedPath.description}</p>
            <p className="mt-2 text-xs text-goldBody">
              {STARTING_POINT_LABELS[savedPath.starting_point]} →{" "}
              {END_ROLE_LABELS[savedPath.end_role]} · ~{savedPath.estimated_total_years} years ·
              est. ${savedPath.estimated_total_investment.toLocaleString()} investment
            </p>
            <Link
              href={`/career-paths/${savedPath.id}`}
              className="mt-3 inline-block text-sm text-gold hover:underline"
            >
              Open interactive map →
            </Link>
          </div>

          <CareerPlanChecklist
            milestones={savedPath.milestones}
            progress={interests?.milestone_progress ?? {}}
          />
        </section>
      ) : null}

      {targetRole ? (
        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
          <h2 className="font-heading text-lg text-gold">Target role</h2>
          <div className="mt-4 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-heading text-xl text-cream">{targetRole.name}</p>
              <p className="mt-2 text-sm text-cream/80">{targetRole.description}</p>
              <Link
                href={`/career-paths/roles/${targetRole.id}`}
                className="mt-3 inline-block text-sm text-gold hover:underline"
              >
                Role details →
              </Link>
            </div>
            <SalaryBlock role={targetRole} />
          </div>
        </section>
      ) : null}

      {quizRoles.length > 0 ? (
        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
          <h2 className="font-heading text-lg text-gold">Quiz matches</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-cream/85">
            {quizRoles.map((r) =>
              r ? (
                <li key={r.id}>
                  <Link href={`/career-paths/roles/${r.id}`} className="text-gold hover:underline">
                    {r.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
        <h2 className="font-heading text-lg text-gold">Study & licensure tools</h2>
        <p className="mt-2 text-sm text-cream/75">
          Use these while you work through school, exams, and continuing education milestones.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          <li>
            <Link href="/study-guides" className="text-gold hover:underline">
              Study guides & flashcards
            </Link>
          </li>
          <li>
            <Link href="/state-board-prep" className="text-gold hover:underline">
              State board prep
            </Link>
          </li>
          <li>
            <Link href="/dashboard/study-progress" className="text-gold hover:underline">
              Study progress dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/state-board-progress" className="text-gold hover:underline">
              State board progress
            </Link>
          </li>
          <li>
            <Link href="/dashboard/salon/home" className="text-gold hover:underline">
              School / salon dashboard
            </Link>
          </li>
        </ul>
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy-deep/50 p-6">
        <h2 className="font-heading text-lg text-gold">All roles</h2>
        <p className="mt-2 text-sm text-cream/70">
          {allRoles.length} roles with BLS median salary estimates — browse by category on the roles
          page.
        </p>
        <Link href="/career-paths/roles" className="mt-3 inline-block text-sm text-gold hover:underline">
          Browse roles →
        </Link>
      </section>
    </div>
  );
}

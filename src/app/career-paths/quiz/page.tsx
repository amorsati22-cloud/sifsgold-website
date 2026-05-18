import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CareerQuiz } from "@/components/career-paths/CareerQuiz";
import { listRoles } from "@/lib/career-paths/data";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Career match quiz",
  description:
    "Ten questions to surface beauty career roles that fit your interests — explore multiple paths, not one prescribed route.",
  alternates: { canonical: `${BRAND.url}/career-paths/quiz` },
};

export default async function CareerQuizPage() {
  const roles = await listRoles();

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
          { name: "Career quiz", href: "/career-paths/quiz" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold">Career match quiz</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Answer 10 quick questions about what energizes you. We&apos;ll recommend up to five roles
            with BLS median salary context — then you can explore several valid paths.
          </p>
          <Link href="/career-paths" className="mt-4 inline-block text-sm text-gold hover:underline">
            ← Back to path explorer
          </Link>
        </div>
      </header>

      <section className="py-12">
        <div className="mx-auto max-w-xl px-4 sm:px-6 md:px-8">
          <CareerQuiz roles={roles} />
        </div>
      </section>
    </article>
  );
}

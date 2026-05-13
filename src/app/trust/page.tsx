import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Shield, Sparkles, Users } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Trust Center",
  description: "Privacy-first, industry-built, inclusive design — how Sif's Gold earns trust.",
  alternates: { canonical: `${BRAND.url}/trust` },
};

const pillars = [
  {
    title: "Privacy-first",
    body: "Least-privilege access, clear consent on sensitive records, and encryption where it matters. We do not sell attention or build ad profiles from your client list.",
    icon: Shield,
  },
  {
    title: "Industry-built",
    body: "Workflows are co-designed with Sif's Advocates and Gold Partners who live the Tuesday — not generic marketplaces bolted onto beauty later.",
    icon: Users,
  },
  {
    title: "Inclusive by design",
    body: "Masculine, feminine, and non-binary experiences stay first-class across beauty, grooming, fitness, and fashion — accessibility is a launch requirement, not a stretch goal.",
    icon: Sparkles,
  },
] as const;

export default function TrustCenterPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Trust", href: "/trust" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">
            Privacy-first. Industry-built. Inclusive by design.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-cream/88">
            Trust is operational: how we encrypt, how we authenticate money movement, how we moderate content, and how we
            report on government requests. Start here, then read the deeper briefs.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
                  <div className="mb-3 inline-flex rounded-full border border-gold/40 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="font-heading text-xl text-gold">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Deep dives</h2>
          <ul className="mt-6 list-none space-y-3 p-0 text-sm">
            <li>
              <Link href="/security" className="font-semibold text-gold underline-offset-4 hover:underline">
                Security overview
              </Link>{" "}
              — encryption, authentication, payments, infrastructure.
            </li>
            <li>
              <Link href="/compliance" className="font-semibold text-gold underline-offset-4 hover:underline">
                Compliance roadmap
              </Link>{" "}
              — SOC 2 readiness, HIPAA posture for med spa workflows, privacy laws, youth safety, and endorsement transparency.
            </li>
            <li>
              <Link href="/transparency" className="font-semibold text-gold underline-offset-4 hover:underline">
                Transparency reporting
              </Link>{" "}
              — how we will publish government requests, moderation stats, and DMCA volume.
            </li>
            <li>
              <Link href="/legal/privacy" className="font-semibold text-gold underline-offset-4 hover:underline">
                Privacy policy
              </Link>{" "}
              (placeholder until legal review completes).
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}

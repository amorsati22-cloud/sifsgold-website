import { Check } from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";
import type { ComplianceDisclosure } from "@/types/audience-landing";

export function ComplianceDisclosureSection({
  disclosure,
  idPrefix,
}: {
  disclosure: ComplianceDisclosure;
  idPrefix: string;
}) {
  const headingId = `${idPrefix}-compliance-heading`;

  return (
    <section
      className="border-b border-gold/10 bg-navy-deep/40 py-14 md:py-16"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 id={headingId} className="font-heading text-2xl text-gold md:text-3xl">
            {disclosure.title}
          </h2>
          <ul className="mt-6 list-none space-y-3 p-0">
            {disclosure.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-cream/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}

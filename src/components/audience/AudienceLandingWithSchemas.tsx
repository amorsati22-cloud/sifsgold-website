import { AudienceLandingView } from "@/components/audience/AudienceLandingView";
import type { AudienceLandingConfig } from "@/types/audience-landing";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/schema";
import { BRAND } from "@/lib/constants";

export function AudienceLandingWithSchemas({ config }: { config: AudienceLandingConfig }) {
  const pageUrl = `${BRAND.url}/${config.slug}`;
  const localBusinessSchema = generateLocalBusinessSchema({
    name: `${BRAND.name} — ${config.eyebrow}`,
    url: pageUrl,
    description: config.description,
  });
  const faqSchema =
    config.faqs.length > 0
      ? generateFAQSchema(config.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })))
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <AudienceLandingView config={config} />
    </>
  );
}

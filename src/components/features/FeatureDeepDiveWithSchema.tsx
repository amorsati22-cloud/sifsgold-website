import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { generateFAQSchema } from "@/lib/schema";
import type { ReactNode } from "react";

export function FeatureDeepDiveWithSchema({
  config,
  children,
  gridHeading,
  flowHeading,
  gridIntro,
}: {
  config: FeatureDeepDiveConfig;
  children?: ReactNode;
  gridHeading?: string;
  flowHeading?: string;
  gridIntro?: string;
}) {
  const faqSchema =
    config.faqs.length > 0
      ? generateFAQSchema(config.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })))
      : null;

  return (
    <>
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <FeatureDeepDiveView
        config={config}
        gridHeading={gridHeading}
        flowHeading={flowHeading}
        gridIntro={gridIntro}
      >
        {children}
      </FeatureDeepDiveView>
    </>
  );
}

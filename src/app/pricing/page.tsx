import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";
import { PRICING_FAQS } from "@/data/pricing-faqs";
import { generateFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  const faqSchema = generateFAQSchema(
    PRICING_FAQS.map((faq) => ({ question: faq.question, answer: faq.answer })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ]}
      />
      <PricingPageClient />
    </>
  );
}

import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";
import { PRICING_FAQS } from "@/data/pricing-faqs";
import { generateFAQSchema, generatePricingProductListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  const faqSchema = generateFAQSchema(
    PRICING_FAQS.map((faq) => ({ question: faq.question, answer: faq.answer })),
  );
  const productSchema = generatePricingProductListSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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

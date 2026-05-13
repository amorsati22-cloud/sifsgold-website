import { BRAND } from "@/lib/constants";
import type { PricingTier } from "@/data/pricing";
import { pricingTiers } from "@/data/pricing";

export type BreadcrumbSchemaItem = {
  name: string;
  href: string;
};

export type FAQSchemaItem = {
  question: string;
  answer: string;
};

function toAbsoluteUrl(href: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  return `${BRAND.url}${href.startsWith("/") ? href : `/${href}`}`;
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sif's Gold",
    url: BRAND.url,
    logo: `${BRAND.url}/logo.png`,
    description: "Beauty, grooming, fitness, and fashion in one platform.",
    founder: null,
    foundingDate: "2026",
    foundingLocation: {
      "@type": "Place",
      name: "Minnesota, USA",
    },
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sif's Gold",
    url: BRAND.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BRAND.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.href),
    })),
  };
}

export function generateLocalBusinessSchema(input: {
  name: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: input.name,
    url: input.url,
    description: input.description,
    parentOrganization: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.url,
    },
  };
}

export function generatePricingProductListSchema() {
  const tiers: PricingTier[] = Object.values(pricingTiers).flat();
  const itemListElement = tiers.map((tier, index) => {
    const price =
      typeof tier.monthlyPrice === "number" && tier.monthlyPrice > 0
        ? String(tier.monthlyPrice)
        : typeof tier.annualPrice === "number" && tier.annualPrice > 0
          ? String(Math.round(tier.annualPrice / 12))
          : "0";
    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${BRAND.name} — ${tier.name}`,
        description: tier.limits?.description ?? tier.features.slice(0, 4).join(" "),
        brand: {
          "@type": "Brand",
          name: BRAND.name,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price,
          availability: "https://schema.org/PreOrder",
          url: `${BRAND.url}/pricing`,
        },
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${BRAND.name} pricing tiers`,
    itemListElement,
  };
}

export function generateFAQSchema(faqs: FAQSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

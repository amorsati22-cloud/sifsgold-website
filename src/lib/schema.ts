import { BRAND } from "@/lib/constants";

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

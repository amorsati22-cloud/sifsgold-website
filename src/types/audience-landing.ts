import type { AudienceIconName } from "@/components/audience/audience-icons";

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type AudienceFaqItem = {
  question: string;
  answer: string;
};

export type AudienceLandingConfig = {
  slug: string;
  source: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroBadge?: string;
  openGraphTitle: string;
  pricingTierIds: [string, string] | [string, string, string];
  features: { icon: AudienceIconName; headline: string; description: string }[];
  steps: [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  faqs: AudienceFaqItem[];
};

import type { AudienceIconName } from "@/components/audience/audience-icons";

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type AudienceFaqItem = {
  question: string;
  answer: string;
};

export type ComplianceDisclosure = {
  title: string;
  bullets: string[];
};

export type AudienceLandingConfig = {
  slug: string;
  /** Web3Forms source while pre-launch (waitlist). */
  source: string;
  /** Web3Forms source after industry launch (signup). */
  sourceSignup?: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  /** @deprecated Use launchIndustry + LaunchBadge instead. */
  heroBadge?: string;
  launchIndustry?: "beauty" | "fashion";
  complianceDisclosure?: ComplianceDisclosure;
  openGraphTitle: string;
  pricingTierIds: [string, string] | [string, string, string];
  features: { icon: AudienceIconName; headline: string; description: string }[];
  steps: [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  faqs: AudienceFaqItem[];
};

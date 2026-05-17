export type FeatureFaqItem = {
  question: string;
  answer: string;
};

export type FeatureGridItem = {
  title: string;
  description: string;
  icon: string;
};

export type FeatureFlowStep = {
  title: string;
  description: string;
};

export type FeatureWhoBenefitsItem = {
  label: string;
  description: string;
};

export type FeatureDeepDiveConfig = {
  slug: string;
  source: string;
  pageTitle: string;
  pageDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTagline: string;
  heroIcon: string;
  whatItIs: string;
  grid: FeatureGridItem[];
  flow: FeatureFlowStep[];
  whoBenefits: FeatureWhoBenefitsItem[];
  faqs: FeatureFaqItem[];
};

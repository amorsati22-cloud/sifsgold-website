/** Platform retains 30%; advocates receive 70% per Brand Deal Marketplace policy. */
export const ADVOCATE_REVENUE_SHARE = 0.7;
export const PLATFORM_FEE_SHARE = 0.3;

export const FTC_NEC_THRESHOLD_USD = 2000;
export const FTC_MAX_STRIKES = 3;

export const DEFAULT_FTC_DISCLOSURE_TEMPLATE = `#partner #ad
Paid partnership with {{brand_name}}. Honest review — opinions are my own.
This post is sponsored in accordance with FTC 16 CFR Part 255.`;

export const CAMPAIGN_OBJECTIVES = [
  { value: "awareness", label: "Brand awareness" },
  { value: "product_launch", label: "Product launch" },
  { value: "sales", label: "Drive sales" },
  { value: "ugc_generation", label: "UGC generation" },
] as const;

export const CAMPAIGN_TYPES = [
  { value: "sponsored_post", label: "Sponsored post" },
  { value: "gifted_product", label: "Gifted product" },
  { value: "paid_review", label: "Paid review" },
  { value: "tutorial", label: "Tutorial" },
  { value: "tutorial_series", label: "Tutorial series" },
  { value: "live_event", label: "Live event" },
  { value: "long_term_ambassador", label: "Long-term ambassador" },
] as const;

export const COMPENSATION_TYPES = [
  { value: "flat_fee", label: "Flat fee" },
  { value: "product_gift", label: "Product gift" },
  { value: "flat_plus_product", label: "Flat fee + product" },
  { value: "commission_only", label: "Commission only" },
  { value: "flat_plus_commission", label: "Flat fee + commission" },
] as const;

export const DELIVERABLE_TYPES = [
  { value: "instagram_post", label: "Instagram post" },
  { value: "tiktok_video", label: "TikTok video" },
  { value: "sifs_gold_post", label: "Sif's Gold post" },
  { value: "long_form_content", label: "Long-form content" },
] as const;

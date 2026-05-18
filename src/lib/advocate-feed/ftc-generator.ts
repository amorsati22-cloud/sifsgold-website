/**
 * FTC 16 CFR Part 255 disclosure text for advocate posts on Sif's Gold.
 * Not legal advice — brands and advocates should confirm with counsel.
 */

export type FtcDealKind = "sponsored_post" | "gifted_product" | "paid_review" | "affiliate" | "ambassador";

export type FtcPlatform = "sifs_gold" | "instagram" | "tiktok" | "cross_platform";

export function generateFtcDisclosure(input: {
  brandName: string;
  dealKind: FtcDealKind;
  platform?: FtcPlatform;
  compensationNote?: string;
}): string {
  const brand = input.brandName.trim() || "this brand";
  const platform = input.platform ?? "sifs_gold";
  const comp = input.compensationNote?.trim();

  const platformLine =
    platform === "sifs_gold"
      ? "Posted on Sif's Gold."
      : platform === "cross_platform"
        ? "Posted on Sif's Gold and may be shared to other social platforms."
        : `Posted on Sif's Gold and ${platform === "instagram" ? "Instagram" : "TikTok"}.`;

  const baseByKind: Record<FtcDealKind, string> = {
    sponsored_post: `Paid partnership with ${brand}. #ad #partner`,
    gifted_product: `Received product from ${brand} at no cost. Honest opinions are my own. #gifted`,
    paid_review: `Paid review for ${brand}. #ad #partner`,
    affiliate: `I may earn commission from ${brand} if you purchase through my link. #affiliate #ad`,
    ambassador: `Brand ambassador for ${brand}. Ongoing paid relationship. #ad #partner`,
  };

  const core = baseByKind[input.dealKind] ?? baseByKind.sponsored_post;
  const compliance =
    "This disclosure is provided in accordance with the U.S. FTC Endorsement Guides (16 CFR Part 255).";
  const compLine = comp ? ` ${comp}` : "";

  return `${core}${compLine} ${platformLine} ${compliance}`;
}

/** Map brand_campaigns.campaign_type / compensation_type to disclosure kind. */
export function dealKindFromCampaign(campaignType: string, compensationType: string): FtcDealKind {
  if (compensationType.includes("commission") || compensationType === "commission_only") return "affiliate";
  if (campaignType === "gifted_product" || compensationType === "product_gift") return "gifted_product";
  if (campaignType === "paid_review") return "paid_review";
  if (campaignType === "long_term_ambassador") return "ambassador";
  return "sponsored_post";
}

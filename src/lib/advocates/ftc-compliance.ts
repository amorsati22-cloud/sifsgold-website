import "server-only";

import { verifyFtcDisclosureOnUrl } from "@/lib/brand-deals/ftc-verification";

export type FtcPlatform = "instagram" | "tiktok" | "youtube" | "sifs_gold";

export function generateFtcDisclosure(platform: FtcPlatform, brandName: string): string {
  const brand = brandName.trim() || "Brand Partner";

  switch (platform) {
    case "instagram":
      return `#partner #ad\nPaid partnership with ${brand}. Honest review — opinions are my own.\nThis post is sponsored in accordance with FTC 16 CFR Part 255.`;
    case "tiktok":
      return `#ad\nPaid partnership with ${brand}. #sponsored`;
    case "youtube":
      return `This video is sponsored by ${brand}. Paid partnership — opinions are my own. FTC 16 CFR Part 255.`;
    case "sifs_gold":
      return `[Sponsored · Paid partnership with ${brand}] — auto-tagged on Sif's Gold. FTC 16 CFR Part 255.`;
    default:
      return `Paid partnership with ${brand}. #ad #partner`;
  }
}

export async function validateAdvocatePostDisclosure(
  postUrl: string,
  requiredText?: string,
) {
  return verifyFtcDisclosureOnUrl(postUrl, requiredText);
}

export { verifyFtcDisclosureOnUrl };

import "server-only";

import { isProUserType } from "@/lib/auth-pro";
import type { ProductRow } from "@/lib/shop/types";

export type LicenseCheckResult = {
  allowed: boolean;
  reason?: string;
};

/** Maps pro profile specialties / user_type to pro-only purchase categories. */
const PRO_TYPE_ALIASES: Record<string, string[]> = {
  licensed_pro: ["hair", "skin", "nail", "lash", "brow", "barber", "medspa"],
  stylist_assistant: ["hair", "nail", "lash", "brow"],
  student: ["hair", "nail"],
};

export function canPurchaseProOnlyProduct(
  product: Pick<ProductRow, "pro_only" | "pro_only_categories">,
  context: {
    userType: string | null | undefined;
    licenseVerified: boolean;
    specialties?: string[] | null;
  },
): LicenseCheckResult {
  if (!product.pro_only) {
    return { allowed: true };
  }

  if (!context.userType) {
    return {
      allowed: false,
      reason:
        "Professional-only products require a licensed pro account on Sif's Gold. Sign in with your pro credentials to purchase salon chemicals and tools.",
    };
  }

  if (!isProUserType(context.userType)) {
    return {
      allowed: false,
      reason:
        "This item is reserved for licensed beauty professionals in The Gold Collective. Client accounts cannot purchase professional-use chemicals.",
    };
  }

  if (!context.licenseVerified) {
    return {
      allowed: false,
      reason:
        "Verify your license on your pro profile before purchasing professional-only products. Sif's Advocates with verified licenses unlock full supply access.",
    };
  }

  const allowedCategories = product.pro_only_categories ?? [];
  if (allowedCategories.length === 0) {
    return { allowed: true };
  }

  const userCats = new Set<string>();
  const aliases = PRO_TYPE_ALIASES[context.userType] ?? [];
  aliases.forEach((c) => userCats.add(c));
  (context.specialties ?? []).forEach((s) => {
    const normalized = s.toLowerCase().replace(/[^a-z]/g, "");
    if (normalized.includes("hair")) userCats.add("hair");
    if (normalized.includes("nail")) userCats.add("nail");
    if (normalized.includes("lash") || normalized.includes("brow")) userCats.add("lash");
    if (normalized.includes("skin") || normalized.includes("esthet")) userCats.add("skin");
    if (normalized.includes("barber")) userCats.add("barber");
    if (normalized.includes("medspa")) userCats.add("medspa");
  });

  const match = allowedCategories.some((cat) =>
    [...userCats].some((u) => cat.toLowerCase().includes(u) || u.includes(cat.toLowerCase())),
  );

  if (!match) {
    return {
      allowed: false,
      reason:
        "Your license type does not include access to this professional category. Contact support if you believe this is an error.",
    };
  }

  return { allowed: true };
}

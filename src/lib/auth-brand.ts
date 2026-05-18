/** Gold Partners and brand accounts that may operate a Beauty Supply storefront. */
export const BRAND_USER_TYPES = ["brand_partner", "gold_partner"] as const;

export type BrandUserType = (typeof BRAND_USER_TYPES)[number];

export function isBrandUserType(userType: string | null | undefined): userType is BrandUserType {
  return BRAND_USER_TYPES.includes(userType as BrandUserType);
}

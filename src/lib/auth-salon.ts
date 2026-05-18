export const SALON_USER_TYPES = ["salon"] as const;

export type SalonUserType = (typeof SALON_USER_TYPES)[number];

export function isSalonUserType(userType: string | null | undefined): userType is SalonUserType {
  return SALON_USER_TYPES.includes(userType as SalonUserType);
}

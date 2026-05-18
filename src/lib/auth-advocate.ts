/** Sif's Advocates eligible for Brand Deal Marketplace campaigns. */
export const ADVOCATE_USER_TYPES = ["sifs_advocate", "gold_advocate", "licensed_pro"] as const;

export type AdvocateUserType = (typeof ADVOCATE_USER_TYPES)[number];

export function isAdvocateUserType(userType: string | null | undefined): userType is AdvocateUserType {
  return ADVOCATE_USER_TYPES.includes(userType as AdvocateUserType);
}

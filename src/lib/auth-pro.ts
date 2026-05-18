export const PRO_USER_TYPES = ["licensed_pro", "stylist_assistant", "student"] as const;

export type ProUserType = (typeof PRO_USER_TYPES)[number];

export function isProUserType(userType: string | null | undefined): userType is ProUserType {
  return PRO_USER_TYPES.includes(userType as ProUserType);
}

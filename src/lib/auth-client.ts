export const CLIENT_USER_TYPES = ["client"] as const;

export type ClientUserType = (typeof CLIENT_USER_TYPES)[number];

export function isClientUserType(userType: string | null | undefined): userType is ClientUserType {
  return CLIENT_USER_TYPES.includes(userType as ClientUserType);
}

/** Default dashboard experience for signed-in users who are not pro/brand/advocate. */
export function isLikelyClientDashboardUser(userType: string | null | undefined): boolean {
  if (!userType) return true;
  return isClientUserType(userType);
}

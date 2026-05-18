export const SCHOOL_USER_TYPES = ["school"] as const;

export type SchoolUserType = (typeof SCHOOL_USER_TYPES)[number];

export function isSchoolUserType(userType: string | null | undefined): userType is SchoolUserType {
  return SCHOOL_USER_TYPES.includes(userType as SchoolUserType);
}

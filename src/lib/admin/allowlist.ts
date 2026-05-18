export const ADMIN_EMAILS = [
  "sati@sifsgold.com", // founder
] as const;

export function isAdmin(email: string | undefined | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number]);
}

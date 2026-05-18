export const ADMIN_EMAILS = [
  "sati@sifsgold.com", // founder
] as const;

const NORMALIZED = ADMIN_EMAILS.map((e) => e.toLowerCase());

export function isAdmin(email: string | undefined | null): boolean {
  return !!email && NORMALIZED.includes(email.trim().toLowerCase());
}

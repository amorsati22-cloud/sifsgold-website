export const LAUNCH_DATES = {
  beauty: new Date("2026-06-01T00:00:00Z"),
  fashion: new Date("2026-06-30T00:00:00Z"),
} as const;

export type LaunchIndustry = keyof typeof LAUNCH_DATES;

export function isLive(industry: LaunchIndustry): boolean {
  return Date.now() >= LAUNCH_DATES[industry].getTime();
}

export function daysUntilLaunch(industry: LaunchIndustry): number {
  const diff = LAUNCH_DATES[industry].getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatLaunchDate(industry: LaunchIndustry): string {
  return LAUNCH_DATES[industry].toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

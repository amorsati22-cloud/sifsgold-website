const APP_BASE = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://app.sifsgold.com";

export function getBookingUrl(username: string, serviceId?: string): string {
  const base = `${APP_BASE}/book/${encodeURIComponent(username)}`;
  if (serviceId) {
    return `${base}?service=${encodeURIComponent(serviceId)}`;
  }
  return base;
}

export function getServicesMenuUrl(username: string): string {
  return `/${username}/services`;
}

export function getBookingUrl(username: string, serviceId?: string): string {
  const params = new URLSearchParams();
  if (username) params.set("pro", username);
  if (serviceId) params.set("service_id", serviceId);
  const qs = params.toString();
  return qs ? `/booking/new?${qs}` : "/booking/new";
}

export function getConsultationUrl(username: string, serviceId?: string): string {
  const params = new URLSearchParams({ type: "consultation", pro: username });
  if (serviceId) params.set("service_id", serviceId);
  return `/booking/new?${params.toString()}`;
}

export function getBookingAppUrl(username: string, serviceId?: string): string {
  const appBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://app.sifsgold.com";
  const base = `${appBase}/book/${encodeURIComponent(username)}`;
  if (serviceId) return `${base}?service=${encodeURIComponent(serviceId)}`;
  return base;
}

export function getServicesMenuUrl(username: string): string {
  return `/${username}/services`;
}

import type { PriceType, Service, ServiceAddon } from "@/types/services";

export function formatServicePrice(service: Pick<Service, "price_amount" | "price_type" | "price_high">): string {
  const low = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(service.price_amount));

  switch (service.price_type as PriceType) {
    case "starting_at":
      return `From ${low}`;
    case "custom_quote":
      return "Custom quote";
    case "fixed":
    default:
      if (service.price_high != null && Number(service.price_high) > Number(service.price_amount)) {
        const high = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(service.price_high));
        return `${low} – ${high}`;
      }
      return low;
  }
}

export function formatAddonPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatDuration(minutes: number | null | undefined): string {
  if (minutes == null || minutes <= 0) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

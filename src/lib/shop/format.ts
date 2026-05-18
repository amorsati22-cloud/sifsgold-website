export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return "—";
  return rating.toFixed(1);
}

export function centsFromDecimal(amount: number): number {
  return Math.round(amount * 100);
}

export function decimalFromCents(cents: number): number {
  return cents / 100;
}

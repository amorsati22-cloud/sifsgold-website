import { bookStatusLabel } from "@/lib/pro-profiles";
import type { BookStatus } from "@/types/pro-profile";

const statusStyles: Record<BookStatus, string> = {
  fully_open: "border-teal/40 bg-teal/10 text-teal",
  request_only: "border-gold/40 bg-gold/10 text-gold",
  closed: "border-cream/20 bg-cream/5 text-cream/70",
  exclusive: "border-gold-light/40 bg-gold-light/10 text-gold-light",
};

type BookStatusBadgeProps = {
  status: BookStatus;
  acceptingNewClients: boolean;
};

export function BookStatusBadge({ status, acceptingNewClients }: BookStatusBadgeProps) {
  const label = bookStatusLabel(status);
  const extra = !acceptingNewClients && status === "fully_open" ? " · Waitlist" : "";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-body text-xs font-medium ${statusStyles[status]}`}
    >
      {label}
      {extra}
    </span>
  );
}

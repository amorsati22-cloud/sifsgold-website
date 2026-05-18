import { Check } from "lucide-react";
import type { OrderStatus } from "@/lib/shop/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "paid", label: "Paid" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_ORDER: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];

function stepIndex(status: OrderStatus): number {
  if (status === "cancelled" || status === "refunded" || status === "partially_refunded") return -1;
  if (status === "pending_payment") return -1;
  return STATUS_ORDER.indexOf(status);
}

type Props = {
  status: OrderStatus;
};

export function OrderStatusTracker({ status }: Props) {
  const current = stepIndex(status);

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:justify-between" aria-label="Order status">
      {STEPS.map((step, i) => {
        const done = current >= i;
        const active = current === i;
        return (
          <li key={step.key} className="flex items-center gap-3 sm:flex-col sm:text-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                done
                  ? "border-gold bg-gold text-navy"
                  : "border-gold/30 bg-navy-lift text-gold-body"
              } ${active ? "ring-2 ring-gold ring-offset-2 ring-offset-navy" : ""}`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-5 w-5" aria-hidden /> : <span className="font-mono text-sm">{i + 1}</span>}
            </span>
            <span className={`font-body text-sm ${done ? "text-gold" : "text-cream/60"}`}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

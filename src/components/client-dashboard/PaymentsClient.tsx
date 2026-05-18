"use client";

import { useState } from "react";
import Link from "next/link";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ClientPaymentRow } from "@/types/client-dashboard";

export function PaymentsClient({ payments }: { payments: ClientPaymentRow[] }) {
  const [portalLoading, setPortalLoading] = useState(false);

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch("/api/client/stripe-portal", { method: "POST" });
    const data = await res.json();
    setPortalLoading(false);
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Saved payment methods</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Manage cards and billing through Stripe&apos;s secure customer portal.
        </p>
        <GoldButton
          label={portalLoading ? "Opening…" : "Manage payment methods"}
          onClick={() => void openPortal()}
          variant="solid"
          size="md"
          className={`mt-4 ${portalLoading ? "pointer-events-none opacity-70" : ""}`}
        />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Payment history</h2>
        {payments.length === 0 ? (
          <p className="font-body text-sm text-gold-body">No payments yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((p) => (
              <li
                key={`${p.type}-${p.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-brand-lg border border-gold/15 bg-navy/50 px-4 py-3"
              >
                <div>
                  <p className="font-body text-cream">{p.label}</p>
                  <p className="font-body text-xs text-gold-body">
                    {format(parseISO(p.date), "MMM d, yyyy")} · {p.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body text-gold">${p.amount.toFixed(2)}</span>
                  {p.receipt_url ? (
                    <a
                      href={p.receipt_url}
                      className="font-body text-sm text-gold underline"
                      download
                    >
                      Receipt
                    </a>
                  ) : null}
                  {p.type === "shop_order" ? (
                    <Link href={p.receipt_url ?? "#"} className="font-body text-sm text-gold-body hover:text-gold">
                      View
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

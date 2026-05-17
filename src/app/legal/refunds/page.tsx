import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Subscription refunds, booking payments, and free-trial conversion rules for Sif's Gold — summary for launch window.",
  alternates: { canonical: `${BRAND.url}/legal/refunds` },
};

export default function RefundsPolicyPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Refund Policy" lastUpdated={last} currentPath="/legal/refunds">
      <h2 id="subs">Subscriptions — 7-day money-back guarantee</h2>
      <p>
        Paid subscriptions include a <strong>7-day money-back guarantee</strong> from the initial charge date when you cancel
        through self-serve billing during that window. After seven days, charges follow the active plan&apos;s billing cycle unless
        another promotion explicitly states otherwise.
      </p>

      <h2 id="bookings">Completed bookings</h2>
      <p>
        <strong>No refunds on completed bookings</strong> once the service has been delivered as described. If something goes
        wrong, resolution happens through the in-app dispute and support system so both parties have a structured record.
      </p>

      <h2 id="trials">Free trials</h2>
      <p>
        <strong>Pro and Premium tier free trials auto-convert on day 8</strong> unless you cancel before conversion, assuming a
        valid payment method is on file as disclosed at checkout. Trial eligibility and card requirements may vary by tier —
        always read the checkout screen for the exact date and amount.
      </p>

      <h2 id="more">More detail</h2>
      <p>
        An archived refund overview may also appear at{" "}
        <Link href="/legal/refund" className="font-semibold text-gold underline-offset-4 hover:underline">
          /legal/refund
        </Link>{" "}
        during migration — this page is the canonical summary for the June 2026 launch window.
      </p>
    </LegalLayout>
  );
}

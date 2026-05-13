import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund and Cancellation Policy">
      <h2 id="subscriptions">Subscriptions</h2>
      <p>
        Subscriptions may be canceled at any time. Cancellations stop future billing, and no
        partial refund is planned for the active billing period unless required by law.
      </p>

      <h2 id="booking-deposits">Booking Deposits</h2>
      <ul>
        <li>Full refund when canceled 24 hours or more before the booking window.</li>
        <li>No refund for cancellations under 24 hours before the booking window.</li>
        <li>Full refund if the professional cancels.</li>
      </ul>

      <h2 id="digital-goods">Digital Goods</h2>
      <p>Consumable digital goods are expected to be non-refundable once delivered.</p>

      <h2 id="technical-issues">Technical Issues</h2>
      <p>
        A 7-day support window is planned for technical issue review and remediation requests tied
        to billing or access.
      </p>

      <h2 id="important-note">Important Note</h2>
      <p>This policy is placeholder content pending final legal approval.</p>
    </LegalPageShell>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "Cancel Sif's Gold subscriptions anytime, and understand how booking cancellations work between clients and providers.",
  alternates: { canonical: `${BRAND.url}/legal/cancellation` },
};

export default function CancellationPolicyPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Cancellation Policy" lastUpdated={last} currentPath="/legal/cancellation">
      <h2 id="subs">Subscriptions</h2>
      <p>
        <strong>Cancel anytime from your account settings. No penalty, no fees</strong> beyond what you already owe for the
        current billing period. When you cancel, you keep access through the end of the paid period unless stated otherwise for
        a promotional plan.
      </p>

      <h2 id="bookings">Bookings (per professional)</h2>
      <p>
        Each professional or studio sets their own cancellation windows, fees, and rebooking rules inside The Gold Collective.
        Clients see those rules before confirming an appointment. If a provider cancels, clients receive automatic refunds or
        credits according to the provider&apos;s published policy and payment processor timelines.
      </p>

      <h2 id="flow">Self-serve flow</h2>
      <p>
        Subscription cancellation lives in billing settings with clear confirmation screens. Booking cancellations live on the
        appointment record so both parties share the same timestamped history.
      </p>

      <h2 id="help">Need help?</h2>
      <p>
        Use the{" "}
        <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
          contact form
        </Link>{" "}
        if a cancellation button fails or a refund looks stuck after the posted window.
      </p>
    </LegalLayout>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getPricingTierById } from "@/data/pricing";
import { retrieveCheckoutSession } from "@/lib/stripe/session";
import { sendSubscriptionWelcomeEmail } from "@/lib/stripe/welcome-email";

export const metadata: Metadata = {
  title: "Welcome to Sif's Gold",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { session_id?: string };
};

const APP_STORE_URL = "https://apps.apple.com/app/id0000000000";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sifsgold.app";
const APP_PROFILE_URL = "sifsgold://profile";
const COMMUNITY_URL = "https://sifsgold.com/community";

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id?.trim();
  const session = sessionId ? await retrieveCheckoutSession(sessionId) : null;

  const subscription =
    session?.subscription && typeof session.subscription === "object"
      ? session.subscription
      : null;
  const tierId = session?.metadata?.tierId ?? subscription?.metadata?.tierId;

  const tier = tierId ? getPricingTierById(tierId) : null;
  const customerEmail =
    session?.customer_details?.email ??
    session?.customer_email ??
    (typeof session?.customer === "object" && session.customer && "email" in session.customer
      ? (session.customer.email as string | null)
      : null);

  if (customerEmail) {
    await sendSubscriptionWelcomeEmail(customerEmail, tier);
  }

  const confirmed = Boolean(session && session.status === "complete");

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-cream font-body text-navy">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Checkout", href: "/pricing" },
          { name: "Success", href: "/checkout/success" },
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">
            {confirmed ? "Payment confirmed" : "Welcome"}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-black text-gold md:text-5xl">
            Welcome to Sif&apos;s Gold.
          </h1>
          <p className="mt-4 text-lg text-navy/85">
            {tier
              ? `You're set up on ${tier.name}.`
              : "Your subscription is being activated."}{" "}
            {confirmed
              ? "We sent a confirmation email with next steps."
              : "If you just completed checkout, your confirmation email will arrive shortly."}
          </p>
        </header>

        <section
          aria-labelledby="next-steps-heading"
          className="mt-10 rounded-brand-lg border border-gold/30 bg-white p-6 shadow-sm md:p-8"
        >
          <h2 id="next-steps-heading" className="font-heading text-2xl text-navy">
            Next steps
          </h2>
          <ol className="mt-6 space-y-5 text-sm text-navy/85">
            <li>
              <strong className="text-navy">Download the app</strong>
              <p className="mt-1">
                Get Sif&apos;s Gold on your phone to book, message, and manage your work on the go.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={APP_STORE_URL}
                  className="rounded-full border border-gold bg-gold px-4 py-2 text-xs font-semibold text-navy hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  App Store (placeholder)
                </a>
                <a
                  href={PLAY_STORE_URL}
                  className="rounded-full border border-navy/20 bg-cream px-4 py-2 text-xs font-semibold text-navy hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Google Play (placeholder)
                </a>
              </div>
            </li>
            <li>
              <strong className="text-navy">Set up your profile</strong>
              <p className="mt-1">
                Add your photo, services, and availability so clients can find you in The Gold
                Collective.
              </p>
              <Link
                href={APP_PROFILE_URL}
                className="mt-2 inline-block text-sm font-semibold text-teal underline-offset-2 hover:underline"
              >
                Open profile setup in the app
              </Link>
            </li>
            <li>
              <strong className="text-navy">Join The Gold Collective</strong>
              <p className="mt-1">
                Connect with Sif&apos;s Advocates, Gold Partners, and peers in your lane.
              </p>
              <Link
                href={COMMUNITY_URL}
                className="mt-2 inline-block text-sm font-semibold text-teal underline-offset-2 hover:underline"
              >
                Visit the community hub
              </Link>
            </li>
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Back to pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Return home
          </Link>
        </div>
      </div>
    </article>
  );
}

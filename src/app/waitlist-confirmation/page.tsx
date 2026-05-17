import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WaitlistConfirmationClient } from "@/components/waitlist/WaitlistConfirmationClient";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "You're in Sif's Circle",
  description: "Welcome to the Sif's Gold waitlist — launch updates, founding perks, and early access.",
  alternates: { canonical: `${BRAND.url}/waitlist-confirmation` },
};

function WaitlistConfirmationFallback() {
  return (
    <div className="mx-auto max-w-lg animate-pulse text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-gold/20" />
      <div className="mx-auto mt-8 h-10 max-w-md rounded-lg bg-cream/10" />
      <div className="mx-auto mt-4 h-4 max-w-sm rounded bg-cream/10" />
    </div>
  );
}

export default function WaitlistConfirmationPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Waitlist", href: "/waitlist-confirmation" },
        ]}
      />
      <div className="border-b border-gold/10 py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <Suspense fallback={<WaitlistConfirmationFallback />}>
            <WaitlistConfirmationClient />
          </Suspense>
        </div>
      </div>
    </article>
  );
}

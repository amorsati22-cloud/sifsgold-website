import type { Metadata } from "next";
import Link from "next/link";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";
import { formatSalonAddress } from "@/lib/salons/data";

export const metadata: Metadata = {
  title: "Salon marketing",
  robots: { index: false, follow: false },
};

export default async function SalonMarketingPage() {
  const { salon } = await requireSalonDashboardUser();
  const publicUrl = salon.slug ? `/salon/${salon.slug}` : `/salon/${salon.id}`;

  return (
    <div className="max-w-2xl space-y-8">
      <section className="rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Public salon page</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Share your salon profile so clients can browse your team and book any available pro.
        </p>
        <Link href={publicUrl} className="mt-3 inline-block font-body text-sm text-gold hover:underline">
          {publicUrl} →
        </Link>
      </section>

      <section className="rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">New client promotions</h2>
        <p className="mt-2 font-body text-sm text-gold-body">
          Create salon-wide first-visit discounts (coming soon). For now, each pro can run individual promos from their pro dashboard.
        </p>
      </section>

      <section className="rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Loyalty program</h2>
        <p className="mt-2 font-body text-sm text-gold-body">
          Build visit-based rewards across all staff — unified points per client account (beta).
        </p>
      </section>

      <section className="rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Instagram</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          {salon.instagram_handle
            ? `@${salon.instagram_handle.replace(/^@/, "")}`
            : "Add your handle in Settings to display on your public page."}
        </p>
        {formatSalonAddress(salon) ? (
          <p className="mt-2 font-body text-xs text-gold-body">{formatSalonAddress(salon)}</p>
        ) : null}
      </section>
    </div>
  );
}

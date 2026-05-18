import type { Metadata } from "next";
import { EarningsCharts } from "@/components/pro-ops/EarningsCharts";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireProDashboardUser } from "@/lib/dashboard";
import { getProEarningsSummary } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Earnings",
  robots: { index: false, follow: false },
};

export default async function ProEarningsPage() {
  const { user } = await requireProDashboardUser();
  const summary = await getProEarningsSummary(user.id);

  return (
    <div className="space-y-8">
      <EarningsCharts
        thisMonth={summary.thisMonth}
        lastMonth={summary.lastMonth}
        byCategory={summary.byCategory}
      />

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Stripe payouts</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Payout history and balance are managed in your Stripe Connect dashboard.
        </p>
        <GoldButton
          label="Open Stripe dashboard"
          href="https://dashboard.stripe.com"
          variant="outlined"
          size="md"
          className="mt-4"
        />
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Tax documents</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          1099 forms are available from Stripe when your business qualifies. Add tax info under Business
          settings.
        </p>
      </section>
    </div>
  );
}

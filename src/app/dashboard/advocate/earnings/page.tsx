import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { formatCurrency } from "@/lib/brand-deals/format";
import { FTC_NEC_THRESHOLD_USD } from "@/lib/brand-deals/constants";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

const SOURCE_LABELS: Record<string, string> = {
  brand_deal: "Brand deals",
  subscription_referral: "Subscription referrals",
  product_affiliate: "Product affiliate",
  booking_referral: "Booking referrals",
};

export default async function AdvocateEarningsPage() {
  const { supabase, user } = await requireAdvocateDashboard();
  const year = new Date().getFullYear();

  const { data: earnings } = await supabase
    .from("advocate_earnings")
    .select("*")
    .eq("advocate_id", user.id)
    .order("created_at", { ascending: false });

  const bySource: Record<string, number> = {};
  for (const e of earnings ?? []) {
    const key = e.source_type as string;
    bySource[key] = (bySource[key] ?? 0) + Number(e.net_to_advocate ?? 0);
  }

  const ytd = (earnings ?? [])
    .filter((e) => e.tax_year === year)
    .reduce((s, e) => s + Number(e.net_to_advocate ?? 0), 0);

  const { data: taxDocs } = await supabase
    .from("advocate_tax_documents")
    .select("*")
    .eq("advocate_id", user.id)
    .order("tax_year", { ascending: false });

  const { data: annual } = await supabase
    .from("advocate_annual_earnings")
    .select("tax_year, gross_earnings, nec_generated")
    .eq("advocate_id", user.id)
    .order("tax_year", { ascending: false });

  return (
    <DashboardShell
      title="Earnings"
      description="All revenue streams, payout history, and tax documents."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <div className="mb-8 rounded-brand-md border border-gold/20 bg-navy-lift p-6">
        <p className="font-body text-sm text-gold-body">Year-to-date ({year})</p>
        <p className="mt-1 font-heading text-3xl text-gold">{formatCurrency(ytd)}</p>
        {ytd >= FTC_NEC_THRESHOLD_USD && (
          <p className="mt-2 font-body text-sm text-amber-200">
            You meet the ${FTC_NEC_THRESHOLD_USD.toLocaleString()} IRS threshold for 1099-NEC reporting.
          </p>
        )}
      </div>

      <h2 className="font-heading text-lg text-gold">By revenue stream</h2>
      <ul className="mt-3 mb-10 grid gap-2 sm:grid-cols-2">
        {Object.entries(bySource).map(([key, total]) => (
          <li key={key} className="rounded-brand-sm border border-gold/15 px-4 py-3 font-body text-sm">
            <span className="text-cream">{SOURCE_LABELS[key] ?? key}</span>
            <span className="float-right text-gold">{formatCurrency(total)}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-heading text-lg text-gold">Tax documents</h2>
      <ul className="mt-3 mb-10 space-y-2">
        {(taxDocs ?? []).length === 0 ? (
          <li className="font-body text-sm text-gold-body">
            1099-NEC forms appear here after annual generation if you earn $2,000+.
          </li>
        ) : (
          taxDocs!.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between rounded-brand-sm border border-gold/15 px-4 py-3">
              <span className="font-body text-sm text-cream">
                {doc.form_type} · {doc.tax_year}
              </span>
              {doc.file_url && (
                <Link href={doc.file_url as string} className="text-sm text-gold hover:underline" target="_blank">
                  Download
                </Link>
              )}
            </li>
          ))
        )}
      </ul>

      <h2 className="font-heading text-lg text-gold">Annual totals</h2>
      <ul className="mt-3 mb-10 space-y-2 font-body text-sm text-cream">
        {(annual ?? []).map((a) => (
          <li key={a.tax_year}>
            {a.tax_year}: {formatCurrency(Number(a.gross_earnings))}
            {a.nec_generated ? " · 1099 eligible" : ""}
          </li>
        ))}
      </ul>

      <h2 className="font-heading text-lg text-gold">All transactions</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-gold-body">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Gross</th>
              <th className="py-2 pr-4">Fee</th>
              <th className="py-2 pr-4">Net</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(earnings ?? []).map((e) => (
              <tr key={e.id} className="border-b border-gold/10 text-cream">
                <td className="py-2 pr-4">{new Date(e.created_at as string).toLocaleDateString()}</td>
                <td className="py-2 pr-4 capitalize">{String(e.source_type).replace(/_/g, " ")}</td>
                <td className="py-2 pr-4">{formatCurrency(Number(e.amount))}</td>
                <td className="py-2 pr-4">{formatCurrency(Number(e.platform_fee))}</td>
                <td className="py-2 pr-4 text-gold">{formatCurrency(Number(e.net_to_advocate))}</td>
                <td className="py-2 capitalize">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

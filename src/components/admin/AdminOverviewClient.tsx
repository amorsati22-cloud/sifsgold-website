"use client";

import Link from "next/link";
import { SignupsLineChart } from "@/components/admin/SignupsLineChart";
import { GoldButton } from "@/components/ui/GoldButton";
import type { AdminOverviewData } from "@/lib/admin/overview";

function KpiCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5">
      <p className="font-body text-xs uppercase tracking-wider text-gold-body">{label}</p>
      <p className="mt-2 font-heading text-3xl text-gold">{value}</p>
      {delta ? <p className="mt-1 font-body text-sm text-cream/75">{delta}</p> : null}
      {hint ? <p className="mt-2 font-body text-xs text-cream/55">{hint}</p> : null}
    </div>
  );
}

export function AdminOverviewClient({ data }: { data: AdminOverviewData }) {
  const waitlistDelta = data.waitlistLast7 - data.waitlistPrev7;
  const deltaLabel =
    waitlistDelta >= 0 ? `+${waitlistDelta} vs prior 7 days` : `${waitlistDelta} vs prior 7 days`;

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-bold text-gold">Overview</h1>
        <p className="mt-2 max-w-2xl font-body text-cream/80">
          Founder command center for Sif&apos;s Circle, Sif&apos;s Advocates, and Gold Partners operations.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Waitlist signups" value={String(data.waitlistTotal)} delta={deltaLabel} />
        <KpiCard
          label="Founding members"
          value={`${data.foundingCount} / ${data.foundingCap}`}
          hint="Launch cap"
        />
        <KpiCard label="Advocate applications" value={String(data.pendingAdvocates)} hint="Pending review" />
        <KpiCard label="Open support tickets" value={String(data.openTickets)} />
      </div>

      <section className="mt-10 rounded-brand-lg border border-gold/20 bg-navy-deep/50 p-6">
        <h2 className="font-heading text-lg text-gold">Signups per day (30 days)</h2>
        <div className="mt-4">
          <SignupsLineChart data={data.signupsByDay} />
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/50 p-6">
          <h2 className="font-heading text-lg text-gold">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <GoldButton label="Review advocate queue" href="/admin/advocates" variant="solid" size="sm" />
            <GoldButton
              label="Founding member roster"
              href="/admin/founding-members"
              variant="outlined"
              size="sm"
            />
            <GoldButton label="New email campaign" href="/admin/campaigns" variant="outlined" size="sm" />
          </div>
        </section>

        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/50 p-6">
          <h2 className="font-heading text-lg text-gold">Recent activity</h2>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {data.recentAudit.length === 0 ? (
              <li className="font-body text-sm text-cream/60">No audit entries yet.</li>
            ) : (
              data.recentAudit.map((entry) => (
                <li key={entry.id} className="rounded-brand-sm border border-gold/10 px-3 py-2 text-sm">
                  <span className="text-gold">{entry.action.replaceAll("_", " ")}</span>
                  <span className="text-cream/50"> · </span>
                  <time className="text-cream/65" dateTime={entry.created_at}>
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

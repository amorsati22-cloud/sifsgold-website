"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";

type Application = {
  id: string;
  pitch: string;
  status: string;
  advocate?: { display_name: string; specialties: string[]; follower_count: number };
};

export default function ApplicationsReviewPage() {
  const params = useParams();
  const campaignId = params.campaign_id as string;
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    void fetch(`/api/brand-campaigns/${campaignId}/applications`)
      .then((r) => r.json())
      .then((d) => setApplications(d.applications ?? []));
  }, [campaignId]);

  async function review(appId: string, action: "accept" | "reject") {
    await fetch(`/api/brand-campaigns/${campaignId}/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const res = await fetch(`/api/brand-campaigns/${campaignId}/applications`);
    const data = await res.json();
    setApplications(data.applications ?? []);
  }

  return (
    <DashboardShell title="Applicant review" nav={BRAND_DEALS_NAV}>
      <Link href={`/dashboard/brand-deals/${campaignId}`} className="mb-6 inline-block font-body text-sm text-gold hover:underline">
        ← Back to campaign
      </Link>
      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
            <p className="font-heading text-lg text-gold">{app.advocate?.display_name ?? "Advocate"}</p>
            <p className="mt-1 font-body text-xs text-gold-body">
              {app.advocate?.follower_count?.toLocaleString()} followers · {app.advocate?.specialties?.join(", ")}
            </p>
            <p className="mt-3 font-body text-sm text-cream/90">{app.pitch}</p>
            <p className="mt-2 font-body text-xs capitalize text-cream/60">Status: {app.status}</p>
            {app.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <GoldButton label="Accept" onClick={() => void review(app.id, "accept")} variant="solid" size="sm" />
                <GoldButton label="Reject" onClick={() => void review(app.id, "reject")} variant="outlined" size="sm" />
              </div>
            )}
          </li>
        ))}
      </ul>
      {applications.length === 0 && <p className="font-body text-gold-body">No applications yet.</p>}
    </DashboardShell>
  );
}

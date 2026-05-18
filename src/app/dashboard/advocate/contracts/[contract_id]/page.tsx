"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractSignButton } from "@/components/brand-deals/ContractSignButton";
import { GoldButton } from "@/components/ui/GoldButton";
import { ADVOCATE_BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { DEFAULT_FTC_DISCLOSURE_TEMPLATE } from "@/lib/brand-deals/constants";
import { createClient } from "@/lib/supabase/client";

export default function AdvocateContractPage() {
  const params = useParams();
  const contractId = params.contract_id as string;
  const [contract, setContract] = useState<{
    signed_by_advocate: boolean;
    status: string;
    campaign?: { title: string; ftc_disclosure_template: string | null };
  } | null>(null);
  const [deliverables, setDeliverables] = useState<
    { id: string; deliverable_type: string; status: string; due_date: string | null }[]
  >([]);
  const [submitUrl, setSubmitUrl] = useState("");
  const [activeDelId, setActiveDelId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase
      .from("campaign_contracts")
      .select("signed_by_advocate, status, campaign:brand_campaigns(title, ftc_disclosure_template)")
      .eq("id", contractId)
      .single()
      .then(({ data }) => setContract(data as typeof contract));
    void supabase
      .from("campaign_deliverables")
      .select("id, deliverable_type, status, due_date")
      .eq("contract_id", contractId)
      .then(({ data }) => setDeliverables(data ?? []));
  }, [contractId]);

  const ftcText =
    contract?.campaign?.ftc_disclosure_template ?? DEFAULT_FTC_DISCLOSURE_TEMPLATE;

  async function submitDeliverable() {
    if (!activeDelId || !submitUrl) return;
    await fetch(`/api/contracts/${contractId}/deliverables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliverable_id: activeDelId, submitted_url: submitUrl }),
    });
    window.location.reload();
  }

  return (
    <DashboardShell title={contract?.campaign?.title ?? "Contract"} nav={ADVOCATE_BRAND_DEALS_NAV}>
      <Link href="/dashboard/advocate/brand-deals" className="mb-6 inline-block text-sm text-gold hover:underline">
        ← Brand deals
      </Link>

      {contract && (
        <ContractSignButton contractId={contractId} role="advocate" signed={contract.signed_by_advocate} />
      )}

      <section className="mt-8 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
        <h2 className="font-heading text-lg text-gold">FTC disclosure preview</h2>
        <p className="mt-2 font-body text-xs text-gold-body">Include this in your post (16 CFR Part 255):</p>
        <pre className="mt-2 whitespace-pre-wrap font-body text-sm text-cream">{ftcText}</pre>
      </section>

      <h2 className="mt-8 font-heading text-xl text-gold">Deliverables</h2>
      <ul className="mt-4 space-y-4">
        {deliverables.map((d) => (
          <li key={d.id} className="rounded-brand-md border border-gold/15 p-4">
            <p className="font-body text-cream">{d.deliverable_type}</p>
            <p className="text-sm capitalize text-gold-body">{d.status}</p>
            {d.status === "pending" && contract?.status === "active" && (
              <div className="mt-3 space-y-2">
                <input
                  type="url"
                  placeholder="Live post URL"
                  value={activeDelId === d.id ? submitUrl : ""}
                  onFocus={() => setActiveDelId(d.id)}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
                />
                <GoldButton label="Submit for review" onClick={() => void submitDeliverable()} variant="solid" size="sm" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-8 font-body text-xs text-gold-body">
        Questions for the Gold Partner? Use Pass-a-Note in the mobile app when your campaign thread is linked.
      </p>
    </DashboardShell>
  );
}

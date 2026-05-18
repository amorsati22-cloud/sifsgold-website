"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ContractSignButton } from "@/components/brand-deals/ContractSignButton";
import { DisputeForm } from "@/components/brand-deals/DisputeForm";
import { GoldButton } from "@/components/ui/GoldButton";
import { BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { createClient } from "@/lib/supabase/client";

type Deliverable = {
  id: string;
  deliverable_type: string;
  status: string;
  submitted_url: string | null;
  ftc_compliance_verified: boolean;
};

export default function BrandContractPage() {
  const params = useParams();
  const campaignId = params.campaign_id as string;
  const contractId = params.contract_id as string;
  const [contract, setContract] = useState<{
    signed_by_brand: boolean;
    signed_by_advocate: boolean;
    status: string;
  } | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase
      .from("campaign_contracts")
      .select("signed_by_brand, signed_by_advocate, status")
      .eq("id", contractId)
      .single()
      .then(({ data }) => setContract(data));
    void supabase
      .from("campaign_deliverables")
      .select("*")
      .eq("contract_id", contractId)
      .then(({ data }) => setDeliverables(data ?? []));
  }, [contractId]);

  async function approveDeliverable(delId: string) {
    await fetch(`/api/contracts/${contractId}/deliverables/${delId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    window.location.reload();
  }

  return (
    <DashboardShell title="Contract" nav={BRAND_DEALS_NAV}>
      <Link href={`/dashboard/brand-deals/${campaignId}`} className="mb-6 inline-block text-sm text-gold hover:underline">
        ← Campaign
      </Link>
      {contract && (
        <div className="mb-6 space-y-2">
          <p className="font-body text-sm text-cream">Status: {contract.status}</p>
          <ContractSignButton contractId={contractId} role="brand" signed={contract.signed_by_brand} />
          <p className="font-body text-xs text-gold-body">
            Advocate signature: {contract.signed_by_advocate ? "Complete" : "Pending"}
          </p>
        </div>
      )}

      <h2 className="font-heading text-xl text-gold">Deliverables</h2>
      <ul className="mt-4 space-y-4">
        {deliverables.map((d) => (
          <li key={d.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
            <p className="font-body font-medium text-cream">{d.deliverable_type}</p>
            <p className="text-sm capitalize text-gold-body">Status: {d.status}</p>
            {d.submitted_url && (
              <a href={d.submitted_url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-gold underline">
                View submission
              </a>
            )}
            <p className="mt-1 text-xs text-teal">
              FTC verified: {d.ftc_compliance_verified ? "Yes" : "Pending / failed"}
            </p>
            {(d.status === "under_review" || d.status === "submitted") && (
              <div className="mt-3 flex flex-wrap gap-2">
                <GoldButton label="Approve & pay (70/30)" onClick={() => void approveDeliverable(d.id)} variant="solid" size="sm" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <DisputeForm campaignId={campaignId} contractId={contractId} raisedByType="brand" />
    </DashboardShell>
  );
}

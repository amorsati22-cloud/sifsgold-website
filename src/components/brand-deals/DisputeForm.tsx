"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

const REASONS = [
  { value: "deliverable_not_met", label: "Deliverable not met" },
  { value: "late_delivery", label: "Late delivery" },
  { value: "misrepresented_audience", label: "Misrepresented audience" },
  { value: "payment_dispute", label: "Payment dispute" },
] as const;

type Props = {
  campaignId: string;
  contractId: string;
  raisedByType: "brand" | "advocate";
};

export function DisputeForm({ campaignId, contractId, raisedByType }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REASONS[0].value);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function submit() {
    const res = await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: campaignId,
        contract_id: contractId,
        raised_by_type: raisedByType,
        reason,
        description,
      }),
    });
    if (res.ok) {
      setStatus("sent");
      setOpen(false);
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="font-body text-sm text-teal">Dispute submitted. Our team will review within 2 business days.</p>;
  }

  if (!open) {
    return (
      <GoldButton label="Raise dispute" onClick={() => setOpen(true)} variant="ghost" size="sm" />
    );
  }

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy";

  return (
    <div className="mt-6 rounded-brand-md border border-gold/20 bg-navy-deep/50 p-4">
      <h3 className="font-heading text-lg text-gold">Dispute resolution</h3>
      <p className="mt-1 font-body text-xs text-gold-body">
        Escrow may be held pending admin review. Provide evidence (screenshots, links) in your description.
      </p>
      <label className="mt-4 block font-body text-sm text-gold">
        Reason
        <select value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass}>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block font-body text-sm text-gold">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={4}
          required
        />
      </label>
      {status === "error" && (
        <p className="mt-2 font-body text-sm text-red-400" role="alert">
          Could not submit dispute. Try again or contact support.
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <GoldButton label="Submit dispute" onClick={() => void submit()} variant="solid" size="sm" />
        <GoldButton label="Cancel" onClick={() => setOpen(false)} variant="outlined" size="sm" />
      </div>
    </div>
  );
}

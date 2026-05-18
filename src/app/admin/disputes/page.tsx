"use client";

import { useEffect, useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

type Dispute = {
  id: string;
  reason: string;
  description: string;
  status: string;
  raised_by_type: string;
  created_at: string;
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    void fetch("/api/disputes")
      .then((r) => r.json())
      .then((d) => setDisputes(d.disputes ?? []));
  }, []);

  async function resolve(disputeId: string, status: string) {
    await fetch("/api/disputes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dispute_id: disputeId,
        status,
        resolution: `Resolved ${status}`,
      }),
    });
    const res = await fetch("/api/disputes");
    const data = await res.json();
    setDisputes(data.disputes ?? []);
  }

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl text-gold">Dispute resolution</h1>
      <p className="mt-2 font-body text-cream/80">Admin queue for Brand Deal Marketplace disputes.</p>

      <ul className="mt-8 space-y-4">
        {disputes.map((d) => (
          <li key={d.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
            <p className="font-body text-sm text-gold">
              {d.raised_by_type} · {d.reason}
            </p>
            <p className="mt-2 font-body text-cream">{d.description}</p>
            <p className="mt-1 text-xs capitalize text-gold-body">{d.status}</p>
            {d.status === "open" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <GoldButton
                  label="Resolve for brand"
                  onClick={() => void resolve(d.id, "resolved_for_brand")}
                  variant="outlined"
                  size="sm"
                />
                <GoldButton
                  label="Resolve for advocate"
                  onClick={() => void resolve(d.id, "resolved_for_advocate")}
                  variant="solid"
                  size="sm"
                />
                <GoldButton
                  label="Split resolution"
                  onClick={() => void resolve(d.id, "resolved_split")}
                  variant="ghost"
                  size="sm"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {disputes.length === 0 && <p className="mt-6 font-body text-gold-body">No open disputes.</p>}
    </div>
  );
}

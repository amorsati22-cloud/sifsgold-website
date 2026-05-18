"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN_TEMPLATE_OPTIONS } from "@/lib/admin/campaigns";

type Campaign = {
  id: string;
  created_at: string;
  sent_at: string | null;
  template_key: string;
  segment: string;
  recipient_count: number;
  successful_sends: number;
  failed_sends: number;
  status: string;
};

const SEGMENTS = [
  { value: "all_waitlist", label: "All waitlist" },
  { value: "founding_members", label: "Founding members" },
  { value: "advocates", label: "Sif's Advocates (approved)" },
  { value: "custom", label: "Custom emails (comma-separated)" },
] as const;

export function CampaignsAdmin() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templateKey, setTemplateKey] = useState(CAMPAIGN_TEMPLATE_OPTIONS[0]?.key ?? "welcome_sifs_circle");
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]["value"]>("all_waitlist");
  const [customEmails, setCustomEmails] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [status, setStatus] = useState("");

  async function loadCampaigns() {
    const res = await fetch("/api/admin/campaigns");
    const data = await res.json();
    setCampaigns(data.campaigns ?? []);
  }

  useEffect(() => {
    void loadCampaigns();
  }, []);

  async function send(testOnly: boolean) {
    setStatus(testOnly ? "Sending test…" : "Sending campaign…");
    const custom_filter =
      segment === "custom"
        ? { emails: customEmails.split(/[,;\s]+/).filter(Boolean) }
        : null;

    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_key: templateKey, segment, test_only: testOnly, custom_filter }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "Send failed");
      return;
    }
    setStatus(
      testOnly
        ? "Test email sent to your inbox."
        : `Campaign sent to ${data.recipient_count} recipients (${data.successful} ok, ${data.failed} failed/skipped).`,
    );
    setConfirmOpen(false);
    void loadCampaigns();
  }

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-bold text-gold">Email campaigns</h1>
        <p className="mt-2 font-body text-cream/80">Transactional and marketing sends via Resend templates.</p>
      </header>

      <section className="mt-8 rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-6">
        <h2 className="font-heading text-lg text-gold">New campaign</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-cream/85">
            Template
            <select
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="mt-1 w-full rounded-brand-md border border-gold/25 bg-navy px-3 py-2 text-cream"
            >
              {CAMPAIGN_TEMPLATE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-cream/85">
            Segment
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as (typeof SEGMENTS)[number]["value"])}
              className="mt-1 w-full rounded-brand-md border border-gold/25 bg-navy px-3 py-2 text-cream"
            >
              {SEGMENTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {segment === "custom" ? (
          <label className="mt-4 block text-sm text-cream/85">
            Custom emails
            <textarea
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              rows={3}
              placeholder="email1@example.com, email2@example.com"
              className="mt-1 w-full rounded-brand-md border border-gold/25 bg-navy px-3 py-2 text-cream"
            />
          </label>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void send(true)}
            className="rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold"
          >
            Send test to me
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
          >
            Send to segment
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-cream/75">{status}</p> : null}
      </section>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="campaign-confirm-title"
        >
          <div className="max-w-md rounded-brand-lg border border-gold/30 bg-navy-deep p-6">
            <h3 id="campaign-confirm-title" className="font-heading text-lg text-gold">
              Confirm send
            </h3>
            <p className="mt-2 text-sm text-cream/80">
              This will email everyone in the <strong>{segment}</strong> segment using template{" "}
              <strong>{templateKey}</strong>. Continue?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => void send(false)}
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
              >
                Send now
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-10">
        <h2 className="font-heading text-lg text-gold">Past campaigns</h2>
        <ul className="mt-4 space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-brand-md border border-gold/15 px-4 py-3 text-sm text-cream/85">
              <span className="text-gold">{c.template_key}</span> · {c.segment} · {c.recipient_count} recipients ·{" "}
              {c.successful_sends}/{c.failed_sends} ok/fail · <span className="capitalize">{c.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

type Props = {
  salonId: string;
  open: boolean;
  onClose: () => void;
};

export function InviteStaffModal({ salonId, open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("pro");
  const [commission, setCommission] = useState("60");
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  if (!open) return null;

  async function submit() {
    setLoading(true);
    const res = await fetch(`/api/salons/${salonId}/staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, commission_split: Number(commission) }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.invite_url) setInviteUrl(data.invite_url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4">
      <div
        role="dialog"
        aria-labelledby="invite-title"
        className="w-full max-w-md rounded-brand-lg border border-gold/25 bg-navy-deep p-6"
      >
        <h2 id="invite-title" className="font-heading text-lg text-gold">
          Invite team member
        </h2>
        {inviteUrl ? (
          <div className="mt-4 space-y-3">
            <p className="font-body text-sm text-cream/80">Share this invite link:</p>
            <code className="block break-all rounded bg-navy px-3 py-2 font-body text-xs text-gold-body">
              {inviteUrl}
            </code>
            <button
              type="button"
              onClick={onClose}
              className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <label className="block font-body text-sm text-gold">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
              />
            </label>
            <label className="block font-body text-sm text-gold">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
              >
                <option value="pro">Pro</option>
                <option value="manager">Manager</option>
                <option value="apprentice">Apprentice</option>
              </select>
            </label>
            <label className="block font-body text-sm text-gold">
              Commission % to pro
              <input
                type="number"
                min={0}
                max={100}
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
              />
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => void submit()}
                disabled={loading || !email}
                className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send invite"}
              </button>
              <button type="button" onClick={onClose} className="font-body text-sm text-gold-body">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

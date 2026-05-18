"use client";

import { useCallback, useEffect, useState } from "react";

type Application = {
  id: string;
  email: string;
  full_name: string;
  social_handles: string | null;
  specialty: string | null;
  sample_content_urls: string[] | null;
  license_status: string | null;
  reason: string | null;
  status: string;
  reviewer_notes: string | null;
  created_at: string;
};

export function AdvocatesAdmin() {
  const [status, setStatus] = useState("pending");
  const [apps, setApps] = useState<Application[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/advocates?status=${status}`);
    const data = await res.json();
    setApps(data.applications ?? []);
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, action: "approve" | "reject" | "waitlist") {
    setBusy(id);
    await fetch("/api/admin/advocates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        action,
        reviewer_notes: notes[id] ?? "",
      }),
    });
    setBusy(null);
    void load();
  }

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-bold text-gold">Sif&apos;s Advocates</h1>
        <p className="mt-2 font-body text-cream/80">Review applications for The Gold Collective advocate program.</p>
      </header>

      <div className="mt-6 flex gap-2">
        {(["pending", "approved", "rejected", "waitlist"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              status === s ? "bg-gold text-navy" : "border border-gold/30 text-cream/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="mt-8 space-y-4">
        {apps.map((app) => (
          <li key={app.id} className="rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl text-gold">{app.full_name}</h2>
                <p className="font-body text-sm text-cream/80">{app.email}</p>
                <p className="mt-2 text-sm text-cream/70">
                  {app.specialty ?? "Specialty not listed"} · {app.license_status ?? "License N/A"}
                </p>
                {app.social_handles ? (
                  <p className="mt-1 text-sm text-cream/65">Social: {app.social_handles}</p>
                ) : null}
                {app.reason ? <p className="mt-3 text-sm text-cream/85">{app.reason}</p> : null}
                {app.sample_content_urls?.length ? (
                  <ul className="mt-2 list-inside list-disc text-sm text-gold">
                    {app.sample_content_urls.map((url) => (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <span className="rounded-full border border-gold/30 px-3 py-1 text-xs capitalize text-gold-body">
                {app.status}
              </span>
            </div>

            {status === "pending" ? (
              <div className="mt-4 space-y-3 border-t border-gold/10 pt-4">
                <label className="block text-sm text-cream/80">
                  Reviewer notes
                  <textarea
                    value={notes[app.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [app.id]: e.target.value }))}
                    rows={2}
                    className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy === app.id}
                    onClick={() => void act(app.id, "approve")}
                    className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busy === app.id}
                    onClick={() => void act(app.id, "reject")}
                    className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={busy === app.id}
                    onClick={() => void act(app.id, "waitlist")}
                    className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream"
                  >
                    Waitlist
                  </button>
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {!apps.length ? <p className="mt-8 text-cream/60">No applications in this queue.</p> : null}
    </div>
  );
}

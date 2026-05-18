"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EMAIL_TEMPLATE_TYPES } from "@/lib/email/types";

type WaitlistRow = {
  id: string;
  email: string;
  source: string;
  user_type: string | null;
  created_at: string;
  converted_to_user: boolean;
};

export function WaitlistAdmin() {
  const [rows, setRows] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [userType, setUserType] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [templateKey, setTemplateKey] = useState<string>(EMAIL_TEMPLATE_TYPES[0]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (source) params.set("source", source);
    if (userType) params.set("user_type", userType);
    const res = await fetch(`/api/admin/waitlist?${params}`);
    const data = await res.json();
    setRows(data.rows ?? []);
    setLoading(false);
  }, [q, source, userType]);

  useEffect(() => {
    void load();
  }, [load]);

  const sources = useMemo(
    () => [...new Set(rows.map((r) => r.source))].sort(),
    [rows],
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkMarkConverted() {
    if (!selected.size) return;
    await fetch("/api/admin/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], action: "mark_converted" }),
    });
    setMessage("Marked selected as converted.");
    setSelected(new Set());
    void load();
  }

  async function bulkEmail() {
    if (!selected.size) return;
    const res = await fetch("/api/admin/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: [...selected],
        action: "send_email",
        template_key: templateKey,
      }),
    });
    const data = await res.json();
    setMessage(`Email batch: ${data.sent ?? 0} sent, ${data.failed ?? 0} failed/skipped.`);
    void load();
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gold">Waitlist</h1>
          <p className="mt-2 font-body text-cream/80">Sif&apos;s Circle signups with filters and export.</p>
        </div>
        <a
          href="/api/admin/waitlist/export"
          className="rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
        >
          Export CSV
        </a>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-brand-md border border-gold/25 bg-navy-deep/80 px-3 py-2 text-sm text-cream"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-brand-md border border-gold/25 bg-navy-deep/80 px-3 py-2 text-sm text-cream"
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="User type"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="rounded-brand-md border border-gold/25 bg-navy-deep/80 px-3 py-2 text-sm text-cream"
        />
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-brand-md bg-gold px-4 py-2 text-sm font-semibold text-navy"
        >
          Apply filters
        </button>
      </div>

      {selected.size > 0 ? (
        <motion-safe className="mt-4 flex flex-wrap items-center gap-3 rounded-brand-md border border-gold/20 bg-navy-deep/60 p-4">
          <span className="text-sm text-cream/80">{selected.size} selected</span>
          <button type="button" onClick={() => void bulkMarkConverted()} className="text-sm text-gold underline">
            Mark converted
          </button>
          <select
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
            className="rounded-brand-md border border-gold/25 bg-navy-deep px-2 py-1 text-sm text-cream"
          >
            {EMAIL_TEMPLATE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => void bulkEmail()} className="text-sm text-gold underline">
            Send email to selection
          </button>
        </motion-safe>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-brand-md border border-teal/30 bg-teal/10 px-3 py-2 text-sm text-cream" role="status">
          {message}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-brand-lg border border-gold/15">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/15 bg-navy-deep/80 text-gold-body">
            <tr>
              <th className="px-3 py-2" scope="col">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">User type</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Converted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-cream/60">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-gold/10 text-cream/90">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggle(row.id)}
                      aria-label={`Select ${row.email}`}
                    />
                  </td>
                  <td className="px-3 py-2">{row.email}</td>
                  <td className="px-3 py-2">{row.source}</td>
                  <td className="px-3 py-2">{row.user_type ?? "—"}</td>
                  <td className="px-3 py-2">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{row.converted_to_user ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

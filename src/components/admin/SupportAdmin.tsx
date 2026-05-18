"use client";

import { useCallback, useEffect, useState } from "react";

type Ticket = {
  id: string;
  from_email: string;
  subject: string | null;
  body: string;
  category: string;
  status: string;
  response: string | null;
  created_at: string;
};

export function SupportAdmin() {
  const [filter, setFilter] = useState("open");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");

  const load = useCallback(async () => {
    const qs = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/admin/support${qs}`);
    const data = await res.json();
    setTickets(data.tickets ?? []);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    void load();
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    await fetch("/api/admin/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, response: reply, status: "resolved" }),
    });
    setReply("");
    setSelected(null);
    void load();
  }

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-bold text-gold">Support inbox</h1>
        <p className="mt-2 font-body text-cream/80">Contact and help submissions from Web3Forms and the site.</p>
      </header>

      <div className="mt-6 flex gap-2">
        {(["all", "open", "in_progress", "resolved", "closed"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${
              filter === s ? "bg-gold text-navy" : "border border-gold/30 text-cream/80"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 max-h-[32rem] overflow-y-auto">
          {tickets.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setSelected(t)}
                className={`w-full rounded-brand-md border px-4 py-3 text-left text-sm ${
                  selected?.id === t.id ? "border-gold bg-gold/10" : "border-gold/15 bg-navy-deep/50"
                }`}
              >
                <p className="font-medium text-gold">{t.subject ?? "No subject"}</p>
                <p className="text-cream/70">{t.from_email}</p>
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5">
            <h2 className="font-heading text-lg text-gold">{selected.subject}</h2>
            <p className="mt-1 text-sm text-cream/70">{selected.from_email} · {selected.category}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm text-cream/90">{selected.body}</p>
            <label className="mt-6 block text-sm text-cream/80">
              Reply (plain text / line breaks preserved)
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={6}
                className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy px-3 py-2 text-cream"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void sendReply()}
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
              >
                Send reply
              </button>
              <button
                type="button"
                onClick={() => void updateStatus(selected.id, "in_progress")}
                className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream"
              >
                In progress
              </button>
              <button
                type="button"
                onClick={() => void updateStatus(selected.id, "closed")}
                className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-cream/60">Select a ticket to respond.</p>
        )}
      </div>
    </div>
  );
}

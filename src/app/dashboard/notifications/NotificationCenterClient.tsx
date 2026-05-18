"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Row = { id: string; title: string; body: string | null; category: string; read: boolean; action_url: string | null; created_at: string };

export function NotificationCenterClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [category, setCategory] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const load = useCallback(async () => {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) q.set("category", category);
    if (readFilter) q.set("read", readFilter);
    const res = await fetch("/api/notifications?" + q);
    const data = await res.json();
    if (res.ok) { setRows(data.notifications ?? []); setTotal(data.total ?? 0); }
  }, [page, category, readFilter]);
  useEffect(() => { void load(); }, [load]);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="font-display text-2xl text-gold">Notifications</h1>
      <Link href="/dashboard/notifications/preferences" className="text-sm text-gold underline">Preferences</Link>
      <ul className="space-y-2">{rows.map((n) => (
        <li key={n.id} className="rounded-brand-md border border-gold/20 px-4 py-3">
          {n.action_url ? <Link href={n.action_url} className="text-cream hover:text-gold">{n.title}</Link> : <p className="text-cream">{n.title}</p>}
        </li>))}</ul>
    </div>
  );
}

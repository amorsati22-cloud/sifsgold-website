"use client";

import { useEffect, useState } from "react";
import { useVault } from "@/components/vault/VaultProvider";
import { VAULT_MAX_PIN_ATTEMPTS } from "@/lib/vault/constants";
import type { VaultAccessLogEntry } from "@/lib/vault/types";
import { createClient } from "@/lib/supabase/client";

export default function VaultAccessLogPage() {
  const { userId, settings } = useVault();
  const [logs, setLogs] = useState<VaultAccessLogEntry[]>([]);
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    let q = supabase
      .from("vault_access_log")
      .select("id, action, target_document_id, ip_address, user_agent, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (actionFilter) q = q.eq("action", actionFilter);
    void q.then(({ data }) => setLogs((data as VaultAccessLogEntry[]) ?? []));
  }, [userId, actionFilter]);

  const suspicious =
    (settings?.failed_attempts ?? 0) >= VAULT_MAX_PIN_ATTEMPTS - 1 ||
    logs.filter((l) => l.action === "failed_pin").length >= 3;

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Access log</h2>
      <p className="mt-2 font-body text-sm text-cream/75">Every unlock, view, download, and failed PIN is recorded.</p>

      {suspicious && (
        <p className="mt-4 rounded-brand-md border border-amber-500/40 bg-amber-500/10 p-3 font-body text-sm text-amber-100" role="alert">
          Suspicious activity detected: multiple failed PIN attempts. Consider changing your PIN in Settings.
        </p>
      )}

      <label className="mt-6 block font-body text-sm text-gold">
        Filter action
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="mt-1 rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
        >
          <option value="">All</option>
          <option value="unlock">Unlock</option>
          <option value="view_document">View</option>
          <option value="download_document">Download</option>
          <option value="failed_pin">Failed PIN</option>
          <option value="delete_document">Delete</option>
        </select>
      </label>

      <ul className="mt-6 space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="rounded-brand-sm border border-gold/10 bg-navy-lift px-3 py-2 font-body text-sm">
            <span className="text-gold">{new Date(l.created_at).toLocaleString()}</span>
            <span className="mx-2 text-cream/50">·</span>
            <span className="capitalize text-cream">{l.action.replace(/_/g, " ")}</span>
            {l.ip_address && <span className="ml-2 text-xs text-gold-body">{String(l.ip_address)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

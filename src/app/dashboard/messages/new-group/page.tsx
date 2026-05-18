"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CREATED_BY_ROLES, GROUP_PURPOSES } from "@/lib/messaging/constants";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ContactOption } from "@/types/messaging";

export default function NewGroupThreadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("team");
  const [createdByRole, setCreatedByRole] = useState("pro");
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [whoCanAdd, setWhoCanAdd] = useState<"all" | "admins">("admins");
  const [whoCanPost, setWhoCanPost] = useState<"all" | "admins">("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/messages/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts ?? []));
  }, []);

  const filtered = contacts.filter(
    (c) =>
      !q ||
      c.display_name.toLowerCase().includes(q.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(q.toLowerCase()),
  );

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function create() {
    if (!title.trim() || selected.length < 2) return;
    setLoading(true);
    const res = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_type: "group",
        title: title.trim(),
        participant_ids: selected,
        group_purpose: purpose,
        created_by_role: createdByRole,
        group_settings: { who_can_add: whoCanAdd, who_can_post: whoCanPost },
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (data.thread_id) router.push(`/dashboard/messages/${data.thread_id}`);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/dashboard/messages" className="font-body text-sm text-gold hover:underline">
        ← Messages
      </Link>
      <h1 className="font-heading text-2xl text-gold">New group</h1>
      <p className="font-body text-sm text-cream/75">
        Group messages are encrypted with a shared key that rotates when members change.
      </p>

      <label className="block font-body text-sm text-gold">
        Group name
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
        />
      </label>

      <label className="block font-body text-sm text-gold">
        Purpose
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream">
          {GROUP_PURPOSES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block font-body text-sm text-gold">
        Your role
        <select value={createdByRole} onChange={(e) => setCreatedByRole(e.target.value)} className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream">
          {CREATED_BY_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-2 font-body text-sm text-cream">
        <legend className="text-gold">Permissions</legend>
        <label className="flex items-center gap-2">
          Who can add members?
          <select value={whoCanAdd} onChange={(e) => setWhoCanAdd(e.target.value as "all" | "admins")} className="rounded-brand-sm border border-gold/30 bg-navy px-2 py-1">
            <option value="admins">Admins only</option>
            <option value="all">All members</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Who can post?
          <select value={whoCanPost} onChange={(e) => setWhoCanPost(e.target.value as "all" | "admins")} className="rounded-brand-sm border border-gold/30 bg-navy px-2 py-1">
            <option value="all">All members</option>
            <option value="admins">Admins only</option>
          </select>
        </label>
      </fieldset>

      <div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people…"
          className="w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-sm text-cream"
        />
        <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto">
          {filtered.map((c) => (
            <li key={c.user_id}>
              <label className="flex cursor-pointer items-center gap-2 rounded-brand-sm px-2 py-2 hover:bg-white/5">
                <input type="checkbox" checked={selected.includes(c.user_id)} onChange={() => toggle(c.user_id)} />
                <span className="font-body text-sm text-cream">{c.display_name}</span>
                {c.subtitle && <span className="text-xs text-gold-body">{c.subtitle}</span>}
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-body text-xs text-gold-body">{selected.length} selected (need 2+ besides you)</p>
      </div>

      <GoldButton
        label={loading ? "Creating…" : "Create group"}
        onClick={() => void create()}
        variant="solid"
        disabled={loading || !title.trim() || selected.length < 2}
      />
    </div>
  );
}

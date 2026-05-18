"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentCard } from "@/components/vault/DocumentCard";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/client";
import type { VaultDocument, VaultFolder } from "@/lib/vault/types";

type Filter = "all" | "starred" | "recent" | "expiring";

export default function VaultHomePage() {
  const router = useRouter();
  const { settings, unlocked, userId } = useVault();
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [folders, setFolders] = useState<VaultFolder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!settings?.pin_hash) {
      router.replace("/dashboard/vault/setup");
      return;
    }
    if (!unlocked || !userId) return;

    const supabase = createClient();
    void supabase
      .from("vault_documents")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setDocuments((data as VaultDocument[]) ?? []));

    void supabase
      .from("vault_folders")
      .select("*")
      .eq("user_id", userId)
      .is("parent_folder_id", null)
      .then(({ data }) => setFolders((data as VaultFolder[]) ?? []));
  }, [settings?.pin_hash, unlocked, userId, router]);

  const filtered = useMemo(() => {
    let list = documents;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (filter === "starred") list = list.filter((d) => d.starred);
    if (filter === "expiring") {
      const soon = Date.now() + 30 * 24 * 60 * 60 * 1000;
      list = list.filter((d) => d.expiry_date && new Date(d.expiry_date).getTime() <= soon);
    }
    if (filter === "recent") list = list.slice(0, 12);
    return list;
  }, [documents, search, filter]);

  async function toggleStar(id: string, starred: boolean) {
    const supabase = createClient();
    await supabase.from("vault_documents").update({ starred }).eq("id", id);
    setDocuments((docs) => docs.map((d) => (d.id === id ? { ...d, starred } : d)));
  }

  if (!settings?.pin_hash) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search documents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
          aria-label="Search vault"
        />
        <GoldButton label="+ New" href="/dashboard/vault/upload" variant="solid" size="sm" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Quick filters">
        {(["all", "starred", "recent", "expiring"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-brand-full px-3 py-1 font-body text-xs capitalize ${
              filter === f ? "bg-gold text-navy" : "border border-gold/30 text-cream/80"
            }`}
          >
            {f === "expiring" ? "Expiring soon" : f}
          </button>
        ))}
      </div>

      {folders.length > 0 && (
        <section className="mt-8">
          <h2 className="font-heading text-lg text-gold">Folders</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {folders.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/dashboard/vault/folder/${f.id}`}
                  className="block rounded-brand-md border border-gold/15 bg-navy-lift p-4 hover:border-gold/40"
                >
                  <span className="font-heading text-gold">{f.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-heading text-lg text-gold">Documents</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onToggleStar={toggleStar} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-4 font-body text-gold-body">No documents yet. Upload or scan to get started.</p>
        )}
      </section>
    </div>
  );
}

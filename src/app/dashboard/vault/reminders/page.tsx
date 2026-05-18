"use client";

import { useEffect, useState } from "react";
import { DocumentCard } from "@/components/vault/DocumentCard";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import type { VaultDocument } from "@/lib/vault/types";
import { createClient } from "@/lib/supabase/client";

export default function VaultRemindersPage() {
  const { userId, unlocked } = useVault();
  const [docs, setDocs] = useState<VaultDocument[]>([]);

  useEffect(() => {
    if (!userId || !unlocked) return;
    const supabase = createClient();
    const in60 = new Date();
    in60.setDate(in60.getDate() + 60);
    const today = new Date().toISOString().slice(0, 10);
    void supabase
      .from("vault_documents")
      .select("*")
      .eq("user_id", userId)
      .not("expiry_date", "is", null)
      .lte("expiry_date", in60.toISOString().slice(0, 10))
      .gte("expiry_date", today)
      .order("expiry_date", { ascending: true })
      .then(({ data }) => setDocs((data as VaultDocument[]) ?? []));
  }, [userId, unlocked]);

  async function markRenewed(id: string) {
    const supabase = createClient();
    const next = new Date();
    next.setFullYear(next.getFullYear() + 1);
    await supabase
      .from("vault_documents")
      .update({ expiry_date: next.toISOString().slice(0, 10) })
      .eq("id", id);
    setDocs((d) => d.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Expiry reminders</h2>
      <p className="mt-2 font-body text-sm text-cream/75">Licenses, insurance, and certifications expiring in the next 60 days.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <div key={doc.id}>
            <DocumentCard doc={doc} />
            <GoldButton
              label="Mark renewed (+1 year)"
              onClick={() => void markRenewed(doc.id)}
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
            />
          </div>
        ))}
      </div>
      {docs.length === 0 && <p className="mt-6 text-gold-body">No upcoming expirations.</p>}
    </div>
  );
}

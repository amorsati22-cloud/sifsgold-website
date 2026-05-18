"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DocumentCard } from "@/components/vault/DocumentCard";
import { useVault } from "@/components/vault/VaultProvider";
import type { VaultDocument, VaultFolder } from "@/lib/vault/types";
import { createClient } from "@/lib/supabase/client";

export default function VaultFolderPage() {
  const params = useParams();
  const folderId = params.folder_id as string;
  const { userId, unlocked } = useVault();
  const [folder, setFolder] = useState<VaultFolder | null>(null);
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [subfolders, setSubfolders] = useState<VaultFolder[]>([]);

  useEffect(() => {
    if (!userId || !unlocked) return;
    const supabase = createClient();
    void supabase.from("vault_folders").select("*").eq("id", folderId).single().then(({ data }) => setFolder(data as VaultFolder));
    void supabase
      .from("vault_documents")
      .select("*")
      .eq("folder_id", folderId)
      .then(({ data }) => setDocuments((data as VaultDocument[]) ?? []));
    void supabase
      .from("vault_folders")
      .select("*")
      .eq("parent_folder_id", folderId)
      .then(({ data }) => setSubfolders((data as VaultFolder[]) ?? []));
  }, [folderId, userId, unlocked]);

  return (
    <div>
      <Link href="/dashboard/vault" className="text-sm text-gold hover:underline">
        ← Vault
      </Link>
      <h2 className="mt-4 font-heading text-2xl text-gold">{folder?.name ?? "Folder"}</h2>

      {subfolders.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {subfolders.map((f) => (
            <li key={f.id}>
              <Link href={`/dashboard/vault/folder/${f.id}`} className="block rounded-brand-md border border-gold/15 p-3 text-gold">
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
      {documents.length === 0 && <p className="mt-4 text-gold-body">This folder is empty.</p>}
    </div>
  );
}

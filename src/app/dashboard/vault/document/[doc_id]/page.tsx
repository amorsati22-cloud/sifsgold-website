"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { logVaultAccess } from "@/lib/vault/access-log-client";
import { decryptMetadata } from "@/lib/vault/encryption";
import { downloadAndDecryptDocument } from "@/lib/vault/storage";
import type { VaultDocument, VaultDocumentMetadata } from "@/lib/vault/types";
import { createClient } from "@/lib/supabase/client";

const PdfViewer = dynamic(() => import("@/components/vault/PdfViewer").then((m) => m.PdfViewer), {
  ssr: false,
});

export default function VaultDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.doc_id as string;
  const { cryptoKey, unlocked } = useVault();
  const [doc, setDoc] = useState<VaultDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<VaultDocumentMetadata>({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from("vault_documents")
      .select("*")
      .eq("id", docId)
      .single()
      .then(async ({ data }) => {
        if (!data) return;
        setDoc(data as VaultDocument);
        if (cryptoKey && data.encrypted_metadata) {
          try {
            const m = await decryptMetadata<VaultDocumentMetadata>(cryptoKey, data.encrypted_metadata);
            setMeta(m);
            setNotes(m.notes ?? "");
          } catch {
            /* ignore */
          }
        }
      });
  }, [docId, cryptoKey]);

  useEffect(() => {
    if (!doc || !cryptoKey || !unlocked) return;
    let objectUrl: string | null = null;

    void (async () => {
      const blob = await downloadAndDecryptDocument(doc.file_url, cryptoKey, doc.mime_type ?? "application/octet-stream");
      if ("error" in blob) return;
      objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
      await logVaultAccess({ action: "view_document", target_document_id: docId });
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc, cryptoKey, unlocked, docId]);

  async function saveMeta() {
    if (!cryptoKey || !doc) return;
    const { encryptMetadata } = await import("@/lib/vault/encryption");
    const payload = await encryptMetadata(cryptoKey, { ...meta, notes });
    const supabase = createClient();
    await supabase.from("vault_documents").update({ encrypted_metadata: payload, name: doc.name }).eq("id", docId);
    await logVaultAccess({ action: "edit_document", target_document_id: docId });
  }

  async function download() {
    if (!previewUrl || !doc) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = doc.name;
    a.click();
    await logVaultAccess({ action: "download_document", target_document_id: docId });
  }

  async function deleteDoc() {
    if (!confirm("Permanently delete this document?")) return;
    const supabase = createClient();
    await supabase.storage.from("vault-documents").remove([doc!.file_url]);
    await supabase.from("vault_documents").delete().eq("id", docId);
    await logVaultAccess({ action: "delete_document", target_document_id: docId });
    router.push("/dashboard/vault");
  }

  if (!doc) return <p className="text-gold-body">Loading…</p>;

  return (
    <div>
      <Link href="/dashboard/vault" className="text-sm text-gold hover:underline">
        ← Vault
      </Link>
      <h2 className="mt-4 font-heading text-2xl text-gold">{doc.name}</h2>
      <p className="mt-1 font-body text-xs capitalize text-gold-body">{doc.document_type.replace("_", " ")}</p>

      {previewUrl && doc.mime_type?.startsWith("image/") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt={doc.name} className="mt-6 max-h-[480px] rounded-brand-md border border-gold/20" />
      )}
      {previewUrl && doc.mime_type === "application/pdf" && <PdfViewer fileUrl={previewUrl} />}

      <div className="mt-8 flex flex-wrap gap-2">
        <GoldButton label="Download" onClick={() => void download()} variant="outlined" size="sm" />
        <GoldButton label="Share" href={`/dashboard/vault/share/${docId}`} variant="outlined" size="sm" />
        <GoldButton label="Delete" onClick={() => void deleteDoc()} variant="ghost" size="sm" />
      </div>

      <section className="mt-8 rounded-brand-md border border-gold/15 p-4">
        <h3 className="font-heading text-lg text-gold">Metadata</h3>
        <label className="mt-3 block font-body text-sm text-gold">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
          />
        </label>
        <label className="mt-3 block font-body text-sm text-gold">
          Expiry date
          <input
            type="date"
            value={doc.expiry_date ?? ""}
            onChange={(e) => setDoc({ ...doc, expiry_date: e.target.value || null })}
            className="mt-1 rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
          />
        </label>
        <GoldButton label="Save" onClick={() => void saveMeta()} variant="solid" size="sm" className="mt-4" />
      </section>
    </div>
  );
}

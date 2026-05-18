"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { logVaultAccess } from "@/lib/vault/access-log-client";
import { DOCUMENT_TYPES } from "@/lib/vault/constants";
import { encryptMetadata } from "@/lib/vault/encryption";
import { uploadEncryptedDocument, vaultStoragePath } from "@/lib/vault/storage";
import { createClient } from "@/lib/supabase/client";

type FileRow = {
  file: File;
  name: string;
  document_type: string;
  progress: number;
};

export default function VaultUploadPage() {
  const router = useRouter();
  const { cryptoKey, userId, unlocked } = useVault();
  const [rows, setRows] = useState<FileRow[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setRows((r) => [
      ...r,
      ...files.map((file) => ({
        file,
        name: file.name,
        document_type: "other",
        progress: 0,
      })),
    ]);
  }, []);

  async function uploadAll() {
    if (!cryptoKey || !userId || !unlocked) return;
    const supabase = createClient();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, progress: 10 } : r)));

      const docId = crypto.randomUUID();
      const path = vaultStoragePath(userId, docId);
      const uploaded = await uploadEncryptedDocument(userId, docId, row.file, cryptoKey, row.file.type);
      if ("error" in uploaded) continue;

      const meta = await encryptMetadata(cryptoKey, { notes: "", tags: [] });
      await supabase.from("vault_documents").insert({
        id: docId,
        user_id: userId,
        folder_id: folderId,
        name: row.name,
        document_type: row.document_type,
        file_url: path,
        file_size_bytes: row.file.size,
        mime_type: row.file.type,
        encrypted_metadata: meta,
      });

      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, progress: 100 } : r)));
    }

    await logVaultAccess({ action: "edit_document" });
    router.push("/dashboard/vault");
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Upload documents</h2>
      <p className="mt-2 font-body text-sm text-cream/75">
        Files are encrypted in your browser (AES-256-GCM) before upload. Only you can decrypt them with your Vault PIN.
      </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-brand-lg border-2 border-dashed border-gold/30 bg-navy-lift/50 p-8"
      >
        <p className="font-body text-cream/80">Drag and drop files here</p>
        <label className="mt-4 cursor-pointer font-body text-sm text-gold underline">
          Or browse
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setRows((r) => [
                ...r,
                ...files.map((file) => ({ file, name: file.name, document_type: "other", progress: 0 })),
              ]);
            }}
          />
        </label>
      </div>

      <ul className="mt-6 space-y-4">
        {rows.map((row, i) => (
          <li key={i} className="rounded-brand-md border border-gold/15 p-4">
            <input
              value={row.name}
              onChange={(e) =>
                setRows((prev) => prev.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
              }
              className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-cream"
            />
            <select
              value={row.document_type}
              onChange={(e) =>
                setRows((prev) => prev.map((r, j) => (j === i ? { ...r, document_type: e.target.value } : r)))
              }
              className="mt-2 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {row.progress > 0 && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-deep">
                <div className="h-full bg-gold transition-all" style={{ width: `${row.progress}%` }} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <GoldButton
        label="Encrypt & upload"
        onClick={() => void uploadAll()}
        variant="solid"
        className="mt-6"
        disabled={rows.length === 0 || !unlocked}
      />
    </div>
  );
}

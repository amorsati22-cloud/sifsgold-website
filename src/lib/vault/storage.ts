"use client";

import { createClient } from "@/lib/supabase/client";
import { VAULT_SIGNED_URL_EXPIRY_SEC, VAULT_STORAGE_BUCKET } from "@/lib/vault/constants";
import { decryptFilePayload, encryptFile } from "@/lib/vault/encryption";

export function vaultStoragePath(userId: string, documentId: string): string {
  return `${userId}/${documentId}.vault`;
}

export async function uploadEncryptedDocument(
  userId: string,
  documentId: string,
  file: Blob,
  key: CryptoKey,
  mimeType: string,
): Promise<{ path: string; size: number } | { error: string }> {
  const supabase = createClient();
  const encrypted = await encryptFile(key, file);
  const path = vaultStoragePath(userId, documentId);

  const { error } = await supabase.storage.from(VAULT_STORAGE_BUCKET).upload(path, encrypted, {
    upsert: true,
    contentType: "application/octet-stream",
  });

  if (error) return { error: error.message };
  return { path, size: encrypted.size };
}

export async function getSignedVaultUrl(path: string): Promise<{ url: string } | { error: string }> {
  const res = await fetch("/api/vault/signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  const data = await res.json();
  if (!res.ok) return { error: (data as { error?: string }).error ?? "Failed to sign URL" };
  return { url: (data as { url: string }).url };
}

export async function downloadAndDecryptDocument(
  path: string,
  key: CryptoKey,
  mimeType: string,
): Promise<Blob | { error: string }> {
  const signed = await getSignedVaultUrl(path);
  if ("error" in signed) return signed;

  const res = await fetch(signed.url);
  if (!res.ok) return { error: "Download failed" };
  const encryptedBlob = await res.blob();
  const decrypted = await decryptFilePayload(key, encryptedBlob);
  return new Blob([await decrypted.arrayBuffer()], { type: mimeType });
}

export async function deleteVaultFile(path: string): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(VAULT_STORAGE_BUCKET).remove([path]);
  if (error) return { error: error.message };
  return {};
}

export { VAULT_SIGNED_URL_EXPIRY_SEC };

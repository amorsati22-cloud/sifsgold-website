"use client";

export async function logVaultAccess(params: {
  action: string;
  target_document_id?: string;
}): Promise<void> {
  await fetch("/api/vault/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

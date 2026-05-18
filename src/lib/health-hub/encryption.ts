import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Encrypt plaintext via Supabase pgcrypto RPC before INSERT/UPDATE. */
export async function encryptOnWrite(
  supabase: SupabaseClient,
  plain: string | null | undefined,
): Promise<string | null> {
  const trimmed = plain?.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase.rpc("encrypt_health_text", {
    plain: trimmed,
  });

  if (error) {
    throw new Error(`Failed to encrypt health field: ${error.message}`);
  }

  return data as string;
}

/** Decrypt ciphertext via Supabase pgcrypto RPC after SELECT. */
export async function decryptOnRead(
  supabase: SupabaseClient,
  cipher: string | null | undefined,
): Promise<string | null> {
  if (!cipher?.trim()) return null;

  const { data, error } = await supabase.rpc("decrypt_health_text", {
    cipher,
  });

  if (error) {
    throw new Error(`Failed to decrypt health field: ${error.message}`);
  }

  return (data as string | null) ?? null;
}

export async function decryptFields<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  row: T,
  encryptedKeys: (keyof T)[],
): Promise<T> {
  const out = { ...row };
  for (const key of encryptedKeys) {
    const val = row[key];
    if (typeof val === "string" && val.length > 0) {
      (out as Record<string, unknown>)[key as string] = await decryptOnRead(supabase, val);
    }
  }
  return out;
}

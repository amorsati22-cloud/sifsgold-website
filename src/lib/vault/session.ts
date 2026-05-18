"use client";

import { VAULT_CRYPTO_KEY_STORAGE, VAULT_SESSION_KEY } from "@/lib/vault/constants";
import { exportVaultKey, importVaultKey } from "@/lib/vault/encryption";

type VaultSession = {
  unlockedUntil: number;
  userId: string;
};

export function getVaultSession(): VaultSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(VAULT_SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as VaultSession;
    if (Date.now() > session.unlockedUntil) {
      clearVaultSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isVaultUnlocked(userId: string): boolean {
  const session = getVaultSession();
  return session?.userId === userId && Date.now() < session.unlockedUntil;
}

export async function storeVaultUnlock(userId: string, key: CryptoKey, reauthMinutes: number): Promise<void> {
  const keyB64 = await exportVaultKey(key);
  sessionStorage.setItem(VAULT_CRYPTO_KEY_STORAGE, keyB64);
  const session: VaultSession = {
    userId,
    unlockedUntil: Date.now() + reauthMinutes * 60 * 1000,
  };
  sessionStorage.setItem(VAULT_SESSION_KEY, JSON.stringify(session));
}

export async function getVaultCryptoKey(): Promise<CryptoKey | null> {
  const b64 = sessionStorage.getItem(VAULT_CRYPTO_KEY_STORAGE);
  if (!b64) return null;
  try {
    return importVaultKey(b64);
  } catch {
    return null;
  }
}

export function clearVaultSession(): void {
  sessionStorage.removeItem(VAULT_SESSION_KEY);
  sessionStorage.removeItem(VAULT_CRYPTO_KEY_STORAGE);
}

export function extendVaultSession(reauthMinutes: number, userId: string): void {
  const session = getVaultSession();
  if (!session || session.userId !== userId) return;
  session.unlockedUntil = Date.now() + reauthMinutes * 60 * 1000;
  sessionStorage.setItem(VAULT_SESSION_KEY, JSON.stringify(session));
}

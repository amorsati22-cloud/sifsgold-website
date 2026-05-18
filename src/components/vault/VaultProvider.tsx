"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { logVaultAccess } from "@/lib/vault/access-log-client";
import { deriveVaultKeyForUser } from "@/lib/vault/encryption";
import { hashVaultPin, verifyVaultPin } from "@/lib/vault/pin";
import {
  clearVaultSession,
  getVaultCryptoKey,
  getVaultSession,
  isVaultUnlocked,
  storeVaultUnlock,
} from "@/lib/vault/session";
import type { VaultSettings } from "@/lib/vault/types";
import { PinPad } from "@/components/vault/PinPad";

type VaultContextValue = {
  userId: string | null;
  settings: VaultSettings | null;
  unlocked: boolean;
  cryptoKey: CryptoKey | null;
  lock: () => void;
  refreshSettings: () => Promise<void>;
  setupPin: (pin: string, backupEmail: string, reauthMinutes: number) => Promise<{ error?: string }>;
};

const VaultContext = createContext<VaultContextValue | null>(null);

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}

export function VaultProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [settings, setSettings] = useState<VaultSettings | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("vault_settings").select("*").eq("id", userId).maybeSingle();
    setSettings((data as VaultSettings) ?? null);
  }, [userId]);

  useEffect(() => {
    void refreshSettings().finally(() => setLoading(false));
  }, [refreshSettings]);

  useEffect(() => {
    async function syncUnlock() {
      if (isVaultUnlocked(userId)) {
        const key = await getVaultCryptoKey();
        if (key) {
          setCryptoKey(key);
          setUnlocked(true);
        }
      }
    }
    void syncUnlock();
  }, [userId]);

  useEffect(() => {
    if (!settings?.auto_lock_on_tab_close) return;
    const onUnload = () => clearVaultSession();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [settings?.auto_lock_on_tab_close]);

  const lock = useCallback(() => {
    clearVaultSession();
    setUnlocked(false);
    setCryptoKey(null);
  }, []);

  const unlockWithPin = useCallback(
    async (pin: string) => {
      setPinError(null);
      if (!settings?.pin_hash) {
        setPinError("Set up your Vault PIN first.");
        return;
      }
      if (settings.locked_until && new Date(settings.locked_until) > new Date()) {
        setPinError("Vault locked. Try again after 15 minutes.");
        return;
      }

      const valid = await verifyVaultPin(pin, settings.pin_hash);
      if (!valid) {
        const res = await fetch("/api/vault/pin-attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ success: false }),
        });
        const data = await res.json();
        if (data.locked_until) {
          setPinError("Too many attempts. Vault locked for 15 minutes.");
          await refreshSettings();
        } else {
          setPinError(`Incorrect PIN (${data.failed_attempts ?? "?"}/${5} attempts)`);
          await refreshSettings();
        }
        return;
      }

      await fetch("/api/vault/pin-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      });

      const key = await deriveVaultKeyForUser(pin, userId);
      await storeVaultUnlock(userId, key, settings.reauthenticate_after_minutes ?? 5);
      setCryptoKey(key);
      setUnlocked(true);
      await logVaultAccess({ action: "unlock" });
    },
    [settings, userId, refreshSettings],
  );

  const setupPin = useCallback(
    async (pin: string, backupEmail: string, reauthMinutes: number) => {
      const pinHash = await hashVaultPin(pin);
      const supabase = createClient();
      const { error } = await supabase.from("vault_settings").upsert({
        id: userId,
        pin_hash: pinHash,
        pin_set_at: new Date().toISOString(),
        backup_email: backupEmail,
        reauthenticate_after_minutes: reauthMinutes,
        failed_attempts: 0,
        locked_until: null,
      });
      if (error) return { error: error.message };
      await refreshSettings();
      const key = await deriveVaultKeyForUser(pin, userId);
      await storeVaultUnlock(userId, key, reauthMinutes);
      setCryptoKey(key);
      setUnlocked(true);
      return {};
    },
    [userId, refreshSettings],
  );

  const value = useMemo(
    () => ({
      userId,
      settings,
      unlocked,
      cryptoKey,
      lock,
      refreshSettings,
      setupPin,
    }),
    [userId, settings, unlocked, cryptoKey, lock, refreshSettings, setupPin],
  );

  if (loading) {
    return <p className="font-body text-gold-body">Loading Vault…</p>;
  }

  if (!settings?.pin_hash) {
    return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
  }

  if (!unlocked) {
    return (
      <VaultContext.Provider value={value}>
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
          <PinPad
            title="Unlock The Vault"
            subtitle="Your PIN is separate from your account password. Sif's Gold cannot recover a forgotten PIN."
            onComplete={unlockWithPin}
            error={pinError}
          />
        </div>
      </VaultContext.Provider>
    );
  }

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

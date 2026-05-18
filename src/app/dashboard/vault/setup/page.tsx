"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { PinPad } from "@/components/vault/PinPad";
import { validatePinFormat } from "@/lib/vault/pin";

export default function VaultSetupPage() {
  const router = useRouter();
  const { setupPin, settings, userId } = useVault();
  const [step, setStep] = useState<"pin" | "confirm" | "details">("pin");
  const [pin, setPin] = useState("");
  const [backupEmail, setBackupEmail] = useState("");
  const [reauthMinutes, setReauthMinutes] = useState(5);
  const [autoLockTab, setAutoLockTab] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (settings?.pin_hash) {
    router.replace("/dashboard/vault");
    return null;
  }

  async function completeSetup() {
    if (!backupEmail.includes("@")) {
      setError("Enter a valid backup email");
      return;
    }
    setLoading(true);
    const result = await setupPin(pin, backupEmail, reauthMinutes);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase
      .from("vault_settings")
      .update({ auto_lock_on_tab_close: autoLockTab })
      .eq("id", userId ?? "");
    router.push("/dashboard/vault");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-heading text-2xl text-gold">Set up The Vault</h2>
      <p className="mt-3 font-body text-cream/85">
        Private, encrypted storage for licenses, color formulas, contracts, insurance, and client records.
      </p>
      <p className="mt-4 rounded-brand-md border border-amber-500/30 bg-amber-500/10 p-4 font-body text-sm text-amber-100">
        <strong className="text-amber-200">Important:</strong> Sif&apos;s Gold cannot recover your Vault PIN. If
        you forget it, you lose access to encrypted contents.
      </p>

      {step === "pin" && (
        <div className="mt-8">
          <PinPad
            title="Create PIN (4–6 digits)"
            onComplete={(p) => {
              const check = validatePinFormat(p);
              if (!check.ok) {
                setError(check.error ?? null);
                return;
              }
              setPin(p);
              setError(null);
              setStep("confirm");
            }}
            error={error}
            maxLength={6}
          />
        </div>
      )}

      {step === "confirm" && (
        <div className="mt-8">
          <PinPad
            title="Confirm PIN"
            onComplete={(p) => {
              if (p !== pin) {
                setError("PINs do not match");
                return;
              }
              setError(null);
              setStep("details");
            }}
            error={error}
            maxLength={6}
          />
          <GoldButton label="Back" onClick={() => setStep("pin")} variant="ghost" className="mt-4" />
        </div>
      )}

      {step === "details" && (
        <div className="mt-8 space-y-4">
          <label className="block font-body text-sm text-gold">
            Backup email
            <input
              type="email"
              value={backupEmail}
              onChange={(e) => setBackupEmail(e.target.value)}
              className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block font-body text-sm text-gold">
            Re-enter PIN after (minutes)
            <select
              value={reauthMinutes}
              onChange={(e) => setReauthMinutes(Number(e.target.value))}
              className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
            >
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input type="checkbox" checked={autoLockTab} onChange={(e) => setAutoLockTab(e.target.checked)} />
            Lock Vault when browser tab closes
          </label>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <GoldButton
            label={loading ? "Securing Vault…" : "Create Vault"}
            onClick={() => void completeSetup()}
            variant="solid"
          />
        </div>
      )}
    </div>
  );
}

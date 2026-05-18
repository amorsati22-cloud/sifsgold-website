"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/components/vault/VaultProvider";
import { PinPad } from "@/components/vault/PinPad";
import { GoldButton } from "@/components/ui/GoldButton";
import { hashVaultPin, validatePinFormat } from "@/lib/vault/pin";
import { clearVaultSession } from "@/lib/vault/session";
import { createClient } from "@/lib/supabase/client";
import JSZip from "jszip";

export default function VaultSettingsPage() {
  const router = useRouter();
  const { settings, lock, userId, refreshSettings } = useVault();
  const [reauthMinutes, setReauthMinutes] = useState(settings?.reauthenticate_after_minutes ?? 5);
  const [showPinChange, setShowPinChange] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [exporting, setExporting] = useState(false);

  async function saveInterval() {
    const supabase = createClient();
    await supabase.from("vault_settings").update({ reauthenticate_after_minutes: reauthMinutes }).eq("id", userId!);
    await refreshSettings();
  }

  async function changePin(newPin: string) {
    const check = validatePinFormat(newPin);
    if (!check.ok) return;
    const pinHash = await hashVaultPin(newPin);
    const supabase = createClient();
    await supabase
      .from("vault_settings")
      .update({ pin_hash: pinHash, pin_set_at: new Date().toISOString(), failed_attempts: 0 })
      .eq("id", userId!);
    clearVaultSession();
    lock();
    setShowPinChange(false);
    router.push("/dashboard/vault");
  }

  async function exportVault() {
    setExporting(true);
    const supabase = createClient();
    const { data: docs } = await supabase.from("vault_documents").select("id, name, file_url, encrypted_metadata");
    const zip = new JSZip();
    zip.file(
      "README.txt",
      "Encrypted Vault export. Files remain encrypted — decrypt with your Vault PIN in the Sif's Gold app.",
    );
    zip.file("manifest.json", JSON.stringify(docs ?? [], null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vault-export-${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    setExporting(false);
    await fetch("/api/vault/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export_vault" }),
    });
  }

  async function deleteVault() {
    if (deleteConfirm !== "DELETE MY VAULT") return;
    const supabase = createClient();
    const { data: docs } = await supabase.from("vault_documents").select("file_url");
    const paths = (docs ?? []).map((d) => d.file_url);
    if (paths.length) await supabase.storage.from("vault-documents").remove(paths);
    await supabase.from("vault_documents").delete().eq("user_id", userId!);
    await supabase.from("vault_folders").delete().eq("user_id", userId!);
    await supabase.from("vault_settings").delete().eq("id", userId!);
    clearVaultSession();
    router.push("/dashboard");
  }

  return (
    <div className="max-w-lg space-y-8">
      <section>
        <h2 className="font-heading text-lg text-gold">Auto-lock</h2>
        <label className="mt-3 block font-body text-sm text-gold">
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
        <GoldButton label="Save" onClick={() => void saveInterval()} variant="outlined" size="sm" className="mt-3" />
      </section>

      <section>
        <h2 className="font-heading text-lg text-gold">Change PIN</h2>
        {!showPinChange ? (
          <GoldButton label="Change PIN" onClick={() => setShowPinChange(true)} variant="outlined" size="sm" className="mt-3" />
        ) : (
          <div className="mt-4">
            <PinPad title="New PIN" onComplete={(p) => void changePin(p)} maxLength={6} />
          </div>
        )}
      </section>

      <section>
        <h2 className="font-heading text-lg text-gold">Export</h2>
        <p className="mt-2 font-body text-xs text-cream/70">Downloads an encrypted ZIP manifest. Files stay encrypted.</p>
        <GoldButton
          label={exporting ? "Exporting…" : "Export Vault"}
          onClick={() => void exportVault()}
          variant="outlined"
          size="sm"
          className="mt-3"
        />
      </section>

      <section className="rounded-brand-md border border-red-500/30 p-4">
        <h2 className="font-heading text-lg text-red-300">Delete Vault</h2>
        <p className="mt-2 font-body text-xs text-cream/70">Type DELETE MY VAULT to confirm. This cannot be undone.</p>
        <input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="mt-3 w-full rounded-brand-sm border border-red-500/40 bg-navy px-3 py-2 font-body text-cream"
        />
        <GoldButton label="Permanently delete" onClick={() => void deleteVault()} variant="ghost" size="sm" className="mt-3 text-red-300" />
      </section>

      <GoldButton label="Lock Vault now" onClick={lock} variant="solid" />
    </div>
  );
}

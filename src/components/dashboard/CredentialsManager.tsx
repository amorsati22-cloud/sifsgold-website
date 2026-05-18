"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Credential } from "@/types/pro-profile";

type CredentialsManagerProps = {
  proId: string;
  initial: Credential[];
};

export function CredentialsManager({ proId, initial }: CredentialsManagerProps) {
  const [items, setItems] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);

  async function addCredential(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("credentials")
      .insert({
        pro_id: proId,
        type: String(form.get("type")),
        name: String(form.get("name")),
        issuing_authority: String(form.get("issuing_authority") || "") || null,
        issue_date: String(form.get("issue_date") || "") || null,
        expiry_date: String(form.get("expiry_date") || "") || null,
        verification_url: String(form.get("verification_url") || "") || null,
        public: form.get("public") === "on",
      })
      .select()
      .single();

    if (error || !data) {
      setMessage("Could not add credential.");
      return;
    }
    setItems((prev) => [...prev, data as Credential]);
    e.currentTarget.reset();
    setMessage("Credential added.");
  }

  async function togglePublic(id: string, isPublic: boolean) {
    const supabase = createClient();
    await supabase.from("credentials").update({ public: isPublic }).eq("id", id);
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, public: isPublic } : c)));
  }

  async function uploadVerification(id: string, file: File) {
    const supabase = createClient();
    const path = `${proId}/${id}/${file.name}`;
    await supabase.storage.from("credential-documents").upload(path, file, { upsert: true });
    await supabase.from("credentials").update({ verification_document_path: path }).eq("id", id);
    setMessage("Verification document uploaded (private, admin review only).");
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Credentials</h2>
      <p className="mt-1 font-body text-sm text-gold-body">
        Mark credentials public to show on your profile. Verification documents stay private.
      </p>

      <ul className="mt-6 list-none space-y-3 p-0">
        {items.map((cred) => (
          <li key={cred.id} className="rounded-brand-md border border-gold/15 p-4">
            <p className="font-heading text-cream">{cred.name}</p>
            <p className="font-body text-xs text-gold-body">{cred.type}</p>
            <label className="mt-2 flex items-center gap-2 font-body text-sm text-cream">
              <input
                type="checkbox"
                checked={cred.public}
                onChange={(e) => togglePublic(cred.id, e.target.checked)}
              />
              Public on profile
            </label>
            <label className="mt-2 block font-body text-xs text-cream/70">
              Upload verification (private)
              <input
                type="file"
                className="mt-1 block w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadVerification(cred.id, file);
                }}
              />
            </label>
            {cred.expiry_date ? (
              <p className="mt-1 font-body text-xs text-cream/50">Expires {cred.expiry_date}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <form onSubmit={addCredential} className="mt-8 space-y-3 rounded-brand-lg border border-gold/10 p-4">
        <h3 className="font-heading text-lg text-gold">Add credential</h3>
        <label className="block font-body text-sm text-cream">
          Type
          <select name="type" required className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream">
            <option value="license">License</option>
            <option value="certification">Certification</option>
            <option value="continuing_education">Continuing education</option>
            <option value="award">Award</option>
          </select>
        </label>
        <label className="block font-body text-sm text-cream">
          Name
          <input name="name" required className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream" />
        </label>
        <label className="block font-body text-sm text-cream">
          Issuing authority
          <input name="issuing_authority" className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block font-body text-sm text-cream">
            Issue date
            <input type="date" name="issue_date" className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream" />
          </label>
          <label className="block font-body text-sm text-cream">
            Expiry date
            <input type="date" name="expiry_date" className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream" />
          </label>
        </div>
        <label className="block font-body text-sm text-cream">
          Verification URL
          <input name="verification_url" type="url" className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream" />
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input type="checkbox" name="public" defaultChecked />
          Show on public profile
        </label>
        <button type="submit" className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy">
          Add credential
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-teal">{message}</p> : null}
    </div>
  );
}

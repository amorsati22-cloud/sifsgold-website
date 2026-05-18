"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import { SHARE_EXPIRY_OPTIONS } from "@/lib/vault/constants";
import { createClient } from "@/lib/supabase/client";

export default function VaultSharePage() {
  const params = useParams();
  const docId = params.doc_id as string;
  const [hours, setHours] = useState(24);
  const [maxViews, setMaxViews] = useState<number | "">(10);
  const [password, setPassword] = useState("");
  const [link, setLink] = useState<string | null>(null);

  async function createShare() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const token = crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    let passwordHash: string | null = null;
    if (password) {
      const { hashVaultPin } = await import("@/lib/vault/pin");
      passwordHash = await hashVaultPin(password);
    }

    await supabase.from("vault_shared_documents").insert({
      document_id: docId,
      owner_user_id: user.id,
      share_link_token: token,
      expires_at: expiresAt,
      max_views: maxViews === "" ? null : Number(maxViews),
      password_protected: Boolean(password),
      password_hash: passwordHash,
      view_only: true,
    });

    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    setLink(`${base}/vault/share/${token}`);
  }

  return (
    <div>
      <Link href={`/dashboard/vault/document/${docId}`} className="text-sm text-gold hover:underline">
        ← Document
      </Link>
      <h2 className="mt-4 font-heading text-xl text-gold">Share document</h2>

      <label className="mt-6 block font-body text-sm text-gold">
        Link expires
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
        >
          {SHARE_EXPIRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block font-body text-sm text-gold">
        Max views (optional)
        <input
          type="number"
          min={1}
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : "")}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
        />
      </label>

      <label className="mt-4 block font-body text-sm text-gold">
        Password (optional)
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-cream"
        />
      </label>

      <GoldButton label="Generate link" onClick={() => void createShare()} variant="solid" className="mt-6" />

      {link && (
        <p className="mt-4 break-all rounded-brand-md border border-teal/30 bg-teal/10 p-3 font-mono text-sm text-cream">
          {link}
        </p>
      )}
    </div>
  );
}

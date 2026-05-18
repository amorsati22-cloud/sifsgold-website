"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PublicVaultSharePage() {
  const params = useParams();
  const token = params.token as string;
  const [message, setMessage] = useState("Loading shared document…");

  useEffect(() => {
    const supabase = createClient();
    void supabase.rpc("get_vault_share_public", { share_token: token }).then(({ data, error }) => {
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row) {
        setMessage("This link is invalid or has expired.");
        return;
      }
      if (row.max_views != null && row.view_count >= row.max_views) {
        setMessage("This link has reached its maximum number of views.");
        return;
      }
      setMessage(
        `Shared document: ${row.document_name ?? "Document"}. Files remain encrypted — contact the professional for access through Sif's Gold.`,
      );
    });
  }, [token]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center bg-navy px-4 py-16 text-center">
      <h1 className="font-heading text-2xl text-gold">Vault share</h1>
      <p className="mt-4 font-body text-cream/85">{message}</p>
    </div>
  );
}

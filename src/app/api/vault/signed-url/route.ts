import { NextResponse } from "next/server";
import { VAULT_SIGNED_URL_EXPIRY_SEC, VAULT_STORAGE_BUCKET } from "@/lib/vault/constants";
import { getVaultApiUser } from "@/lib/vault/api-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ctx = await getVaultApiUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { supabase, user } = ctx;

  const body = (await request.json()) as { path: string };
  if (!body.path?.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase.storage
    .from(VAULT_STORAGE_BUCKET)
    .createSignedUrl(body.path, VAULT_SIGNED_URL_EXPIRY_SEC);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Could not sign URL" }, { status: 500 });
  }

  await supabase.from("vault_access_log").insert({
    user_id: user.id,
    action: "view_document",
    ip_address: request.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
    user_agent: request.headers.get("user-agent"),
  });

  return NextResponse.json({ url: data.signedUrl, expires_in: VAULT_SIGNED_URL_EXPIRY_SEC });
}

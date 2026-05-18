import { NextResponse } from "next/server";
import { getVaultApiUser } from "@/lib/vault/api-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ctx = await getVaultApiUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { supabase, user } = ctx;

  const body = (await request.json()) as {
    action: string;
    target_document_id?: string;
  };

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  const { error } = await supabase.from("vault_access_log").insert({
    user_id: user.id,
    action: body.action,
    target_document_id: body.target_document_id ?? null,
    ip_address: ip,
    user_agent: request.headers.get("user-agent"),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

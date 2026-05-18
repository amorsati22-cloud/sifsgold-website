import { NextResponse } from "next/server";
import { VAULT_LOCKOUT_MINUTES, VAULT_MAX_PIN_ATTEMPTS } from "@/lib/vault/constants";
import { getVaultApiUser } from "@/lib/vault/api-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ctx = await getVaultApiUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { supabase, user } = ctx;
  const body = (await request.json()) as { success: boolean };

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  if (body.success) {
    await supabase
      .from("vault_settings")
      .update({ failed_attempts: 0, locked_until: null })
      .eq("id", user.id);

    await supabase.from("vault_access_log").insert({
      user_id: user.id,
      action: "unlock",
      ip_address: ip,
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ ok: true });
  }

  const { data: settings } = await supabase
    .from("vault_settings")
    .select("failed_attempts")
    .eq("id", user.id)
    .maybeSingle();

  const attempts = (settings?.failed_attempts ?? 0) + 1;
  const locked = attempts >= VAULT_MAX_PIN_ATTEMPTS;
  const lockedUntil = locked
    ? new Date(Date.now() + VAULT_LOCKOUT_MINUTES * 60 * 1000).toISOString()
    : null;

  await supabase
    .from("vault_settings")
    .upsert({
      id: user.id,
      failed_attempts: attempts,
      locked_until: lockedUntil,
    })
    .eq("id", user.id);

  await supabase.from("vault_access_log").insert({
    user_id: user.id,
    action: "failed_pin",
    ip_address: ip,
    user_agent: request.headers.get("user-agent"),
  });

  return NextResponse.json({
    ok: false,
    failed_attempts: attempts,
    locked_until: lockedUntil,
  });
}

import { NextResponse } from "next/server";
import { ensureConnectOnboardingLink, refreshConnectOnboardedStatus } from "@/lib/advocates/stripe-connect";
import { requireAdvocate } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST() {
  const advocate = await requireAdvocate();
  if (!advocate.authorized || !advocate.user) {
    return NextResponse.json({ error: "Advocate access required" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { data: profile } = await admin
    .from("profiles")
    .select("email, full_name")
    .eq("id", advocate.user.id)
    .single();

  const email = (profile?.email as string) ?? advocate.user.email ?? "";
  const displayName =
    (advocate.advocate?.display_name as string) ?? (profile?.full_name as string) ?? "Advocate";

  const result = await ensureConnectOnboardingLink(admin, advocate.user.id, email, displayName);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url, accountId: result.accountId });
}

export async function GET() {
  const advocate = await requireAdvocate();
  if (!advocate.authorized || !advocate.user) {
    return NextResponse.json({ error: "Advocate access required" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const onboarded = await refreshConnectOnboardedStatus(admin, advocate.user.id);
  return NextResponse.json({ onboarded });
}

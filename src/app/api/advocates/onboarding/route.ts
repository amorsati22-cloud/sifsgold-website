import { NextResponse } from "next/server";
import { refreshConnectOnboardedStatus } from "@/lib/advocates/stripe-connect";
import { requireAdvocate } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const AGREEMENT_VERSION = "2026-05";

export async function PATCH(request: Request) {
  const advocate = await requireAdvocate();
  if (!advocate.authorized || !advocate.user) {
    return NextResponse.json({ error: "Advocate access required" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const body = await request.json();
  const step = body.step as string | undefined;

  if (step === "agreement") {
    if (!body.accepted) {
      return NextResponse.json({ error: "Agreement must be accepted" }, { status: 400 });
    }
    await admin
      .from("advocate_profiles")
      .update({
        agreement_signed_at: new Date().toISOString(),
        agreement_version: body.version ?? AGREEMENT_VERSION,
      })
      .eq("id", advocate.user.id);
  } else if (step === "ftc_training") {
    if (!body.acknowledged) {
      return NextResponse.json({ error: "FTC training acknowledgement required" }, { status: 400 });
    }
    await admin
      .from("advocate_profiles")
      .update({ ftc_training_acknowledged_at: new Date().toISOString() })
      .eq("id", advocate.user.id);
  } else if (step === "profile") {
    const specialties = (body.specialty_tags as string[] | undefined) ?? [];
    await admin
      .from("advocate_profiles")
      .update({
        bio: body.bio ?? null,
        specialties,
        specialty_tags: specialties,
        sample_content_urls: (body.sample_content_urls as string[]) ?? [],
        display_name: body.display_name ?? advocate.advocate?.display_name,
      })
      .eq("id", advocate.user.id);
  } else if (step === "connect_refresh") {
    await refreshConnectOnboardedStatus(admin, advocate.user.id);
  } else {
    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  }

  const { data } = await admin.from("advocate_profiles").select("*").eq("id", advocate.user.id).single();
  return NextResponse.json({ profile: data });
}

import { NextResponse } from "next/server";
import { getOrCreateMembership } from "@/lib/loyalty/points-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { program_id: string; referral_code?: string };

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Body;
  if (!body.program_id) {
    return NextResponse.json({ error: "program_id required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: program } = await admin
    .from("loyalty_programs")
    .select("id, active")
    .eq("id", body.program_id)
    .maybeSingle();

  if (!program?.active) {
    return NextResponse.json({ error: "Program not available" }, { status: 404 });
  }

  const membershipId = await getOrCreateMembership(
    admin,
    body.program_id,
    user.id,
    body.referral_code,
  );

  if (!membershipId) {
    return NextResponse.json({ error: "Could not enroll" }, { status: 500 });
  }

  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("*")
    .eq("id", membershipId)
    .single();

  return NextResponse.json({ membership });
}

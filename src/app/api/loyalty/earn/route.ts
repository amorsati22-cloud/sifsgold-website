import { NextResponse } from "next/server";
import { awardPoints, getOrCreateMembership } from "@/lib/loyalty/points-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  membership_id?: string;
  program_id?: string;
  member_id?: string;
  points: number;
  source?: string;
  source_id?: string;
  description?: string;
};

export async function POST(request: Request) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const body = (await request.json()) as Body;
  if (!body.points || body.points <= 0) {
    return NextResponse.json({ error: "Invalid points" }, { status: 400 });
  }

  let membershipId = body.membership_id;

  if (!membershipId && body.program_id && body.member_id) {
    membershipId =
      (await getOrCreateMembership(admin, body.program_id, body.member_id)) ?? undefined;
  }

  if (!membershipId) {
    return NextResponse.json({ error: "membership_id or program_id+member_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("member_id, program:loyalty_programs(owner_id)")
    .eq("id", membershipId)
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });

  const ownerId = (membership.program as { owner_id: string })?.owner_id;
  const isOwner = user?.id === ownerId;
  const isMember = user?.id === membership.member_id;
  if (!isOwner && !isMember && body.source !== "appointment" && body.source !== "product_purchase") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await awardPoints(admin, {
    membershipId,
    points: body.points,
    source: body.source,
    sourceId: body.source_id,
    description: body.description,
    transactionType: body.source === "manual" ? "adjust" : "earn",
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

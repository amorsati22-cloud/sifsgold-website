import { NextResponse } from "next/server";
import { adjustPoints } from "@/lib/loyalty/points-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { membership_id: string; points_change: number; description: string };

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Body;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("program:loyalty_programs(owner_id)")
    .eq("id", body.membership_id)
    .maybeSingle();

  const ownerId = (membership?.program as { owner_id: string })?.owner_id;
  if (ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await adjustPoints(admin, {
    membershipId: body.membership_id,
    pointsChange: body.points_change,
    description: body.description || "Manual adjustment",
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

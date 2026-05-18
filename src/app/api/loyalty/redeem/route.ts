import { NextResponse } from "next/server";
import { redeemReward } from "@/lib/loyalty/points-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { reward_id: string; membership_id?: string };

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Body;
  if (!body.reward_id) {
    return NextResponse.json({ error: "reward_id required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let membershipId = body.membership_id;
  if (!membershipId) {
    const { data: reward } = await admin
      .from("loyalty_rewards")
      .select("program_id")
      .eq("id", body.reward_id)
      .single();
    if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

    const { data: membership } = await admin
      .from("loyalty_memberships")
      .select("id")
      .eq("program_id", reward.program_id)
      .eq("member_id", user.id)
      .maybeSingle();
    membershipId = membership?.id as string | undefined;
  }

  if (!membershipId) {
    return NextResponse.json({ error: "Enroll in program first" }, { status: 400 });
  }

  const result = await redeemReward(admin, {
    membershipId,
    rewardId: body.reward_id,
    memberId: user.id,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({
    redemption_code: result.redemption_code,
    balance: result.balance,
    redemption: result.redemption,
  });
}

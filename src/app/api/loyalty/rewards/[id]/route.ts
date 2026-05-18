import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function assertOwnerReward(userId: string, rewardId: string) {
  const admin = createAdminClient();
  if (!admin) return { error: NextResponse.json({ error: "Unavailable" }, { status: 503 }) };

  const { data: reward } = await admin
    .from("loyalty_rewards")
    .select("*, program:loyalty_programs(owner_id)")
    .eq("id", rewardId)
    .maybeSingle();

  if (!reward) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };

  const ownerId = (reward.program as { owner_id: string })?.owner_id;
  if (ownerId !== userId) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { admin, reward };
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await assertOwnerReward(user.id, id);
  if ("error" in ctx && ctx.error) return ctx.error;

  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.name != null) updates.name = String(body.name).trim();
  if (body.description != null) updates.description = body.description;
  if (body.cost_points != null) updates.cost_points = Number(body.cost_points);
  if (body.reward_type != null) updates.reward_type = body.reward_type;
  if (body.discount_percent != null) updates.discount_percent = body.discount_percent;
  if (body.discount_amount != null) updates.discount_amount = body.discount_amount;
  if (body.max_per_member != null) updates.max_per_member = body.max_per_member;
  if (body.max_redemptions_total != null) updates.max_redemptions_total = body.max_redemptions_total;
  if (body.active != null) updates.active = Boolean(body.active);

  const { data, error } = await ctx.admin!
    .from("loyalty_rewards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reward: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await assertOwnerReward(user.id, id);
  if ("error" in ctx && ctx.error) return ctx.error;

  const { error } = await ctx.admin!.from("loyalty_rewards").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

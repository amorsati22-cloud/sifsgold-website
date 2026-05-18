import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const REWARD_TYPES = [
  "service_discount",
  "product_discount",
  "free_service",
  "free_product",
  "experience",
] as const;

async function ownerProgram(userId: string) {
  const admin = createAdminClient();
  if (!admin) return { error: NextResponse.json({ error: "Unavailable" }, { status: 503 }) };

  const { data: program } = await admin
    .from("loyalty_programs")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (!program) {
    return { error: NextResponse.json({ error: "Create a loyalty program first" }, { status: 404 }) };
  }

  return { admin, programId: program.id as string };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await ownerProgram(user.id);
  if ("error" in ctx && ctx.error) return ctx.error;

  const { data, error } = await ctx.admin!
    .from("loyalty_rewards")
    .select("*")
    .eq("program_id", ctx.programId!)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rewards: data ?? [] });
}

type CreateBody = {
  name: string;
  description?: string;
  cost_points: number;
  reward_type: (typeof REWARD_TYPES)[number];
  discount_percent?: number;
  discount_amount?: number;
  max_per_member?: number;
  max_redemptions_total?: number;
  active?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await ownerProgram(user.id);
  if ("error" in ctx && ctx.error) return ctx.error;

  const body = (await request.json()) as CreateBody;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  if (!body.cost_points || body.cost_points < 1) {
    return NextResponse.json({ error: "cost_points must be positive" }, { status: 400 });
  }
  if (!REWARD_TYPES.includes(body.reward_type)) {
    return NextResponse.json({ error: "Invalid reward_type" }, { status: 400 });
  }

  const { data, error } = await ctx.admin!
    .from("loyalty_rewards")
    .insert({
      program_id: ctx.programId,
      name: body.name.trim(),
      description: body.description ?? null,
      cost_points: body.cost_points,
      reward_type: body.reward_type,
      discount_percent: body.discount_percent ?? null,
      discount_amount: body.discount_amount ?? null,
      max_per_member: body.max_per_member ?? null,
      max_redemptions_total: body.max_redemptions_total ?? null,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reward: data });
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: programs } = await admin
    .from("loyalty_programs")
    .select("id, expiration_months")
    .eq("active", true)
    .not("expiration_months", "is", null);

  let expiredCount = 0;

  for (const program of programs ?? []) {
    const months = program.expiration_months as number;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const { data: stale } = await admin
      .from("loyalty_memberships")
      .select("id, points_balance")
      .eq("program_id", program.id)
      .lt("last_activity", cutoff.toISOString())
      .gt("points_balance", 0);

    for (const m of stale ?? []) {
      const balance = m.points_balance as number;
      await admin
        .from("loyalty_memberships")
        .update({ points_balance: 0 })
        .eq("id", m.id);

      await admin.from("loyalty_transactions").insert({
        membership_id: m.id,
        transaction_type: "expire",
        points_change: -balance,
        source: "manual",
        description: `Points expired after ${months} months inactive`,
        balance_after: 0,
      });
      expiredCount++;
    }
  }

  return NextResponse.json({ expired: expiredCount });
}

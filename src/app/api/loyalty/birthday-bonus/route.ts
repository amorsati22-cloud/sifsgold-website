import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/loyalty/points-engine";
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

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, birthday")
    .not("birthday", "is", null);

  let awarded = 0;

  for (const full of profiles ?? []) {
    if (!full?.birthday) continue;
    const bday = new Date(full.birthday as string);
    if (bday.getMonth() + 1 !== month || bday.getDate() !== day) continue;

    const { data: memberships } = await admin
      .from("loyalty_memberships")
      .select("id, program:loyalty_programs(birthday_bonus, active)")
      .eq("member_id", full.id)
      .eq("active", true);

    for (const m of memberships ?? []) {
      const program = m.program as { birthday_bonus: number; active: boolean };
      if (!program?.active) continue;
      const bonus = Number(program.birthday_bonus) || 0;
      if (bonus <= 0) continue;

      const year = today.getFullYear();
      const { data: dup } = await admin
        .from("loyalty_transactions")
        .select("id")
        .eq("membership_id", m.id)
        .eq("source", "birthday")
        .gte("created_at", `${year}-01-01`)
        .maybeSingle();

      if (dup) continue;

      await awardPoints(admin, {
        membershipId: m.id as string,
        points: bonus,
        transactionType: "bonus",
        source: "birthday",
        description: "Happy birthday bonus",
      });
      awarded++;
    }
  }

  return NextResponse.json({ awarded });
}

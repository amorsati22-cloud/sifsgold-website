import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { recordAdminFtcStrike } from "@/lib/advocates/ftc-strike-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const advocateId = body.advocate_id as string | undefined;
  const reason = (body.reason as string | undefined)?.trim();

  if (!advocateId || !reason) {
    return NextResponse.json({ error: "advocate_id and reason required" }, { status: 400 });
  }

  const result = await recordAdminFtcStrike(auth.admin, {
    advocateId,
    reason,
    brandDealId: body.brand_deal_id ?? null,
    deliverableId: body.deliverable_id ?? null,
    reviewerEmail: auth.email,
  });

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "ftc_strike",
    targetId: advocateId,
    ipAddress: getClientIp(request),
    metadata: { reason, ...result },
  });

  return NextResponse.json({ ok: true, ...result });
}

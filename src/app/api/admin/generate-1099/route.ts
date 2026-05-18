import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { generateAdvocate1099ForYear } from "@/lib/advocates/tax-1099";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json().catch(() => ({}));
  const taxYear = Number(body.tax_year) || new Date().getFullYear() - 1;
  const advocateId = body.advocate_id as string | undefined;

  const result = await generateAdvocate1099ForYear(auth.admin, taxYear, advocateId);

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "generate_1099",
    targetId: advocateId ?? "all",
    ipAddress: getClientIp(request),
    metadata: { taxYear, ...result },
  });

  return NextResponse.json({ ok: true, taxYear, ...result });
}

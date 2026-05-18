import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";

export const runtime = "nodejs";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "email,source,user_type,created_at,converted_to_user\n";
  const headers = ["email", "source", "user_type", "created_at", "converted_to_user", "referral_code"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const val = row[h];
          const str = val == null ? "" : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(","),
    );
  }
  return lines.join("\n");
}

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const { data, error } = await auth.admin
    .from("waitlist")
    .select("email, source, user_type, created_at, converted_to_user, referral_code")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "exported_waitlist",
    ipAddress: getClientIp(request),
    metadata: { count: data?.length ?? 0 },
  });

  const csv = toCsv((data ?? []) as Record<string, unknown>[]);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sifs-gold-waitlist.csv"',
    },
  });
}

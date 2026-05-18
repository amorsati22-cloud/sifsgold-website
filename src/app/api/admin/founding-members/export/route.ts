import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const { data, error } = await auth.admin
    .from("profiles")
    .select("email, full_name, user_type, founding_member_at, created_at")
    .eq("founding_member", true)
    .order("founding_member_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = ["email", "full_name", "user_type", "founding_member_at", "created_at"];
  const lines = [
    headers.join(","),
    ...(data ?? []).map((row) =>
      headers
        .map((h) => `"${String(row[h as keyof typeof row] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ];

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "viewed_founding_members",
    ipAddress: getClientIp(request),
    metadata: { export: true, count: data?.length ?? 0 },
  });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="founding-members.csv"',
    },
  });
}

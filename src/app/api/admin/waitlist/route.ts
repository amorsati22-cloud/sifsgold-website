import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { sendTemplateEmail } from "@/lib/email/send-template";
import type { EmailTemplateType } from "@/lib/email/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const userType = searchParams.get("user_type");
  const q = searchParams.get("q")?.trim().toLowerCase();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = auth.admin.from("waitlist").select("*").order("created_at", { ascending: false }).limit(500);

  if (source) query = query.eq("source", source);
  if (userType) query = query.eq("user_type", userType);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let rows = data ?? [];
  if (q) {
    rows = rows.filter((row) => (row.email as string).toLowerCase().includes(q));
  }

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "viewed_waitlist",
    ipAddress: getClientIp(request),
    metadata: { count: rows.length },
  });

  return NextResponse.json({ rows });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const ids = body.ids as string[] | undefined;
  const action = body.action as "mark_converted" | "send_email" | undefined;
  const templateKey = body.template_key as EmailTemplateType | undefined;

  if (!ids?.length || !action) {
    return NextResponse.json({ error: "ids and action required" }, { status: 400 });
  }

  const { data: rows } = await auth.admin.from("waitlist").select("*").in("id", ids);
  if (!rows?.length) return NextResponse.json({ error: "No rows found" }, { status: 404 });

  if (action === "mark_converted") {
    await auth.admin.from("waitlist").update({ converted_to_user: true }).in("id", ids);
    await logAdminAudit({
      admin: auth.admin,
      adminEmail: auth.email,
      action: "marked_waitlist_converted",
      ipAddress: getClientIp(request),
      metadata: { ids },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "send_email") {
    if (!templateKey) {
      return NextResponse.json({ error: "template_key required" }, { status: 400 });
    }
    let sent = 0;
    let failed = 0;
    for (const row of rows) {
      try {
        const outcome = await sendTemplateEmail(templateKey, row.email as string, {
          name: row.email as string,
        });
        if (outcome.skipped) failed += 1;
        else sent += 1;
      } catch {
        failed += 1;
      }
    }
    await logAdminAudit({
      admin: auth.admin,
      adminEmail: auth.email,
      action: "bulk_email_waitlist",
      ipAddress: getClientIp(request),
      metadata: { ids, templateKey, sent, failed },
    });
    return NextResponse.json({ ok: true, sent, failed });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapCategory(reason?: string): string {
  const r = (reason ?? "").toLowerCase();
  if (r.includes("billing") || r.includes("payment")) return "billing";
  if (r.includes("bug") || r.includes("technical")) return "technical";
  if (r.includes("advocate")) return "advocate";
  if (r.includes("partner") || r.includes("brand")) return "brand_partner";
  return "general";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    email?: string;
    subject?: string;
    message?: string;
    body?: string;
    reason?: string;
    source?: string;
    name?: string;
  };

  const fromEmail = payload.email?.trim().toLowerCase();
  const ticketBody = (payload.message ?? payload.body)?.trim();

  if (!fromEmail || !EMAIL_RE.test(fromEmail)) {
    return NextResponse.json({ ok: false, message: "Valid email required" }, { status: 400 });
  }

  if (!ticketBody) {
    return NextResponse.json({ ok: false, message: "Message body required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Database not configured" }, { status: 503 });
  }

  const subject =
    payload.subject?.trim() ||
    `Contact — ${payload.reason ?? "general"}${payload.name ? ` (${payload.name})` : ""}`;

  const { error } = await admin.from("support_tickets").insert({
    from_email: fromEmail,
    subject,
    body: ticketBody,
    category: mapCategory(payload.reason),
    status: "open",
  });

  if (error) {
    console.error("[api/support-ticket]", error.message);
    return NextResponse.json({ ok: false, message: "Could not create ticket" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

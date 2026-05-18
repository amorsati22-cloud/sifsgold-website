import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveUserTypeFromSlug } from "@/lib/auth/user-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as {
    email?: string;
    source?: string;
    userType?: string;
    referralCode?: string;
  };

  const email = payload.email?.trim().toLowerCase();
  const source = payload.source?.trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, message: "Valid email is required" }, { status: 400 });
  }

  if (!source) {
    return NextResponse.json({ ok: false, message: "Source is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Database not configured" }, { status: 503 });
  }

  const userType = payload.userType ? resolveUserTypeFromSlug(payload.userType) ?? payload.userType : null;

  const { error } = await admin.from("waitlist").insert({
    email,
    source,
    user_type: userType,
    referral_code: payload.referralCode?.trim() || null,
  });

  if (error) {
    console.error("[api/waitlist]", error.message);
    return NextResponse.json({ ok: false, message: "Could not save waitlist entry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

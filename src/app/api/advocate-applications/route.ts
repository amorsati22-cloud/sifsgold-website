import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as {
    name?: string;
    email?: string;
    socialHandles?: string;
    specialty?: string;
    sampleContent?: string;
    licenseStatus?: string;
    reason?: string;
  };

  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.name?.trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, message: "Valid email is required" }, { status: 400 });
  }

  if (!fullName) {
    return NextResponse.json({ ok: false, message: "Full name is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Database not configured" }, { status: 503 });
  }

  const sampleUrls = payload.sampleContent
    ?.split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);

  const { error } = await admin.from("advocate_applications").insert({
    email,
    full_name: fullName,
    social_handles: payload.socialHandles?.trim() || null,
    specialty: payload.specialty?.trim() || null,
    sample_content_urls: sampleUrls?.length ? sampleUrls : null,
    license_status: payload.licenseStatus?.trim() || null,
    reason: payload.reason?.trim() || null,
  });

  if (error) {
    console.error("[api/advocate-applications]", error.message);
    return NextResponse.json({ ok: false, message: "Could not save application" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { mergeCategoryPrefs } from "@/lib/notifications/preferences";
import { DEFAULT_CATEGORY_PREFS, type CategoryPrefsMap } from "@/lib/notifications/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase.from("notification_preferences").select("*").eq("id", user.id).maybeSingle();

  const prefs = data ?? {
    id: user.id,
    push_enabled: false,
    email_enabled: true,
    sms_enabled: false,
    categories: DEFAULT_CATEGORY_PREFS,
    quiet_hours_start: null,
    quiet_hours_end: null,
    digest_frequency: "daily",
  };

  return NextResponse.json({
    preferences: {
      ...prefs,
      categories: mergeCategoryPrefs((prefs.categories as CategoryPrefsMap) ?? {}),
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  const db = admin ?? supabase;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.push_enabled != null) updates.push_enabled = Boolean(body.push_enabled);
  if (body.email_enabled != null) updates.email_enabled = Boolean(body.email_enabled);
  if (body.sms_enabled != null) updates.sms_enabled = Boolean(body.sms_enabled);
  if (body.quiet_hours_start !== undefined) updates.quiet_hours_start = body.quiet_hours_start;
  if (body.quiet_hours_end !== undefined) updates.quiet_hours_end = body.quiet_hours_end;
  if (body.digest_frequency != null) updates.digest_frequency = body.digest_frequency;
  if (body.categories != null) updates.categories = body.categories;

  const { data, error } = await db
    .from("notification_preferences")
    .upsert({ id: user.id, ...updates }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    preferences: {
      ...data,
      categories: mergeCategoryPrefs((data.categories as CategoryPrefsMap) ?? {}),
    },
  });
}

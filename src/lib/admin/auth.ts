import "server-only";

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/allowlist";
import { getServerSession } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminContext = {
  email: string;
  userId: string;
  admin: NonNullable<ReturnType<typeof createAdminClient>>;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  const { user } = await getServerSession();
  if (!user?.email || !isAdmin(user.email)) return null;

  const admin = createAdminClient();
  if (!admin) return null;

  return { email: user.email.toLowerCase(), userId: user.id, admin };
}

export async function requireAdminPage(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) {
    redirect("/dashboard?error=admin_forbidden");
  }
  return ctx;
}

export async function requireAdminApi(): Promise<AdminContext | NextResponse> {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return ctx;
}

export function isAdminApiResult(
  result: AdminContext | NextResponse,
): result is AdminContext {
  return !(result instanceof NextResponse);
}

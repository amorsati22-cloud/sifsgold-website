import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminAuditAction =
  | "viewed_admin_overview"
  | "viewed_waitlist"
  | "viewed_advocates"
  | "viewed_founding_members"
  | "viewed_campaigns"
  | "viewed_support"
  | "viewed_admin_settings"
  | "exported_waitlist"
  | "bulk_email_waitlist"
  | "marked_waitlist_converted"
  | "approved_advocate"
  | "rejected_advocate"
  | "waitlisted_advocate"
  | "sent_campaign"
  | "sent_campaign_test"
  | "responded_support_ticket"
  | "updated_support_ticket"
  | "advocate_payout"
  | "generate_1099"
  | "ftc_strike";

export type LogAdminAuditInput = {
  admin: SupabaseClient;
  adminEmail: string;
  action: AdminAuditAction;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
};

export async function logAdminAudit({
  admin,
  adminEmail,
  action,
  targetId = null,
  metadata = {},
  ipAddress = null,
}: LogAdminAuditInput) {
  const { error } = await admin.from("admin_audit_log").insert({
    admin_email: adminEmail.toLowerCase(),
    action,
    target_id: targetId,
    metadata,
    ip_address: ipAddress,
  });

  if (error) {
    console.error("[admin/audit]", action, error.message);
  }
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { EmailTemplateType } from "@/lib/email/types";

export type CampaignSegment =
  | "all_waitlist"
  | "founding_members"
  | "advocates"
  | "custom";

export async function resolveCampaignRecipients(
  admin: SupabaseClient,
  segment: CampaignSegment,
  customFilter?: Record<string, unknown> | null,
): Promise<string[]> {
  switch (segment) {
    case "all_waitlist": {
      const { data } = await admin.from("waitlist").select("email").order("created_at", { ascending: false });
      return uniqueEmails((data ?? []).map((row) => row.email as string));
    }
    case "founding_members": {
      const { data } = await admin
        .from("profiles")
        .select("email")
        .eq("founding_member", true);
      return uniqueEmails((data ?? []).map((row) => row.email as string));
    }
    case "advocates": {
      const { data: approved } = await admin
        .from("advocate_applications")
        .select("email")
        .eq("status", "approved");
      const { data: profileAdvocates } = await admin
        .from("profiles")
        .select("email")
        .eq("user_type", "sifs_advocate");
      return uniqueEmails([
        ...(approved ?? []).map((row) => row.email as string),
        ...(profileAdvocates ?? []).map((row) => row.email as string),
      ]);
    }
    case "custom": {
      const emails = customFilter?.emails;
      if (Array.isArray(emails)) {
        return uniqueEmails(emails.filter((e): e is string => typeof e === "string"));
      }
      return [];
    }
    default:
      return [];
  }
}

function uniqueEmails(emails: string[]): string[] {
  return [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
}

export const CAMPAIGN_TEMPLATE_OPTIONS: { key: EmailTemplateType; label: string }[] = [
  { key: "welcome_sifs_circle", label: "Welcome to Sif's Circle" },
  { key: "founding_member_welcome", label: "Founding member welcome" },
  { key: "sifs_advocate_acceptance", label: "Sif's Advocate acceptance" },
  { key: "launch_day_announcement", label: "Launch day announcement" },
  { key: "sifs_advocate_rejection", label: "Advocate application update" },
];

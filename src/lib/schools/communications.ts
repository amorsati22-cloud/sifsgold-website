import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/resend-client";
import { SchoolCohortAnnouncement } from "@/lib/email/templates/SchoolCohortAnnouncement";

export async function sendCohortMassEmail(
  admin: SupabaseClient,
  params: {
    schoolId: string;
    cohortId: string | null;
    sentBy: string;
    subject: string;
    body: string;
    recipients: { email: string; name: string }[];
    schoolName: string;
  },
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const r of params.recipients) {
    try {
      await sendEmail({
        to: r.email,
        subject: params.subject,
        react: SchoolCohortAnnouncement({
          studentName: r.name,
          schoolName: params.schoolName,
          subject: params.subject,
          body: params.body,
        }),
      });
      sent += 1;
    } catch {
      failed += 1;
    }
  }

  await admin.from("school_communications").insert({
    school_id: params.schoolId,
    cohort_id: params.cohortId,
    sent_by: params.sentBy,
    subject: params.subject,
    body_preview: params.body.slice(0, 200),
    recipient_count: sent,
    template_type: "cohort_announcement",
  });

  return { sent, failed };
}

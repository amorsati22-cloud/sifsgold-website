import type { EmailTemplatePayload, EmailTemplateType } from "@/lib/email/types";

/**
 * Fire-and-forget client trigger after Web3Forms success.
 * Requires NEXT_PUBLIC_EMAIL_TRIGGER_TOKEN matching server validation.
 */
export async function triggerTransactionalEmail(
  type: EmailTemplateType,
  to: string,
  data: EmailTemplatePayload = {},
): Promise<void> {
  const token = process.env.NEXT_PUBLIC_EMAIL_TRIGGER_TOKEN?.trim();
  if (!token || !to.trim()) return;

  try {
    await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-email-trigger-token": token,
      },
      body: JSON.stringify({ type, to: to.trim(), data }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] client trigger failed", error);
    }
  }
}

export function resolveClientTemplateFromSource(source: string): EmailTemplateType {
  const s = source.toLowerCase();
  if (s.includes("advocate_application") || s.includes("sifs_advocate")) {
    return "sifs_advocate_application_received";
  }
  if (s.includes("advocate")) return "sifs_advocate_application_received";
  if (s.includes("founding_member")) return "founding_member_welcome";
  if (s.includes("contact")) return "contact_form_confirmation";
  if (s.includes("data_deletion") || s.includes("deletion")) {
    return "data_deletion_request_received";
  }
  if (s.includes("dmca")) return "dmca_takedown_received";
  return "welcome_sifs_circle";
}

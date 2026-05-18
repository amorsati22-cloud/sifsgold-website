export const EMAIL_TEMPLATE_TYPES = [
  "welcome_sifs_circle",
  "founding_member_welcome",
  "sifs_advocate_application_received",
  "sifs_advocate_acceptance",
  "contact_form_confirmation",
  "data_deletion_request_received",
  "dmca_takedown_received",
  "launch_day_announcement",
] as const;

export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number];

export type EmailTemplatePayload = {
  firstName?: string;
  name?: string;
  reason?: string;
  tier?: string;
  source?: string;
  agreementUrl?: string;
  dashboardUrl?: string;
};

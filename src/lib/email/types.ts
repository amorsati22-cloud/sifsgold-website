export const EMAIL_TEMPLATE_TYPES = [
  "welcome_sifs_circle",
  "founding_member_welcome",
  "sifs_advocate_application_received",
  "sifs_advocate_acceptance",
  "contact_form_confirmation",
  "data_deletion_request_received",
  "dmca_takedown_received",
  "launch_day_announcement",
  "sifs_advocate_rejection",
  "brand_deal_matched",
  "brand_deal_accepted",
  "advocate_payment_sent",
  "ftc_strike_warning",
  "advocate_suspended",
  "annual_1099_available",
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
  dealTitle?: string;
  brandName?: string;
  applicationUrl?: string;
  contractUrl?: string;
  amount?: string;
  strikeCount?: number;
  maxStrikes?: number;
  taxYear?: number;
  downloadUrl?: string;
};

import "server-only";

import type { ReactElement } from "react";
import { EMAIL_FROM } from "@/lib/email/constants";
import { isMarketingOptedOut } from "@/lib/email/preferences";
import { sendEmail } from "@/lib/email/resend-client";
import {
  buildPreferencesUrl,
  buildUnsubscribeUrl,
  buildViewInBrowserUrl,
} from "@/lib/email/signing";
import { ContactFormConfirmation, contactFormConfirmationSubject } from "@/lib/email/templates/ContactFormConfirmation";
import { DataDeletionRequestReceived, dataDeletionRequestReceivedSubject } from "@/lib/email/templates/DataDeletionRequestReceived";
import { DMCATakedownReceived, dmcaTakedownReceivedSubject } from "@/lib/email/templates/DMCATakedownReceived";
import { FoundingMemberWelcome, foundingMemberWelcomeSubject } from "@/lib/email/templates/FoundingMemberWelcome";
import { LaunchDayAnnouncement, launchDayAnnouncementSubject } from "@/lib/email/templates/LaunchDayAnnouncement";
import { SifsAdvocateAcceptance, sifsAdvocateAcceptanceSubject } from "@/lib/email/templates/SifsAdvocateAcceptance";
import {
  SifsAdvocateApplicationReceived,
  sifsAdvocateApplicationReceivedSubject,
} from "@/lib/email/templates/SifsAdvocateApplicationReceived";
import { WelcomeToSifsCircle, welcomeToSifsCircleSubject } from "@/lib/email/templates/WelcomeToSifsCircle";

import {
  EMAIL_TEMPLATE_TYPES,
  type EmailTemplatePayload,
  type EmailTemplateType,
} from "@/lib/email/types";

export { EMAIL_TEMPLATE_TYPES, type EmailTemplatePayload, type EmailTemplateType };

type BuiltTemplate = {
  subject: string;
  react: ReactElement;
  marketing: boolean;
  from?: string;
};

function linkProps(email: string, template: EmailTemplateType) {
  return {
    recipientEmail: email,
    viewInBrowserUrl: buildViewInBrowserUrl(email, template),
    unsubscribeUrl: buildUnsubscribeUrl(email),
    preferencesUrl: buildPreferencesUrl(email),
  };
}

export function buildEmailTemplate(
  type: EmailTemplateType,
  to: string,
  data: EmailTemplatePayload = {},
): BuiltTemplate {
  const links = linkProps(to, type);

  switch (type) {
    case "welcome_sifs_circle":
      return {
        subject: welcomeToSifsCircleSubject,
        marketing: true,
        react: (
          <WelcomeToSifsCircle
            {...links}
            firstName={data.firstName ?? data.name}
          />
        ),
      };
    case "founding_member_welcome":
      return {
        subject: foundingMemberWelcomeSubject,
        marketing: true,
        react: (
          <FoundingMemberWelcome
            {...links}
            firstName={data.firstName ?? data.name}
          />
        ),
      };
    case "sifs_advocate_application_received":
      return {
        subject: sifsAdvocateApplicationReceivedSubject,
        marketing: false,
        from: EMAIL_FROM.notifications,
        react: (
          <SifsAdvocateApplicationReceived
            {...links}
            applicantName={data.name}
          />
        ),
      };
    case "sifs_advocate_acceptance":
      return {
        subject: sifsAdvocateAcceptanceSubject,
        marketing: false,
        from: EMAIL_FROM.notifications,
        react: (
          <SifsAdvocateAcceptance
            {...links}
            applicantName={data.name}
            tier={data.tier}
            agreementUrl={data.agreementUrl}
            dashboardUrl={data.dashboardUrl}
          />
        ),
      };
    case "contact_form_confirmation":
      return {
        subject: contactFormConfirmationSubject,
        marketing: false,
        from: EMAIL_FROM.notifications,
        react: (
          <ContactFormConfirmation
            {...links}
            name={data.name}
            reason={data.reason}
          />
        ),
      };
    case "data_deletion_request_received":
      return {
        subject: dataDeletionRequestReceivedSubject,
        marketing: false,
        from: EMAIL_FROM.notifications,
        react: (
          <DataDeletionRequestReceived
            {...links}
            name={data.name}
          />
        ),
      };
    case "dmca_takedown_received":
      return {
        subject: dmcaTakedownReceivedSubject,
        marketing: false,
        from: EMAIL_FROM.notifications,
        react: (
          <DMCATakedownReceived
            {...links}
            name={data.name}
          />
        ),
      };
    case "launch_day_announcement":
      return {
        subject: launchDayAnnouncementSubject,
        marketing: true,
        react: (
          <LaunchDayAnnouncement
            {...links}
            firstName={data.firstName ?? data.name}
          />
        ),
      };
    default: {
      const _exhaustive: never = type;
      throw new Error(`Unknown template: ${_exhaustive}`);
    }
  }
}

export function resolveTemplateFromSource(source: string): EmailTemplateType | null {
  const s = source.toLowerCase();

  if (s.includes("advocate") && s.includes("application")) {
    return "sifs_advocate_application_received";
  }
  if (s.includes("sifs_advocate") || s.includes("advocate_application")) {
    return "sifs_advocate_application_received";
  }
  if (s.includes("founding_member")) {
    return "founding_member_welcome";
  }
  if (s.includes("contact_form") || s === "contact") {
    return "contact_form_confirmation";
  }
  if (s.includes("data_deletion") || s.includes("account_deletion") || s.includes("deletion")) {
    return "data_deletion_request_received";
  }
  if (s.includes("dmca")) {
    return "dmca_takedown_received";
  }
  if (s.includes("waitlist") || s.includes("newsletter") || s.includes("sifs_circle")) {
    return "welcome_sifs_circle";
  }
  return "welcome_sifs_circle";
}

export async function sendTemplateEmail(
  type: EmailTemplateType,
  to: string,
  data: EmailTemplatePayload = {},
) {
  const email = to.trim().toLowerCase();
  if (!email) {
    throw new Error("Recipient email is required");
  }

  const built = buildEmailTemplate(type, email, data);

  if (built.marketing && (await isMarketingOptedOut(email))) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] skipped marketing send — opted out", { email, type });
    }
    return { skipped: true as const, reason: "marketing_opt_out" };
  }

  const result = await sendEmail({
    to: email,
    subject: built.subject,
    react: built.react,
    from: built.from,
  });

  return { skipped: false as const, result };
}

export function getTemplatePreview(type: EmailTemplateType, to = "preview@sifsgold.com") {
  return buildEmailTemplate(type, to, {
    name: "Preview Member",
    firstName: "Preview",
    reason: "Partnership",
    tier: "Advocate",
  });
}

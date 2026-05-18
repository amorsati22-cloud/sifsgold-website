import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type SifsAdvocateApplicationReceivedProps = {
  recipientEmail: string;
  applicantName?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function SifsAdvocateApplicationReceived({
  recipientEmail,
  applicantName,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: SifsAdvocateApplicationReceivedProps) {
  const greeting = applicantName?.trim() ? `Hi ${applicantName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Your Sif's Advocate application was received."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Application received.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        We received your application to join Sif&apos;s Advocates. Thank you for sharing your work
        and teaching focus with us.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Review cycle:</strong> applications are
        reviewed monthly by our creator team. We read every submission — quality and fit matter
        more than follower counts.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>What happens next:</strong> if your
        application advances, we will email you with next steps and a link to review the Advocate
        agreement. If we need more information, we will reach out through this address.
      </Text>
      <Text style={emailStyles.muted}>
        Typical timeline: allow up to one full review cycle (about 30 days) before hearing back.
        You do not need to resubmit unless we ask.
      </Text>
      <Text style={emailStyles.p}>
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const sifsAdvocateApplicationReceivedSubject =
  "Your Sif's Advocate application — received.";

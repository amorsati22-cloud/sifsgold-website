import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type DMCATakedownReceivedProps = {
  recipientEmail: string;
  name?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function DMCATakedownReceived({
  recipientEmail,
  name,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: DMCATakedownReceivedProps) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Your DMCA notice was received."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>DMCA notice received.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        We received your DMCA takedown notice. Our compliance team will review it for completeness
        under the Digital Millennium Copyright Act.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Review timeline:</strong> allow up to 10
        business days for initial review and routing. Complex notices may take longer; we will email
        you if we need additional information.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Counter-notice:</strong> if you believe
        content was removed in error, you may file a counter-notice as described in our DMCA policy.
        Counter-notices must include the elements required by law.
      </Text>
      <Link href="https://sifsgold.com/legal/dmca" style={emailStyles.button}>
        Read DMCA policy
      </Link>
      <Text style={{ ...emailStyles.p, marginTop: "24px" }}>
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const dmcaTakedownReceivedSubject = "DMCA notice received.";

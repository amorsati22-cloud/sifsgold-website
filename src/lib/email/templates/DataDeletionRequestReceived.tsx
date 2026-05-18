import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type DataDeletionRequestReceivedProps = {
  recipientEmail: string;
  name?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function DataDeletionRequestReceived({
  recipientEmail,
  name,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: DataDeletionRequestReceivedProps) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Your data deletion request was received."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Deletion request received.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        We received your request to delete personal data associated with this email address.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Processing window:</strong> we will
        complete eligible deletions within 30 days and email you when finished.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>What we delete:</strong> profile data,
        preferences, and marketing records tied to your account where no legal hold applies.
      </Text>
      <Text style={emailStyles.muted}>
        <strong>What we may retain:</strong> billing records, fraud-prevention logs, and DMCA or
        legal correspondence as required by law — typically in minimized form and only as long as
        necessary.
      </Text>
      <Text style={emailStyles.p}>
        To cancel this request within 30 days, contact us through the website contact form.
      </Text>
      <Text style={emailStyles.p}>
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const dataDeletionRequestReceivedSubject = "Your data deletion request — received.";

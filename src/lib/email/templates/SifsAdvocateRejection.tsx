import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type SifsAdvocateRejectionProps = {
  recipientEmail: string;
  applicantName?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export const sifsAdvocateRejectionSubject = "Update on your Sif's Advocate application";

export function SifsAdvocateRejection({
  recipientEmail,
  applicantName,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: SifsAdvocateRejectionProps) {
  const greeting = applicantName?.trim() ? `Hi ${applicantName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Thank you for applying to Sif's Advocates."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Thank you for applying.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        After careful review, we are not moving forward with your Sif&apos;s Advocate application at
        this time. We genuinely appreciate the time you invested and the passion you bring to your
        craft.
      </Text>
      <Text style={emailStyles.p}>
        You remain welcome in Sif&apos;s Circle and The Gold Collective — and you may apply again
        when your portfolio or specialty alignment grows.
      </Text>
      <Text style={emailStyles.p}>With respect, The Sif&apos;s Gold team</Text>
    </EmailLayout>
  );
}

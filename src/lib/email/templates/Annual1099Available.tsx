import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type Annual1099AvailableProps = {
  recipientEmail: string;
  taxYear?: number;
  downloadUrl?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function Annual1099Available({ recipientEmail, taxYear = new Date().getFullYear() - 1, downloadUrl, viewInBrowserUrl, unsubscribeUrl, preferencesUrl }: Annual1099AvailableProps) {
  return (
    <EmailLayout preview="1099-NEC available" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>Your {taxYear} 1099-NEC is ready</Heading>
      <Text style={emailStyles.p}>You earned $2,000 or more as a Sif&apos;s Advocate in {taxYear}. Your 1099-NEC is available in your earnings dashboard.</Text>
      {downloadUrl ? <Link href={downloadUrl} style={emailStyles.button}>Download tax document</Link> : null}
    </EmailLayout>
  );
}

export const annual1099AvailableSubject = "Your 1099-NEC is available — Sif's Gold";

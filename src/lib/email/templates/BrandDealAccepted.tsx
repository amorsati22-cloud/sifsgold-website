import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type BrandDealAcceptedProps = {
  recipientEmail: string;
  advocateName?: string;
  dealTitle?: string;
  contractUrl?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function BrandDealAccepted({
  recipientEmail,
  advocateName,
  dealTitle = "your brand deal",
  contractUrl = "https://sifsgold.com/dashboard/advocate",
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: BrandDealAcceptedProps) {
  const greeting = advocateName?.trim() ? `Hi ${advocateName.trim()},` : "Hi there,";
  return (
    <EmailLayout preview="Your brand deal application was accepted" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>You&apos;re in.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>Your application for <strong>{dealTitle}</strong> was accepted. Sign your contract and use the required FTC disclosure on every post.</Text>
      <Link href={contractUrl} style={emailStyles.button}>Open contract</Link>
    </EmailLayout>
  );
}

export const brandDealAcceptedSubject = "Your Sif's Advocate brand deal was accepted";

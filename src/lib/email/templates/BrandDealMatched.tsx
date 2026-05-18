import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type BrandDealMatchedProps = {
  recipientEmail: string;
  brandName?: string;
  dealTitle?: string;
  applicationUrl?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function BrandDealMatched({
  recipientEmail,
  brandName = "A Gold Partner",
  dealTitle = "Brand deal",
  applicationUrl = "https://sifsgold.com/brand-deals",
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: BrandDealMatchedProps) {
  return (
    <EmailLayout preview="New advocate application" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>New advocate application</Heading>
      <Text style={emailStyles.p}>
        A Sif&apos;s Advocate applied to <strong>{dealTitle}</strong> for {brandName}.
      </Text>
      <Link href={applicationUrl} style={emailStyles.button}>Review application</Link>
    </EmailLayout>
  );
}

export const brandDealMatchedSubject = "New Sif's Advocate application for your brand deal";

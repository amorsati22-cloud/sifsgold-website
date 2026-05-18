import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type FTCStrikeWarningProps = {
  recipientEmail: string;
  strikeCount?: number;
  maxStrikes?: number;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function FTCStrikeWarning({ recipientEmail, strikeCount = 1, maxStrikes = 3, viewInBrowserUrl, unsubscribeUrl, preferencesUrl }: FTCStrikeWarningProps) {
  return (
    <EmailLayout preview="FTC compliance notice" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>FTC compliance notice</Heading>
      <Text style={emailStyles.p}>We recorded an FTC disclosure issue on a sponsored post. This is strike {strikeCount} of {maxStrikes}.</Text>
      <Text style={emailStyles.p}>Every sponsored post must include #partner or #ad and a clear paid partnership disclosure per 16 CFR Part 255.</Text>
      <Text style={emailStyles.p}>A third strike suspends your advocate account automatically.</Text>
    </EmailLayout>
  );
}

export const ftcStrikeWarningSubject = "FTC compliance notice — Sif's Advocates";

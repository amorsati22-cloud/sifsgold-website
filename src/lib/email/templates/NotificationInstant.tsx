import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";

export type NotificationInstantProps = {
  recipientEmail: string;
  title: string;
  body?: string;
  actionUrl?: string;
  preferencesUrl: string;
  viewAllUrl: string;
};

export function NotificationInstant({
  recipientEmail,
  title,
  body,
  actionUrl,
  preferencesUrl,
  viewAllUrl,
}: NotificationInstantProps) {
  return (
    <EmailLayout
      preview={title}
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewAllUrl}
      unsubscribeUrl={preferencesUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={{ color: "#D4A843", fontSize: "22px" }}>{title}</Heading>
      {body ? <Text style={{ color: "#F5F0E6" }}>{body}</Text> : null}
      {actionUrl ? (
        <Link href={actionUrl} style={{ color: "#D4A843" }}>
          View details
        </Link>
      ) : null}
    </EmailLayout>
  );
}

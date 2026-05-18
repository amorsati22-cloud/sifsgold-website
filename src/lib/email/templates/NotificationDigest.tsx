import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";

export type DigestItem = {
  title: string;
  body?: string;
  actionUrl?: string;
  category?: string;
};

export type NotificationDigestProps = {
  recipientEmail: string;
  recipientName?: string;
  items: DigestItem[];
  preferencesUrl: string;
  viewAllUrl: string;
  periodLabel: string;
};

export function NotificationDigest({
  recipientEmail,
  recipientName,
  items,
  preferencesUrl,
  viewAllUrl,
  periodLabel,
}: NotificationDigestProps) {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,";

  return (
    <EmailLayout
      preview={`Your ${periodLabel} notification digest`}
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewAllUrl}
      unsubscribeUrl={preferencesUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={{ color: "#D4A843", fontSize: "22px" }}>Your {periodLabel} digest</Heading>
      <Text style={{ color: "#F5F0E6" }}>{greeting}</Text>
      <Text style={{ color: "#C49434" }}>
        You have {items.length} unread notification{items.length === 1 ? "" : "s"}.
      </Text>
      {items.map((item, i) => (
        <Text key={i} style={{ color: "#F5F0E6", marginTop: "12px" }}>
          <strong>{item.title}</strong>
          {item.body ? ` — ${item.body}` : ""}
          {item.actionUrl ? (
            <>
              {" "}
              <Link href={item.actionUrl} style={{ color: "#D4A843" }}>
                Open
              </Link>
            </>
          ) : null}
        </Text>
      ))}
      <Link href={viewAllUrl} style={{ color: "#D4A843", display: "block", marginTop: "16px" }}>
        View all notifications
      </Link>
    </EmailLayout>
  );
}

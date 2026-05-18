import { EmailLayout } from "@/lib/email/templates/EmailLayout";

type Props = {
  studentName: string;
  schoolName: string;
  subject: string;
  body: string;
};

export function SchoolCohortAnnouncement({ studentName, schoolName, subject, body }: Props) {
  return (
    <EmailLayout preview={subject}>
      <h1 style={{ color: "#D4A843", fontFamily: "Georgia, serif" }}>{schoolName}</h1>
      <p style={{ color: "#f5f0e6" }}>Hi {studentName},</p>
      <p style={{ color: "#f5f0e6", whiteSpace: "pre-wrap" }}>{body}</p>
      <p style={{ color: "#C49434", fontSize: 12 }}>
        This message was sent by your school through Sif&apos;s Gold. Reply to your instructor or school office for questions.
      </p>
    </EmailLayout>
  );
}

import { notFound } from "next/navigation";
import { EmailPreview } from "@/components/email/EmailPreview";

export default function DevEmailPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-navy">
      <EmailPreview />
    </div>
  );
}

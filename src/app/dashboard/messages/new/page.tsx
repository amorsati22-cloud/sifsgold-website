import type { Metadata } from "next";
import { Suspense } from "react";
import { NewMessageForm } from "@/components/messaging/NewMessageForm";

export const metadata: Metadata = {
  title: "New message",
  robots: { index: false, follow: false },
};

export default function NewMessagePage() {
  return (
    <Suspense fallback={<p className="font-body text-gold-body">Loading…</p>}>
      <NewMessageForm />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { ThreadList } from "@/components/messaging/ThreadList";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <ThreadList />;
}

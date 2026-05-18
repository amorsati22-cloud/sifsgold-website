import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const MESSAGES_NAV = [
  { href: "/dashboard/messages", label: "Inbox" },
  { href: "/dashboard/messages/new", label: "New message" },
];

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard/messages");

  return (
    <DashboardShell
      title="Pass a Note"
      description="Encrypted in-app messaging — not SMS. Messages are encrypted at rest and decrypted on your device."
      nav={MESSAGES_NAV}
    >
      {children}
    </DashboardShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Join salon team",
  robots: { index: false, follow: false },
};

type Props = { searchParams: { token?: string } };

export default async function SalonJoinPage({ searchParams }: Props) {
  const token = searchParams.token;
  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-body text-cream">Invalid invite link.</p>
      </div>
    );
  }

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=/salon/join?token=${encodeURIComponent(token)}`);
  }

  const { data: invite } = await supabase
    .from("salon_staff_invites")
    .select("*, salon:salons(name)")
    .eq("token", token)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!invite) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-body text-cream">This invite has expired or was already used.</p>
      </div>
    );
  }

  const salonName = (invite.salon as { name: string } | null)?.name ?? "a salon";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-2xl text-gold">Join {salonName}</h1>
      <p className="mt-3 font-body text-sm text-cream/80">
        Accept this invite to join the team on Sif&apos;s Gold. You&apos;ll need an active pro profile.
      </p>
      <form action={`/api/salons/join`} method="post" className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          className="w-full rounded-brand-sm bg-gold py-3 font-body text-sm font-medium text-navy"
        >
          Accept invite
        </button>
      </form>
      <Link href="/dashboard" className="mt-4 block text-center font-body text-sm text-gold-body hover:text-gold">
        Back to dashboard
      </Link>
    </div>
  );
}

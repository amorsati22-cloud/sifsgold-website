import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNotifications } from "@/components/notifications/DashboardNotifications";
import { getDashboardNavForUserType } from "@/lib/dashboard/nav";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy py-16 text-cream">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="font-heading text-2xl text-gold">Dashboard unavailable</h1>
          <p className="mt-3 font-body text-sm text-cream/80">
            Supabase is not configured for this environment.
          </p>
          <Link href="/" className="mt-6 inline-block text-gold underline-offset-2 hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect("/sign-in?next=/dashboard");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  const nav = getDashboardNavForUserType(profile?.user_type as string | undefined);
  const isClientHome = nav.some((n) => n.href === "/dashboard/home");

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy text-cream">
      <div className="border-b border-gold/15 bg-navy-deep/90">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-goldBody">
                {isClientHome ? "Client home" : "Member dashboard"}
              </p>
              <p className="font-body text-sm text-cream/70">{user.email}</p>
            </div>
            <DashboardNotifications userId={user.id} />
          </div>
          <nav aria-label="Dashboard" className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-brand-md border border-gold/20 px-3 py-2 font-body text-sm text-cream/90 transition hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}

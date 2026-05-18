"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type NavigationAuthActionsProps = {
  initialUserEmail?: string | null;
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

function linkClass(pathname: string, href: string, mobile?: boolean) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  if (mobile) {
    return `rounded-brand-md px-2 py-3 font-body text-lg font-medium ${
      active ? "text-gold" : "text-cream/90"
    }`;
  }
  return `font-body text-sm font-medium transition hover:text-gold ${active ? "text-gold" : "text-cream/80"}`;
}

export function NavigationAuthActions({
  initialUserEmail = null,
  pathname,
  mobile,
  onNavigate,
}: NavigationAuthActionsProps) {
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail);

  useEffect(() => {
    setUserEmail(initialUserEmail);
  }, [initialUserEmail]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (userEmail) {
    return (
      <div className={mobile ? "flex flex-col gap-1" : "flex items-center gap-6"}>
        <Link href="/dashboard" className={linkClass(pathname, "/dashboard", mobile)} onClick={onNavigate}>
          Dashboard
        </Link>
        <form action="/api/auth/sign-out" method="post" className={mobile ? "px-2" : undefined}>
          <button
            type="submit"
            className={
              mobile
                ? "w-full rounded-brand-md py-3 text-left font-body text-lg font-medium text-cream/90 hover:text-gold"
                : "font-body text-sm font-medium text-cream/80 transition hover:text-gold"
            }
            onClick={onNavigate}
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={mobile ? "flex flex-col gap-1" : "flex items-center gap-6"}>
      <Link href="/sign-in" className={linkClass(pathname, "/sign-in", mobile)} onClick={onNavigate}>
        Sign in
      </Link>
      {mobile ? (
        <Link href="/sign-up" className={linkClass(pathname, "/sign-up", mobile)} onClick={onNavigate}>
          Sign up
        </Link>
      ) : (
        <GoldButton label="Sign up" href="/sign-up" variant="outlined" size="sm" />
      )}
    </div>
  );
}

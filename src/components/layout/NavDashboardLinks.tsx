"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function linkClass(pathname: string, href: string, mobile: boolean) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const base = mobile
    ? "rounded-brand-md px-2 py-3 font-body text-lg font-medium"
    : "inline-flex items-center gap-2 font-body text-sm font-medium";
  return `${base} transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
    active ? "text-gold" : mobile ? "text-cream/90" : "text-cream/80"
  }`;
}

export function NavDashboardLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!signedIn) return null;

  const Wrapper = mobile ? "div" : "span";
  const wrapperClass = mobile ? "flex flex-col gap-1" : "contents";

  return (
    <Wrapper className={wrapperClass}>
      <Link href="/dashboard" className={linkClass(pathname, "/dashboard", mobile)}>
        Dashboard
      </Link>
      <Link
        href="/dashboard/health-hub"
        className={linkClass(pathname, "/dashboard/health-hub", mobile)}
      >
        Health Hub
        <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal">
          Private
        </span>
      </Link>
      <Link
        href="/dashboard/photo-studio"
        className={linkClass(pathname, "/dashboard/photo-studio", mobile)}
      >
        Photo Studio
        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
          Pro
        </span>
      </Link>
    </Wrapper>
  );
}

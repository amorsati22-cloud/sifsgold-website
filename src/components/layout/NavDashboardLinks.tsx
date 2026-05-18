"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
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
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    async function load() {
      const { data } = await supabase.auth.getUser();
      setSignedIn(Boolean(data.user));
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .maybeSingle();
        setUserType(profile?.user_type ?? null);
      } else {
        setUserType(null);
      }
    }

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
      if (!session?.user) setUserType(null);
      else {
        void supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => setUserType(profile?.user_type ?? null));
      }
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
      {userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number]) && (
        <Link href="/dashboard/vault" className={linkClass(pathname, "/dashboard/vault", mobile)}>
          The Vault
          <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal">
            Private
          </span>
        </Link>
      )}
      <Link
        href="/dashboard/photo-studio"
        className={linkClass(pathname, "/dashboard/photo-studio", mobile)}
      >
        Photo Studio
        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
          Pro
        </span>
      </Link>
      {userType && BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number]) && (
        <Link href="/dashboard/brand-deals" className={linkClass(pathname, "/dashboard/brand-deals", mobile)}>
          Brand Deals
        </Link>
      )}
      {userType && ADVOCATE_USER_TYPES.includes(userType as (typeof ADVOCATE_USER_TYPES)[number]) && (
        <>
          <Link
            href="/dashboard/advocate/brand-deals"
            className={linkClass(pathname, "/dashboard/advocate/brand-deals", mobile)}
          >
            Brand Deals
          </Link>
          <Link href="/brand-deals/marketplace" className={linkClass(pathname, "/brand-deals/marketplace", mobile)}>
            Campaign marketplace
          </Link>
        </>
      )}
    </Wrapper>
  );
}

import { type NextRequest, NextResponse } from "next/server";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { isReservedUsername } from "@/lib/reserved-usernames";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

const DASHBOARD_PRO_PATHS = [
  "/dashboard/profile",
  "/dashboard/portfolio",
  "/dashboard/credentials",
  "/dashboard/reviews",
];

const DASHBOARD_BUYER_PATHS = ["/dashboard/orders", "/dashboard/wishlist", "/dashboard/returns"];

const DASHBOARD_STOREFRONT_PATHS = ["/dashboard/storefront"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = await updateSession(request);

  const isDashboardProRoute = DASHBOARD_PRO_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardBuyerRoute = DASHBOARD_BUYER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardStorefrontRoute = DASHBOARD_STOREFRONT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isProtectedDashboard =
    isDashboardProRoute || isDashboardBuyerRoute || isDashboardStorefrontRoute;

  if (isProtectedDashboard) {
    if (!isSupabaseConfigured()) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const signIn = new URL("/sign-in", request.url);
      signIn.searchParams.set("next", pathname);
      return NextResponse.redirect(signIn);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .maybeSingle();

    if (isDashboardProRoute) {
      if (!profile || !PRO_USER_TYPES.includes(profile.user_type as (typeof PRO_USER_TYPES)[number])) {
        return NextResponse.redirect(new URL("/for-pros", request.url));
      }
    }

    if (isDashboardStorefrontRoute) {
      if (!profile || !BRAND_USER_TYPES.includes(profile.user_type as (typeof BRAND_USER_TYPES)[number])) {
        return NextResponse.redirect(new URL("/for-brands", request.url));
      }
    }
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1 && segments.length <= 2) {
    const username = segments[0]?.toLowerCase();
    if (username && !isReservedUsername(username) && isSupabaseConfigured()) {
      const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });

      const { data } = await supabase
        .from("pro_profiles")
        .select("visible_in_search")
        .eq("username", username)
        .maybeSingle();

      if (data && data.visible_in_search === false) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/profile",
    "/dashboard/profile/:path*",
    "/dashboard/portfolio",
    "/dashboard/portfolio/:path*",
    "/dashboard/credentials",
    "/dashboard/credentials/:path*",
    "/dashboard/reviews",
    "/dashboard/reviews/:path*",
    "/dashboard/orders",
    "/dashboard/orders/:path*",
    "/dashboard/wishlist",
    "/dashboard/wishlist/:path*",
    "/dashboard/returns",
    "/dashboard/returns/:path*",
    "/dashboard/storefront",
    "/dashboard/storefront/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

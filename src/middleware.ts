import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/allowlist";
import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { isSalonUserType } from "@/lib/auth-salon";
import { isSchoolUserType } from "@/lib/auth-school";
import { isReservedUsername } from "@/lib/reserved-usernames";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

const DASHBOARD_MESSAGES_PATHS = ["/dashboard/messages"];
const DASHBOARD_SALON_PATHS = ["/dashboard/salon"];

const DASHBOARD_PRO_PATHS = [
  "/dashboard/pro",
  "/dashboard/profile",
  "/dashboard/portfolio",
  "/dashboard/credentials",
  "/dashboard/reviews",
  "/dashboard/services",
  "/dashboard/calendar",
  "/dashboard/availability",
  "/dashboard/photo-studio",
  "/dashboard/vault",
  "/dashboard/video-calls",
];

const DASHBOARD_BUYER_PATHS = ["/dashboard/orders", "/dashboard/wishlist", "/dashboard/returns"];

const DASHBOARD_STOREFRONT_PATHS = ["/dashboard/storefront"];
const DASHBOARD_BRAND_DEALS_PATHS = ["/dashboard/brand-deals"];
const DASHBOARD_ADVOCATE_DEALS_PATHS = ["/dashboard/advocate"];
const BRAND_DEALS_MARKETPLACE_PATHS = ["/brand-deals/marketplace", "/brand-deals"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = await updateSession(request);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isSupabaseConfigured()) {
      return NextResponse.redirect(new URL("/sign-in?next=/admin", request.url));
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

    if (!isAdmin(user.email)) {
      const denied = new URL("/dashboard", request.url);
      denied.searchParams.set("error", "admin_forbidden");
      return NextResponse.redirect(denied);
    }
  }

  const isDashboardProRoute = DASHBOARD_PRO_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardBuyerRoute = DASHBOARD_BUYER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardStorefrontRoute = DASHBOARD_STOREFRONT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardBrandDealsRoute = DASHBOARD_BRAND_DEALS_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardAdvocateDealsRoute = DASHBOARD_ADVOCATE_DEALS_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isBrandDealsMarketplaceRoute = BRAND_DEALS_MARKETPLACE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardSalonRoute = DASHBOARD_SALON_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardSchoolRoute = DASHBOARD_SCHOOL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isDashboardStudentSchoolRoute = DASHBOARD_STUDENT_SCHOOL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isProtectedDashboard =
    isDashboardProRoute ||
    isDashboardBuyerRoute ||
    isDashboardStorefrontRoute ||
    isDashboardBrandDealsRoute ||
    isDashboardAdvocateDealsRoute ||
    isBrandDealsMarketplaceRoute ||
    isDashboardSalonRoute ||
    isDashboardSchoolRoute ||
    isDashboardStudentSchoolRoute;

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

    if (isDashboardStorefrontRoute || isDashboardBrandDealsRoute) {
      if (!profile || !BRAND_USER_TYPES.includes(profile.user_type as (typeof BRAND_USER_TYPES)[number])) {
        return NextResponse.redirect(new URL("/for-brands", request.url));
      }
    }

    if (isDashboardAdvocateDealsRoute) {
      if (!profile || !ADVOCATE_USER_TYPES.includes(profile.user_type as (typeof ADVOCATE_USER_TYPES)[number])) {
        return NextResponse.redirect(new URL("/advocates", request.url));
      }
    }

    if (isBrandDealsMarketplaceRoute) {
      const isAdvocate = profile && ADVOCATE_USER_TYPES.includes(profile.user_type as (typeof ADVOCATE_USER_TYPES)[number]);
      const isBrand = profile && BRAND_USER_TYPES.includes(profile.user_type as (typeof BRAND_USER_TYPES)[number]);
      if (!isAdvocate && !isBrand) {
        return NextResponse.redirect(new URL("/advocates", request.url));
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
    "/admin",
    "/admin/:path*",
    "/dashboard/messages",
    "/dashboard/messages/:path*",
    "/dashboard/salon",
    "/dashboard/salon/:path*",
    "/dashboard/school",
    "/dashboard/school/:path*",
    "/dashboard/student",
    "/dashboard/student/:path*",
    "/dashboard/pro",
    "/dashboard/pro/:path*",
    "/dashboard/profile",
    "/dashboard/profile/:path*",
    "/dashboard/calendar",
    "/dashboard/calendar/:path*",
    "/dashboard/availability",
    "/dashboard/availability/:path*",
    "/dashboard/services",
    "/dashboard/services/:path*",
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
    "/dashboard/brand-deals",
    "/dashboard/brand-deals/:path*",
    "/dashboard/advocate",
    "/dashboard/advocate/:path*",
    "/brand-deals",
    "/brand-deals/:path*",
    "/brand-deals/marketplace",
    "/brand-deals/marketplace/:path*",
    "/dashboard/vault",
    "/dashboard/vault/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Forgot Password | Sif's Gold",
  description: "Password recovery for Sif's Gold — available at app launch.",
  alternates: { canonical: `${BRAND.url}/forgot-password` },
};

export default function ForgotPasswordPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Forgot password", href: "/forgot-password" },
        ]}
      />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md rounded-2xl border border-white/10 bg-navy-dark/70 p-8 text-center shadow-xl backdrop-blur-md">
          <h1 className="font-heading text-2xl font-semibold text-gold md:text-3xl">Forgot password</h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/85">
            Coming with launch. For now, please contact us if you need help — use the secure{" "}
            <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
              contact form
            </Link>
            .
          </p>
          <p className="mt-6 text-sm text-cream/65">
            <Link href="/sign-in" className="text-gold underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}

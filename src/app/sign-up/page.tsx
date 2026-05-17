import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SIGNUP_USER_TYPE_OPTIONS } from "@/data/signup-user-types";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign Up | Sif's Gold",
  description: "Choose your starting place on Sif's Gold — student, pro, brand, client, and more.",
  alternates: { canonical: `${BRAND.url}/sign-up` },
};

export default function SignUpPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Sign up", href: "/sign-up" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="max-w-4xl font-heading text-4xl font-black leading-tight text-gold md:text-5xl">
            Choose your starting place.
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Pick the user type that fits you best — you can always add more later. Full account creation ships inside the app
            at launch; this page helps us route the right onboarding to you.
          </p>
        </div>
      </header>

      <section className="bg-navy-light/20 py-14 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SIGNUP_USER_TYPE_OPTIONS.map((opt) => {
              const Icon = opt.Icon;
              const href = `/waitlist-confirmation?userType=${opt.slug}&source=signup_user_type_picker`;
              return (
                <Link
                  key={opt.slug}
                  href={href}
                  scroll
                  className="group flex flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 transition hover:border-gold/50 hover:bg-navy-deep/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold transition group-hover:bg-gold/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="mt-4 font-heading text-lg text-gold">{opt.label}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-cream/80">{opt.description}</span>
                  <span className="mt-5 text-sm font-semibold text-gold underline-offset-4 group-hover:underline">
                    Coming with launch
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}

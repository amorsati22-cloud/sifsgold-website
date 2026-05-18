import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToolsHubClient } from "@/components/tools/ToolsHubClient";
import { BRAND } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pro Tools",
  description:
    "Free client-side calculators for tips, color formulas, pricing, taxes, licensure, and more — built for beauty professionals.",
  alternates: { canonical: `${BRAND.url}/tools` },
};

export default async function ToolsHubPage() {
  const supabase = await createClient();
  let signedIn = false;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Pro tools</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/88">
            Calculators and quick utilities you can use on the chair — no sign-in required. Save presets when
            you&apos;re logged in.
          </p>
        </div>
      </header>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ToolsHubClient signedIn={signedIn} />
        </div>
      </section>
    </article>
  );
}

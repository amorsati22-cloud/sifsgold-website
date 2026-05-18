import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Book an appointment",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { service_id?: string; service?: string; pro?: string; type?: string };
};

export default async function BookingNewPage({ searchParams }: PageProps) {
  const username = searchParams.pro?.trim().toLowerCase();
  if (!username) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-heading text-2xl text-gold">Book an appointment</h1>
        <p className="mt-4 font-body text-sm text-cream/80">
          Choose a professional from their profile or services menu to start booking.
        </p>
        <Link href="/" className="mt-8 inline-block text-gold underline-offset-2 hover:underline">
          ← Home
        </Link>
      </div>
    );
  }

  const bundle = await getPublicProProfileByUsername(username);
  if (!bundle) notFound();

  const serviceId = searchParams.service_id ?? searchParams.service;
  const bookable = bundle.services.filter((s) => s.bookable_online);

  const supabase = await createClient();
  let loggedIn: { name?: string; email?: string; phone?: string } | undefined;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata as Record<string, string | undefined>;
      loggedIn = {
        email: user.email ?? undefined,
        name: meta.full_name ?? meta.name,
        phone: meta.phone,
      };
    }
  }

  const isConsultation = searchParams.type === "consultation";

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href={`/${username}`} className="hover:text-gold">
          @{username}
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <Link href={`/${username}/services`} className="hover:text-gold">
          Services
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">{isConsultation ? "Consultation" : "Book"}</span>
      </nav>
      <h1 className="font-heading text-3xl text-gold">
        {isConsultation ? "Request a consultation" : "Book an appointment"}
      </h1>
      <BookingWizard
        pro={{
          id: bundle.profile.id,
          username: bundle.profile.username,
          display_name: bundle.profile.display_name,
          timezone: (bundle.profile as { timezone?: string }).timezone ?? "America/Chicago",
        }}
        services={bookable}
        initialServiceId={serviceId}
        loggedIn={loggedIn}
      />
    </div>
  );
}

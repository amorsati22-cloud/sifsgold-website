import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book an appointment",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { service_id?: string; pro?: string; type?: string };
};

export default function BookingNewPage({ searchParams }: PageProps) {
  const isConsultation = searchParams.type === "consultation";

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-2xl text-gold">
        {isConsultation ? "Request a consultation" : "Book an appointment"}
      </h1>
      <p className="mt-4 font-body text-sm text-cream/80">
        Online booking opens with the full Sif&apos;s Gold app launch. Your service selection has been
        noted{searchParams.service_id ? " for this menu item" : ""}.
      </p>
      {searchParams.pro ? (
        <p className="mt-2 font-body text-sm text-gold-body">
          Professional: @{searchParams.pro}
        </p>
      ) : null}
      <Link
        href={searchParams.pro ? `/${searchParams.pro}/services` : "/"}
        className="mt-8 inline-block text-gold underline-offset-2 hover:underline"
      >
        ← Back to services menu
      </Link>
    </div>
  );
}

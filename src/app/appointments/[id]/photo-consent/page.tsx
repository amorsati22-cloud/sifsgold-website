import type { Metadata } from "next";
import { PhotoConsentClient } from "@/components/photo-studio/PhotoConsentClient";

export const metadata: Metadata = {
  title: "Photo permission",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PhotoConsentPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy py-16 text-cream">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="font-heading text-3xl font-bold text-gold">Photo permission</h1>
        <p className="mt-4 font-body text-cream/85">
          Your beauty professional requested permission to use photos from your appointment in their Sif&apos;s
          Gold portfolio. You control whether these images may be shared publicly.
        </p>
        <PhotoConsentClient appointmentId={id} token={token ?? ""} />
      </div>
    </article>
  );
}

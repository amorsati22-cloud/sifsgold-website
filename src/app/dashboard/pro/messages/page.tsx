import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

type Props = { searchParams: { client?: string } };

export default function ProMessagesPage({ searchParams }: Props) {
  return (
    <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-8 text-center">
      <h2 className="font-heading text-xl text-gold">Pass a Note</h2>
      <p className="mt-3 font-body text-sm text-cream/80">
        Secure messaging with clients ships in Prompt 23. Threads will open here
        {searchParams.client ? " for your selected client" : ""}.
      </p>
      <Link href="/dashboard/pro/clients" className="mt-6 inline-block text-gold underline">
        ← Back to clients
      </Link>
    </div>
  );
}

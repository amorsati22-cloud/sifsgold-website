"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-navy py-16">
      <div className="mx-auto w-full max-w-content px-4 text-center sm:px-6 md:px-8">
        <h1 className="font-heading text-4xl text-cream sm:text-5xl">
          Something went sideways.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80">
          Our team has been notified. While we look into it, you can try again or head back home.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 font-body text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10"
          >
            Back to Home
          </Link>
        </div>

        {isDev ? (
          <details className="mx-auto mt-8 max-w-3xl rounded-brand-md border border-gold/20 bg-navy-deep/70 p-4 text-left">
            <summary className="cursor-pointer font-semibold text-gold">
              Development Error Details
            </summary>
            <p className="mt-3 text-sm text-cream/90">{error.message}</p>
            {error.stack ? (
              <pre className="mt-3 overflow-x-auto rounded-brand-sm bg-navy p-3 text-xs text-cream/80">
                {error.stack}
              </pre>
            ) : null}
          </details>
        ) : null}
      </div>
    </section>
  );
}


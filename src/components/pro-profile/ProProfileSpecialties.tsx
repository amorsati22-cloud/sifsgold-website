import Link from "next/link";
import type { ProProfile } from "@/types/pro-profile";

export function ProProfileSpecialties({ profile }: { profile: ProProfile }) {
  const specialties = profile.specialties?.filter(Boolean) ?? [];
  if (specialties.length === 0) return null;

  return (
    <section className="border-b border-gold/10 bg-navy-deep/40 py-10" aria-labelledby="pro-specialties-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id="pro-specialties-heading" className="font-heading text-xl text-gold">
          Specialties
        </h2>
        <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
          {specialties.map((tag) => (
            <li key={tag}>
              <span className="inline-flex rounded-full border border-gold/25 bg-gold/5 px-3 py-1 font-body text-sm text-cream">
                {tag.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-body text-sm">
          <Link
            href={`/${profile.username}/services`}
            className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            View services menu →
          </Link>
        </p>
      </div>
    </section>
  );
}

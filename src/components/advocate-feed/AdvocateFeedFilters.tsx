"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdvocatePostType } from "@/types/challenges-feed";

const TYPES: { value: AdvocatePostType | ""; label: string }[] = [
  { value: "", label: "All types" },
  { value: "tip", label: "Tips" },
  { value: "tutorial", label: "Tutorials" },
  { value: "before_after", label: "Before / after (craft)" },
  { value: "brand_partner", label: "Brand partner" },
];

const SPECIALTIES = ["", "hair", "skin", "nails", "education", "fashion"];

export function AdvocateFeedFilters({
  postType,
  specialty,
  brandPartnerOnly,
}: {
  postType?: AdvocatePostType;
  specialty?: string;
  brandPartnerOnly?: boolean;
}) {
  const pathname = usePathname();

  function href(overrides: { postType?: string; specialty?: string; brandPartner?: boolean }) {
    const p = new URLSearchParams();
    const pt = overrides.postType ?? postType ?? "";
    const sp = overrides.specialty ?? specialty ?? "";
    const bp = overrides.brandPartner ?? brandPartnerOnly ?? false;
    if (pt) p.set("type", pt);
    if (sp) p.set("specialty", sp);
    if (bp) p.set("brand", "1");
    const q = p.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map((t) => (
        <Link
          key={t.label}
          href={href({ postType: t.value })}
          className={`rounded-full border px-3 py-1 text-xs ${
            (postType ?? "") === t.value ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
          }`}
        >
          {t.label}
        </Link>
      ))}
      {SPECIALTIES.filter(Boolean).map((s) => (
        <Link
          key={s}
          href={href({ specialty: s })}
          className={`rounded-full border px-3 py-1 text-xs ${
            specialty === s ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
          }`}
        >
          {s}
        </Link>
      ))}
      <Link
        href={href({ brandPartner: !brandPartnerOnly })}
        className={`rounded-full border px-3 py-1 text-xs ${
          brandPartnerOnly ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
        }`}
      >
        Brand partnerships
      </Link>
    </div>
  );
}

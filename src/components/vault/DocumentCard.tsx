"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { VaultDocument } from "@/lib/vault/types";

const TYPE_LABELS: Record<string, string> = {
  license: "License",
  insurance: "Insurance",
  contract: "Contract",
  tax_form: "Tax",
  client_record: "Client",
  color_formula: "Formula",
  receipt: "Receipt",
  certification: "Cert",
  other: "File",
};

function isExpiringSoon(expiry: string | null): boolean {
  if (!expiry) return false;
  const days = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
}

type Props = {
  doc: VaultDocument;
  onToggleStar?: (id: string, starred: boolean) => void;
};

export function DocumentCard({ doc, onToggleStar }: Props) {
  const expiring = isExpiringSoon(doc.expiry_date);

  return (
    <article className="group relative rounded-brand-md border border-gold/15 bg-navy-lift p-4 transition hover:border-gold/40">
      <Link
        href={`/dashboard/vault/document/${doc.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded-brand-sm"
      >
        <div className="flex aspect-[4/3] items-center justify-center rounded-brand-sm bg-navy-deep/80">
          {doc.mime_type?.startsWith("image/") ? (
            <span className="font-body text-xs text-gold-body">Encrypted image</span>
          ) : (
            <span className="font-heading text-2xl text-gold/50">{TYPE_LABELS[doc.document_type] ?? "DOC"}</span>
          )}
        </div>
        <h3 className="mt-3 truncate font-body font-medium text-cream">{doc.name}</h3>
        <p className="mt-1 font-body text-xs capitalize text-gold-body">{doc.document_type.replace("_", " ")}</p>
        {expiring && (
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-200">
            Expiring soon
          </span>
        )}
      </Link>
      {onToggleStar && (
        <button
          type="button"
          aria-label={doc.starred ? "Unstar document" : "Star document"}
          onClick={(e) => {
            e.preventDefault();
            onToggleStar(doc.id, !doc.starred);
          }}
          className="absolute right-3 top-3 rounded-full p-1 text-gold focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <Star className={`h-4 w-4 ${doc.starred ? "fill-gold" : ""}`} />
        </button>
      )}
    </article>
  );
}

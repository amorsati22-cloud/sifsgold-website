"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  generateBreadcrumbSchema,
  type BreadcrumbSchemaItem,
} from "@/lib/schema";

type BreadcrumbProps = {
  items: BreadcrumbSchemaItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  const schema = generateBreadcrumbSchema(items);

  return (
    <nav
      aria-label="Breadcrumb"
      className={className ?? "mx-auto max-w-content px-4 pt-6 sm:px-6 md:px-8"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-xs text-cream/75 sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.name}`} className="inline-flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-gold">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition duration-brand-fast hover:text-gold"
                >
                  {item.name}
                </Link>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-gold/70" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

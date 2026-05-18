"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { getCategoryLabel } from "@/lib/services/categories";
import type { ServiceCategoryRow } from "@/types/services";
import type { ServiceWithAddons } from "@/types/services";

type CategoryGroup = {
  categoryId: string;
  services: ServiceWithAddons[];
};

type ServicesMenuProps = {
  username: string;
  groups: CategoryGroup[];
  categories: ServiceCategoryRow[];
};

export function ServicesMenu({ username, groups, categories }: ServicesMenuProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.categoryId)),
  );

  function toggle(categoryId: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  if (groups.length === 0) {
    return <p className="font-body text-cream/70">No bookable services listed yet. Check back soon.</p>;
  }

  return (
    <div className="space-y-4">
      {groups.map(({ categoryId, services }) => {
        const isOpen = openCategories.has(categoryId);
        const label = getCategoryLabel(categories, categoryId);
        const panelId = `services-cat-${categoryId}`;

        return (
          <section key={categoryId} className="rounded-brand-lg border border-gold/10 bg-navy-deep/30">
            <h2>
              <button
                type="button"
                id={`${panelId}-button`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(categoryId)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-heading text-lg text-gold transition hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold motion-reduce:transition-none"
              >
                <span>
                  {label}
                  <span className="ml-2 font-body text-sm font-normal text-cream/60">
                    ({services.length})
                  </span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-button`}
              hidden={!isOpen}
              className="border-t border-gold/10 px-4 py-4"
            >
              <ul className="list-none space-y-4 p-0">
                {services.map((service) => (
                  <li key={service.id}>
                    <ServiceCard service={service} username={username} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}

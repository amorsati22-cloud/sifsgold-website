import { ClipboardList } from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";

/** Static preview of the pro services menu — matches mobile app layout at a glance. */
export function ServicesMenuPreview() {
  const sampleServices = [
    {
      category: "Hair Color",
      items: [
        { name: "Balayage", duration: "3 hr", price: "From $220", note: "Patch test 48h before" },
        { name: "Root touch-up", duration: "90 min", price: "$95", note: "" },
      ],
    },
    {
      category: "Hair Cut",
      items: [{ name: "Women's cut + style", duration: "60 min", price: "$75", note: "" }],
    },
  ];

  return (
    <section
      className="border-b border-gold/10 bg-navy-deep/50 py-14 md:py-16"
      aria-labelledby="services-menu-preview-heading"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-gold-body">
                <ClipboardList className="h-4 w-4 text-gold" aria-hidden />
                Services menu
              </p>
              <h2 id="services-menu-preview-heading" className="mt-2 font-heading text-2xl text-gold md:text-3xl">
                Here&apos;s how your services menu works
              </h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-cream/85 md:text-base">
                Build your menu once with durations, pricing, add-ons, prerequisites, and cancellation
                policies. Clients browse on your public profile and book straight from each service — the
                same flow they see in the mobile app.
              </p>
            </div>
            <div
              className="rounded-brand-lg border border-gold/20 bg-navy p-4 shadow-lg"
              role="img"
              aria-label="Preview of a services menu with categories Balayage and Hair Cut"
            >
              {sampleServices.map((group) => (
                <div key={group.category} className="mb-4 last:mb-0">
                  <p className="font-heading text-sm text-gold">{group.category}</p>
                  <ul className="mt-2 list-none space-y-2 p-0">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="rounded-brand-md border border-gold/10 bg-navy-deep/60 px-3 py-2"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="font-body text-sm font-medium text-cream">{item.name}</span>
                          <span className="font-body text-sm text-gold">{item.price}</span>
                        </div>
                        <p className="font-body text-xs text-gold-body">
                          {item.duration}
                          {item.note ? ` · ${item.note}` : ""}
                        </p>
                        <span className="mt-2 inline-block rounded-full border border-gold/30 px-2 py-0.5 font-body text-[10px] text-gold">
                          Book this service
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

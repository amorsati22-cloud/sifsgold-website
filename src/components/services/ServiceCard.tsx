import { Clock, Plus } from "lucide-react";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl, getConsultationUrl } from "@/lib/booking";
import { cancellationPolicyLabel, prerequisiteLabel } from "@/lib/services/constants";
import { formatDuration, formatServicePrice, formatAddonPrice } from "@/lib/services/format";
import type { ServiceWithAddons } from "@/types/services";

type ServiceCardProps = {
  service: ServiceWithAddons;
  username: string;
  categoryLabel?: string;
  compact?: boolean;
  onBookClick?: () => void;
};

export function ServiceCard({
  service,
  username,
  categoryLabel,
  compact = false,
  onBookClick,
}: ServiceCardProps) {
  const showConsultation =
    service.requires_consultation || service.price_type === "custom_quote";
  const bookHref = showConsultation
    ? getConsultationUrl(username, service.id)
    : getBookingUrl(username, service.id);
  const bookLabel = showConsultation ? "Request consultation" : "Book this service";

  return (
    <article
      className={`rounded-brand-lg border border-gold/10 bg-navy/50 ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {categoryLabel ? (
            <p className="font-body text-xs uppercase tracking-wide text-gold-body">{categoryLabel}</p>
          ) : null}
          <h3 className={`font-heading text-cream ${compact ? "text-lg" : "text-xl"}`}>{service.name}</h3>
          {service.description ? (
            <p className="mt-2 font-body text-sm leading-relaxed text-cream/80">{service.description}</p>
          ) : null}
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-gold">
            <span className="font-semibold">{formatServicePrice(service)}</span>
            <span className="flex items-center gap-1 text-gold-body">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatDuration(service.duration_minutes)}
            </span>
          </p>
          {service.deposit_required && service.deposit_amount != null ? (
            <p className="mt-1 font-body text-xs text-cream/60">
              Deposit required: {formatAddonPrice(service.deposit_amount)}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 sm:pt-1">
          {onBookClick ? (
            <GoldButton label={bookLabel} onClick={onBookClick} variant="outlined" size="sm" />
          ) : (
            <GoldButton label={bookLabel} href={bookHref} variant="outlined" size="sm" />
          )}
        </div>
      </div>

      {service.addons.length > 0 ? (
        <div className="mt-4 border-t border-gold/10 pt-4">
          <p className="font-body text-xs font-semibold uppercase tracking-wide text-gold-body">Add-ons</p>
          <ul className="mt-2 list-none space-y-2 p-0">
            {service.addons.map((addon) => (
              <li
                key={addon.id}
                className="flex flex-wrap items-baseline justify-between gap-2 font-body text-sm text-cream/85"
              >
                <span className="flex items-center gap-1">
                  <Plus className="h-3 w-3 text-teal" aria-hidden />
                  {addon.name}
                  {addon.duration_minutes ? (
                    <span className="text-cream/50">(+{formatDuration(addon.duration_minutes)})</span>
                  ) : null}
                </span>
                <span className="text-gold-body">+{formatAddonPrice(addon.price_amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {service.prerequisites && service.prerequisites.length > 0 ? (
        <div className="mt-4">
          <p className="font-body text-xs font-semibold text-gold">Before your visit</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 font-body text-sm text-cream/75">
            {service.prerequisites.map((p) => (
              <li key={p}>{prerequisiteLabel(p)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {service.consultation_required_for_first_visit ? (
        <p className="mt-2 font-body text-xs text-teal">Consultation required for first-time clients.</p>
      ) : null}

      {service.cancellation_policy ? (
        <p className="mt-3 font-body text-xs text-cream/60">
          <span className="text-gold-body">Cancellation:</span>{" "}
          {cancellationPolicyLabel(service.cancellation_policy)}
        </p>
      ) : null}

      {service.aftercare_instructions && !compact ? (
        <details className="mt-3">
          <summary className="cursor-pointer font-body text-xs text-gold hover:underline">
            Aftercare instructions
          </summary>
          <p className="mt-2 whitespace-pre-line font-body text-sm text-cream/75">
            {service.aftercare_instructions}
          </p>
        </details>
      ) : null}
    </article>
  );
}

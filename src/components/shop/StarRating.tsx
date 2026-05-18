import { Star } from "lucide-react";

type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
};

export function StarRating({ rating, max = 5, size = "sm", showValue = false }: Props) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${rating.toFixed(1)} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={`${iconClass} ${filled ? "fill-gold text-gold" : "text-cream/30"}`}
            aria-hidden
          />
        );
      })}
      {showValue && <span className="ml-1 font-body text-sm text-gold-body">{rating.toFixed(1)}</span>}
    </span>
  );
}

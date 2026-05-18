import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
};

export function StarRating({ rating, max = 5, size = "md", label }: StarRatingProps) {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1" role="img" aria-label={label ?? `${rating} out of ${max} stars`}>
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
    </div>
  );
}

import type { SVGProps } from "react";

export type WheatBranchProps = SVGProps<SVGSVGElement> & {
  /** Stroke / fill uses currentColor (set className text-gold). */
  variant?: "stroke" | "fill";
};

/** Decorative wheat / leaf branch — section dividers and corner accents. */
export function WheatBranch({ variant = "stroke", className, ...props }: WheatBranchProps) {
  const stroke = variant === "stroke";
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      {stroke ? (
        <>
          <path
            d="M8 40c12-6 22-18 28-32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18 36c8-10 14-22 16-34M26 32c6-8 10-18 12-28M34 28c4-6 8-14 10-22"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M112 40c-12-6-22-18-28-32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M102 36c-8-10-14-22-16-34M94 32c-6-8-10-18-12-28M86 28c-4-6-8-14-10-22"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          fill="currentColor"
          fillOpacity="0.35"
          d="M60 4c-4 10-8 22-12 36h4c4-12 8-22 12-30 4 8 8 18 12 30h4C76 26 68 12 60 4z"
        />
      )}
    </svg>
  );
}

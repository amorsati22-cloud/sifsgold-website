import type { SVGProps } from "react";

/** Placeholder goddess profile silhouette — replace with final brand mark. */
export function GoddessProfile({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" className="opacity-90" />
      <path
        fill="currentColor"
        fillOpacity="0.85"
        d="M32 18c-4.5 0-8 3.2-8 7.2 0 2.1 1 4 2.5 5.2-1.2 1.4-2 3.2-2 5.1v2.5h15v-2.5c0-1.9-.7-3.7-1.9-5.1 1.5-1.2 2.4-3.1 2.4-5.2 0-4-3.5-7.2-8-7.2zm-9 22v6c0 2 1.6 3.6 3.6 3.6h10.8c2 0 3.6-1.6 3.6-3.6v-6H23z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        d="M14 46c4-6 10-9 18-9s14 3 18 9"
        className="opacity-70"
      />
    </svg>
  );
}

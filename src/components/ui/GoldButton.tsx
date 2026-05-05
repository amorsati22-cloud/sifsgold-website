"use client";

import Link from "next/link";

type Variant = "solid" | "outlined" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  solid:
    "bg-gold text-navy font-semibold hover:bg-gold-light border border-transparent",
  outlined:
    "border border-gold text-gold hover:bg-gold hover:text-navy bg-transparent",
  ghost: "text-gold hover:text-gold-light underline border-transparent bg-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

const baseClasses =
  "inline-flex w-full items-center justify-center rounded-full transition-all duration-200 font-body text-center md:w-auto";

export type GoldButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
};

export function GoldButton({
  label,
  href,
  onClick,
  variant = "solid",
  size = "md",
  className = "",
  type = "button",
}: GoldButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {label}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {label}
    </button>
  );
}

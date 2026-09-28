"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline";
type Tone = "paper" | "ink";

const base =
  "group inline-flex items-center justify-center gap-3 rounded-[2px] px-6 py-4 md:px-7 md:py-[18px] t-label transition-[background-color,color,border-color,transform] duration-300 ease-out active:translate-y-px";

function classes(variant: Variant, tone: Tone) {
  if (variant === "primary") {
    return `${base} bg-signal text-white hover:bg-signal-deep`;
  }
  return tone === "ink"
    ? `${base} border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink`
    : `${base} border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white`;
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 12"
      className="h-[9px] w-[15px] shrink-0 overflow-visible transition-transform duration-300 ease-out group-hover:translate-x-1"
      fill="none"
    >
      <path
        d="M0 6h18M13 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Button({
  children,
  variant = "primary",
  tone = "paper",
  arrow = true,
  className = "",
  ...rest
}: ComponentProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  arrow?: boolean;
}) {
  return (
    <button {...rest} className={`${classes(variant, tone)} ${className}`}>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  tone = "paper",
  arrow = true,
  className = "",
  external = false,
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  tone?: Tone;
  arrow?: boolean;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href">) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Link
      href={href}
      {...props}
      {...rest}
      className={`${classes(variant, tone)} ${className}`}
    >
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

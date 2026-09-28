"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scoped gsap.context + automatic cleanup. Zwraca ref, który podpinamy
 * do korzenia sekcji.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: { self: T }) => void | (() => void),
  deps: unknown[] = [],
) {
  const scope = useRef<T>(null);

  useIsoLayoutEffect(() => {
    const self = scope.current;
    if (!self) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ self });
    }, self);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/** Standardowa krzywa dla całego serwisu. */
export const EASE = "power3.out";

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useBooking } from "./booking/BookingContext";

const NAV = [
  { href: "#nauczyciel", label: "Nauczyciel" },
  { href: "#cele", label: "Po co Ci angielski" },
  { href: "#cennik", label: "Cennik" },
  { href: "#opinie", label: "Opinie" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] isolate transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-ink/10 border-b bg-white/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* delikatna poświata, żeby nawigacja była czytelna na zdjęciu w hero */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(247,248,250,0.96)_0%,rgba(247,248,250,0.78)_55%,rgba(247,248,250,0)_100%)] transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="mx-[var(--edge)] flex h-[68px] items-center justify-between gap-6 md:h-[78px]">
          <a
            href="#top"
            className="flex shrink-0 items-center"
            aria-label="Level Up Szkoła Językowa, wróć na początek strony"
          >
            <Image
              src="/img/logo-level-up.png"
              alt="Level Up Szkoła Językowa"
              width={590}
              height={675}
              priority
              className="h-[38px] w-auto md:h-[46px]"
            />
          </a>

          <nav
            className="hidden items-center gap-7 lg:flex xl:gap-9"
            aria-label="Główne"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-ink/75 hover:text-ink text-[14px] font-medium tracking-[-0.005em] transition-colors duration-200"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={site.phoneHref}
              className="text-ink hover:text-signal t-num hidden text-[14px] font-semibold whitespace-nowrap transition-colors duration-200 md:block"
            >
              {site.phone}
            </a>
            <button
              type="button"
              onClick={() => openBooking()}
              className="bg-signal hover:bg-signal-deep t-label rounded-[2px] px-4 py-3 text-white transition-colors duration-300 md:px-6 md:py-[14px]"
            >
              <span className="hidden sm:inline">Umów lekcję</span>
              <span className="sm:hidden">Umów</span>
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Otwórz menu"
              className="border-ink/20 text-ink rounded-[2px] border p-[11px] lg:hidden"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
                <path
                  d="M0 1h16M0 6h16M0 11h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menu ? (
        <div className="on-ink bg-ink fixed inset-0 z-[110] flex flex-col lg:hidden">
          <div className="mx-[var(--edge)] flex h-[68px] items-center justify-between">
            <span className="t-label text-white/45">Menu</span>
            <button
              type="button"
              onClick={() => setMenu(false)}
              aria-label="Zamknij menu"
              className="rounded-[2px] border border-white/25 p-[11px] text-white"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M1 1l16 16M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>
          <nav
            className="mx-[var(--edge)] mt-6 flex flex-col"
            aria-label="Menu mobilne"
          >
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="t-head flex items-baseline gap-4 border-b border-white/12 py-5 text-[clamp(1.6rem,8vw,2.4rem)] text-white"
              >
                <span className="t-label text-gold shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mx-[var(--edge)] mt-auto mb-8">
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                openBooking();
              }}
              className="bg-signal hover:bg-signal-deep t-label w-full rounded-[2px] py-4 text-white transition-colors duration-300"
            >
              Umów pierwszą lekcję
            </button>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={site.phoneHref}
                className="t-head text-[clamp(1.5rem,7vw,2rem)] text-white/90"
              >
                {site.phone}
              </a>
              <a href={site.emailHref} className="text-[15px] text-white/55">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

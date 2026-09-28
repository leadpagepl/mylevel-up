"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { googleRating, site } from "@/lib/site";
import {
  excerptOf,
  hasFullText,
  marqueeRowA,
  marqueeRowB,
  reviews as allReviews,
  type Review,
} from "@/lib/reviews";
import { ButtonLink } from "./ui/Button";
import { GoogleG, Stars } from "./ui/Stars";

/* ------------------------------------------------------------------ *
 *  Drobne elementy
 * ------------------------------------------------------------------ */

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATARS = ["bg-ink", "bg-signal", "bg-ink-soft"];

function Avatar({ name, index }: { name: string; index: number }) {
  return (
    <span
      aria-hidden="true"
      className={`${AVATARS[index % AVATARS.length]} flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide text-white`}
    >
      {initials(name)}
    </span>
  );
}

function ReviewCard({
  review,
  index,
  clone,
  onOpen,
}: {
  review: Review;
  index: number;
  clone: boolean;
  onOpen: (r: Review) => void;
}) {
  const more = hasFullText(review);

  return (
    <li className="mr-3 h-[176px] w-[276px] shrink-0 sm:mr-4 sm:h-[182px] sm:w-[348px]">
      <figure className="border-ink/12 flex h-full flex-col rounded-[3px] border bg-white px-5 py-[18px]">
        <Stars size={12} />
        <blockquote className="t-body text-ink/75 mt-3 line-clamp-3 text-[14px] leading-[1.5]">
          „{excerptOf(review)}”
        </blockquote>
        {more ? (
          <button
            type="button"
            onClick={() => onOpen(review)}
            tabIndex={clone ? -1 : 0}
            aria-hidden={clone || undefined}
            className="t-label text-signal hover:text-signal-deep mt-3 self-start underline-offset-4 transition-colors duration-200 hover:underline"
          >
            Czytaj całość
          </button>
        ) : null}
        <figcaption className="mt-auto flex items-center gap-2.5 pt-4">
          <Avatar name={review.name} index={index} />
          <span className="min-w-0">
            <span className="t-label text-ink block truncate">
              {review.name}
            </span>
            <span className="text-ink/40 mt-1 flex items-center gap-1.5 text-[11px]">
              <GoogleG size={10} />
              Opinia w Google
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

function MarqueeRow({
  items = [],
  travel,
  offset,
  onOpen,
}: {
  /** Opinie w tym pasie. Pusta tablica = pas się nie renderuje. */
  items?: Review[];
  /** Kierunek jazdy kart: "ltr" w prawo, "rtl" w lewo. */
  travel: "ltr" | "rtl";
  offset: number;
  onOpen: (r: Review) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);

  /* Focus wewnątrz paska przesunąłby scrollLeft i rozjechał pętlę. */
  const keepAligned = useCallback(() => {
    const el = viewport.current;
    if (el && el.scrollLeft !== 0 && !reducedMotion()) el.scrollLeft = 0;
  }, []);

  const set = (clone: boolean) => (
    <ul
      className="flex"
      data-clone={clone ? "true" : undefined}
      aria-hidden={clone || undefined}
    >
      {items.map((r, i) => (
        <ReviewCard
          key={`${clone ? "c" : "o"}-${r.id}`}
          review={r}
          index={i + offset}
          clone={clone}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );

  // Bez opinii nie ma czego przewijać — nie renderujemy pustego pasa.
  if (items.length === 0) return null;

  return (
    <div
      ref={viewport}
      className="marquee no-bar"
      onFocus={keepAligned}
      onScroll={keepAligned}
    >
      <div
        className="marquee-track"
        // "ltr" = karty jadą w prawo, więc animacja leci od -50% do 0.
        data-dir={travel === "ltr" ? "right" : undefined}
        style={
          {
            "--marquee-duration": `${Math.max(items.length, 1) * 8.8}s`,
          } as React.CSSProperties
        }
      >
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Okno z pełną treścią opinii
 * ------------------------------------------------------------------ */

function ReviewDialog({
  review,
  onClose,
}: {
  review: Review | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!review) return;
    last.current = document.activeElement as HTMLElement;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const t = window.setTimeout(
      () => panel.current?.querySelector<HTMLElement>("button")?.focus(),
      40,
    );

    return () => {
      body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      last.current?.focus?.();
    };
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Zamknij opinię"
        onClick={onClose}
        tabIndex={-1}
        className="bg-ink/70 absolute inset-0 cursor-default backdrop-blur-[3px]"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        className="relative flex max-h-[88svh] w-full flex-col overflow-hidden rounded-t-[10px] bg-white sm:max-w-[34rem] sm:rounded-[3px]"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-7 sm:px-8">
          <div>
            <Stars size={14} />
            <p
              id="review-dialog-title"
              className="t-head text-ink mt-3 text-[1.15rem]"
            >
              {review.name}
            </p>
            <p className="text-ink/40 mt-1.5 flex items-center gap-1.5 text-[11.5px]">
              <GoogleG size={11} />
              {review.meta} · Opinia w Google
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="text-ink/45 hover:text-ink -mt-1 shrink-0 rounded-[2px] p-2 transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M1 1l16 16M17 1L1 17"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <blockquote className="t-quote text-ink/80 text-[16.5px]">
            „{review.text}”
          </blockquote>
        </div>

        <div className="hairline border-t px-6 py-4 sm:px-8">
          <a
            href={site.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label text-ink/55 hover:text-ink inline-flex items-center gap-2 transition-colors duration-200"
          >
            <GoogleG size={13} />
            Zobacz w Google ↗
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Sekcja
 * ------------------------------------------------------------------ */

export function Reviews() {
  const [open, setOpen] = useState<Review | null>(null);
  const onOpen = useCallback((r: Review) => setOpen(r), []);
  const onClose = useCallback(() => setOpen(null), []);

  /**
   * Gdyby któryś z gotowych rzędów był pusty (np. po zmianie id w danych),
   * dzielimy po prostu wszystkie prawdziwe opinie na pół — sekcja nigdy
   * nie zostaje bez treści i nie wywala strony.
   */
  const half = Math.ceil(allReviews.length / 2);
  const rowA = marqueeRowA.length > 0 ? marqueeRowA : allReviews.slice(0, half);
  const rowB = marqueeRowB.length > 0 ? marqueeRowB : allReviews.slice(half);

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    gsap.from(self.querySelectorAll("[data-rev='head'] > span"), {
      yPercent: 108,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: self, start: "top 78%" },
    });
    gsap.from(self.querySelector("[data-rev='summary']"), {
      y: 22,
      opacity: 0,
      duration: 0.7,
      ease: EASE,
      scrollTrigger: { trigger: self, start: "top 72%" },
    });
    gsap.from(self.querySelectorAll("[data-rev='row']"), {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: { trigger: self, start: "top 62%" },
    });
  }, []);

  return (
    <section
      ref={scope}
      id="opinie"
      className="scroll-mt-20 py-16 md:py-24 lg:py-28"
    >
      <div className="mx-[var(--edge)] grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7 [container-type:inline-size]">
          <p className="t-label text-signal">Opinie Google</p>
          <h2
            data-rev="head"
            className="t-display mt-5 text-[clamp(2.05rem,12cqw,4.2rem)]"
          >
            <span className="mask">
              <span>Co mówią</span>
            </span>
            <span className="mask">
              <span>nasi uczniowie?</span>
            </span>
          </h2>
        </div>

        <div
          data-rev="summary"
          className="on-ink bg-ink flex flex-col gap-5 rounded-[3px] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:col-span-5 lg:flex-col lg:items-stretch lg:p-7"
        >
          <div>
            <div className="flex items-center gap-2">
              <GoogleG size={17} />
              <span className="t-label text-white/45">Opinie w Google</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="t-display t-num text-[clamp(2.6rem,9vw,3.4rem)]">
                {googleRating.value}
              </span>
              <Stars size={15} />
            </div>
            <p className="mt-3 text-[13.5px] text-white/55">
              {googleRating.count} opinii, wszystkie na pięć gwiazdek.
            </p>
          </div>

          <ButtonLink
            href={site.googleReviews}
            external
            variant="outline"
            tone="ink"
            arrow={false}
            className="w-full shrink-0 whitespace-nowrap sm:w-auto lg:w-full"
          >
            Zobacz opinie w Google ↗
          </ButtonLink>
        </div>
      </div>

      {/* pełnoszerokie, przeciwbieżne pasy opinii */}
      <div className="mt-8 flex flex-col gap-3 sm:gap-4 md:mt-14">
        <div data-rev="row">
          <MarqueeRow items={rowA} travel="ltr" offset={0} onOpen={onOpen} />
        </div>
        <div data-rev="row">
          <MarqueeRow items={rowB} travel="rtl" offset={1} onOpen={onOpen} />
        </div>
      </div>

      <p className="text-ink/40 mx-[var(--edge)] mt-6 max-w-[62ch] text-[12.5px] leading-relaxed md:mt-8">
        Wszystkie opinie pochodzą z profilu Google szkoły i są cytowane
        dosłownie. Opisują indywidualne doświadczenia uczniów.
      </p>

      <ReviewDialog review={open} onClose={onClose} />
    </section>
  );
}

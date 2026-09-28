"use client";

import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { journeyCopy as copy, journeySteps } from "@/lib/progress";

/** Czas „przejazdu” czerwonej linii przez wszystkie etapy. */
const LINE_DURATION = 1.3;

function Arrow() {
  return (
    <svg
      viewBox="0 0 22 12"
      aria-hidden="true"
      className="text-signal h-[0.5em] w-[0.95em] shrink-0"
      fill="none"
    >
      <path
        d="M0 6h19M14 1.5 19 6l-5 4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function LevelProgress() {
  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;

    const trigger = { trigger: self, start: "top 88%" };

    gsap.fromTo(
      self.querySelectorAll("[data-journey='intro']"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: EASE, stagger: 0.08, scrollTrigger: trigger },
    );

    gsap.fromTo(
      self.querySelector("[data-journey='line']"),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: LINE_DURATION,
        ease: "power2.inOut",
        delay: 0.15,
        scrollTrigger: trigger,
      },
    );

    // Węzły i etapy zapalają się mniej więcej wtedy, gdy dociera do nich linia.
    self.querySelectorAll<HTMLElement>("[data-journey='step']").forEach((step, i) => {
      const at = 0.15 + (i / journeySteps.length) * LINE_DURATION * 0.85;
      gsap.fromTo(
        step.querySelector("[data-journey='node']"),
        { scale: 0 },
        { scale: 1, duration: 0.35, ease: "back.out(2.4)", delay: at, scrollTrigger: trigger },
      );
      gsap.fromTo(
        step.querySelector("[data-journey='text']"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: EASE, delay: at + 0.08, scrollTrigger: trigger },
      );
    });
  }, []);

  return (
    <section
      ref={scope}
      id="progres"
      aria-labelledby="journey-title"
      className="on-ink bg-ink relative text-white"
    >
      <div className="mx-[var(--edge)] grid grid-cols-1 gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] lg:items-center lg:gap-14">
        {/* ---------------- opis ---------------- */}
        <div>
          <h2
            id="journey-title"
            data-journey="intro"
            className="t-label text-gold"
          >
            {copy.eyebrow}
          </h2>
          <p
            data-journey="intro"
            className="mt-2 text-[15px] leading-snug font-medium text-white/70 md:text-[16px]"
          >
            {copy.lead}
          </p>
        </div>

        {/* ---------------- etapy ---------------- */}
        <ol className="relative grid grid-cols-3 gap-4 sm:gap-8">
          {/* linia bazowa + czerwona linia postępu */}
          <span
            aria-hidden="true"
            className="absolute top-[5px] right-0 left-0 h-px bg-white/15"
          />
          <span
            aria-hidden="true"
            data-journey="line"
            className="bg-signal absolute top-[4.5px] right-0 left-0 h-[2px] origin-left"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 8 12"
            className="text-signal absolute -top-[0.5px] right-[-2px] h-3 w-2"
            fill="none"
          >
            <path d="M1.5 1.5 6 6l-4.5 4.5" stroke="currentColor" strokeWidth="2" />
          </svg>

          {journeySteps.map((s) => (
            <li
              key={`${s.from}-${s.to}`}
              data-journey="step"
              className="relative min-w-0 pt-7"
            >
              <span
                aria-hidden="true"
                data-journey="node"
                className="border-signal bg-ink absolute top-0 left-0 h-[11px] w-[11px] rounded-full border-2"
              />
              <div data-journey="text">
                <p className="t-num flex items-center gap-[0.35em] text-[17px] leading-none font-bold tracking-[-0.02em] whitespace-nowrap sm:text-[20px] lg:text-[22px]">
                  {s.from}
                  <span className="sr-only"> do </span>
                  <Arrow />
                  {s.to}
                </p>
                <p className="mt-2 text-[12.5px] leading-snug text-white/60 sm:text-[14px]">
                  {s.label}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

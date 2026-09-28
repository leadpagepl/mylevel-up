"use client";

import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { pricing } from "@/lib/site";
import { useBooking } from "./booking/BookingContext";

export function Pricing() {
  const { openBooking } = useBooking();

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    gsap.from(self.querySelectorAll("[data-price='head'] > span"), {
      yPercent: 108,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: self, start: "top 74%" },
    });
    gsap.from(self.querySelectorAll("[data-price='card']"), {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: { trigger: self, start: "top 62%" },
    });
  }, []);

  return (
    <section
      ref={scope}
      id="cennik"
      className="scroll-mt-20 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-[var(--edge)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 [container-type:inline-size]">
            <p className="t-label text-signal">Cennik</p>
            <h2
              data-price="head"
              className="t-display mt-5 text-[clamp(2.05rem,12cqw,4.4rem)]"
            >
              <span className="mask">
                <span>Ile kosztują</span>
              </span>
              <span className="mask">
                <span>lekcje?</span>
              </span>
            </h2>
          </div>
          <p className="t-body text-ink/60 max-w-[34ch] text-[15.5px] md:col-span-5 md:justify-self-end md:text-right">
            Zajęcia odbywają się online. Materiały do nauki są w cenie, więc nie
            musisz kupować podręcznika.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {pricing.map((p) => {
            const dark = p.accent;
            return (
              <article
                key={p.id}
                data-price="card"
                className={`group flex flex-col rounded-[3px] p-6 transition-transform duration-400 ease-out md:p-8 hover:md:-translate-y-1.5 ${
                  dark
                    ? "on-ink bg-ink text-white"
                    : "border-ink/12 border bg-white"
                }`}
              >
                <p
                  className={`t-label ${dark ? "text-gold" : "text-ink/40"}`}
                >
                  {p.label}
                </p>

                <div className="mt-6 flex items-baseline gap-2 md:mt-8">
                  <span
                    className={`t-display t-num text-[clamp(3rem,9vw,4.2rem)] ${
                      dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span
                    className={`t-head text-[1.5rem] normal-case ${
                      dark ? "text-white/70" : "text-ink/55"
                    }`}
                  >
                    {p.unit}
                  </span>
                </div>
                <p
                  className={`t-label mt-2 ${
                    dark ? "text-white/45" : "text-ink/40"
                  }`}
                >
                  {p.per}
                </p>

                <div
                  className={`mt-6 h-px w-full ${
                    dark ? "bg-white/15" : "bg-ink/10"
                  }`}
                />

                <p
                  className={`t-body mt-6 text-[15px] ${
                    dark ? "text-white/70" : "text-ink/65"
                  }`}
                >
                  {p.blurb}
                </p>

                <ul className="mt-5 mb-8 flex flex-col gap-2">
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-2.5 text-[13.5px] ${
                        dark ? "text-white/60" : "text-ink/55"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="bg-gold mt-[6px] h-[6px] w-[6px] shrink-0 rotate-45"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openBooking({ lessonType: p.id })}
                  className={`t-label mt-auto w-full rounded-[2px] py-4 transition-colors duration-300 ${
                    dark
                      ? "bg-signal hover:bg-white hover:text-ink text-white"
                      : "border-ink/25 text-ink hover:bg-ink border hover:border-transparent hover:text-white"
                  }`}
                >
                  Umów te zajęcia
                </button>
              </article>
            );
          })}
        </div>

        <p className="text-ink/40 mt-10 max-w-[62ch] text-[12.5px] leading-relaxed">
          Ceny dotyczą zajęć online. Długość zajęć w mini-grupach, terminy
          i częstotliwość ustalamy przed pierwszą lekcją.
        </p>
      </div>
    </section>
  );
}

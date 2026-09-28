"use client";

import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { Button } from "./ui/Button";
import { useBooking } from "./booking/BookingContext";

const STEPS = [
  {
    n: "01",
    title: "Powiedz, czego potrzebujesz",
    copy: "Wypełnij krótki formularz. Napisz, jaki masz cel, poziom i kiedy możesz się uczyć.",
  },
  {
    n: "02",
    title: "Wybierz rodzaj zajęć",
    copy: "Indywidualnie albo w mini-grupie. Ceny znajdziesz w cenniku powyżej.",
  },
  {
    n: "03",
    title: "Umów termin",
    copy: "Odzywamy się, ustalamy termin pierwszej lekcji i zaczynamy.",
  },
];

export function HowToStart() {
  const { openBooking } = useBooking();

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    gsap.from(self.querySelectorAll("[data-step='item']"), {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      stagger: 0.12,
      scrollTrigger: { trigger: self, start: "top 76%" },
    });
    gsap.from(self.querySelector("[data-step='line']"), {
      scaleX: 0,
      duration: 1.1,
      ease: "power2.inOut",
      scrollTrigger: { trigger: self, start: "top 76%" },
    });
  }, []);

  return (
    <section ref={scope} className="pb-6 md:pb-10 lg:pb-12">
      <div className="mx-[var(--edge)]">
        <div className="border-ink/12 flex flex-col gap-6 border-t pt-10 md:flex-row md:items-end md:justify-between md:pt-14">
          <h2 className="t-display text-[clamp(1.8rem,5vw,3rem)]">
            Jak zacząć?
          </h2>
          <Button onClick={() => openBooking()} variant="outline">
            Umów pierwszą lekcję
          </Button>
        </div>

        <div className="relative mt-10 md:mt-14">
          <div
            data-step="line"
            aria-hidden="true"
            className="bg-ink/12 absolute top-[10px] right-0 left-0 hidden h-px origin-left md:block"
          />
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            {STEPS.map((s) => (
              <li key={s.n} data-step="item" className="relative md:pt-0">
                <span
                  aria-hidden="true"
                  className="bg-signal absolute top-[5px] left-0 hidden h-[11px] w-[11px] rotate-45 md:block"
                />
                <div className="md:pt-10">
                  <p className="t-label text-signal md:hidden">{s.n}</p>
                  <p className="t-label text-ink/35 hidden md:block">{s.n}</p>
                  <h3 className="t-head mt-3 text-[clamp(1.05rem,3.4vw,1.35rem)]">
                    {s.title}
                  </h3>
                  <p className="t-body text-ink/60 mt-3 max-w-[32ch] text-[15px]">
                    {s.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

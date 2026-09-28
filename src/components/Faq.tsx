"use client";

import { useState } from "react";
import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { faq } from "@/lib/faq";
import { site } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    gsap.from(self.querySelectorAll("[data-faq='item']"), {
      y: 18,
      opacity: 0,
      duration: 0.55,
      ease: EASE,
      stagger: 0.05,
      scrollTrigger: { trigger: self, start: "top 76%" },
    });
  }, []);

  return (
    <section
      ref={scope}
      id="faq"
      className="scroll-mt-20 pb-20 md:pb-28 lg:pb-32"
    >
      <div className="mx-[var(--edge)] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 [container-type:inline-size]">
            <p className="t-label text-signal">FAQ</p>
            <h2 className="t-display mt-5 text-[clamp(2.05rem,13cqw,4rem)]">
              Masz
              <br />
              pytania?
            </h2>
            <p className="t-body text-ink/60 mt-6 max-w-[30ch] text-[15.5px]">
              Nie ma tu Twojego pytania? Zadzwoń pod{" "}
              <a
                href={site.phoneHref}
                className="text-ink underline underline-offset-4"
              >
                {site.phone}
              </a>{" "}
              albo napisz.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-ink/12 border-t">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  data-faq="item"
                  className="border-ink/12 border-b"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left md:py-6"
                    >
                      <span
                        className={`pr-2 text-[clamp(1rem,3.2vw,1.2rem)] leading-snug font-semibold tracking-[-0.015em] transition-colors duration-300 ${
                          isOpen ? "text-ink" : "text-ink/70 group-hover:text-ink"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative mt-[6px] block h-[13px] w-[13px] shrink-0 transition-transform duration-400 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span
                          className={`absolute top-[6px] left-0 h-[1.5px] w-full transition-colors duration-300 ${
                            isOpen ? "bg-signal" : "bg-ink/45"
                          }`}
                        />
                        <span
                          className={`absolute top-0 left-[6px] h-full w-[1.5px] transition-colors duration-300 ${
                            isOpen ? "bg-signal" : "bg-ink/45"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    className="acc-panel"
                    data-open={isOpen}
                    role="region"
                  >
                    <div>
                      <p className="t-body text-ink/65 max-w-[58ch] pb-6 text-[15px] md:text-[16px]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

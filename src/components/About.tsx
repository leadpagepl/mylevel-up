"use client";

import Image from "next/image";
import { EASE, ScrollTrigger, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { credentials, site } from "@/lib/site";
import { PullQuote } from "./ui/PullQuote";

export function About() {
  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;

    gsap.from(self.querySelectorAll("[data-about='line'] > span"), {
      yPercent: 108,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: self, start: "top 74%" },
    });

    gsap.from(self.querySelectorAll("[data-about='intro']"), {
      y: 18,
      opacity: 0,
      duration: 0.65,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: self, start: "top 68%" },
    });

    gsap.from(self.querySelectorAll("[data-about='cred']"), {
      y: 14,
      opacity: 0,
      duration: 0.55,
      ease: EASE,
      stagger: 0.05,
      scrollTrigger: {
        trigger: self.querySelector("[data-about='creds']"),
        start: "top 86%",
      },
    });

    const frame = self.querySelector("[data-about='frame']");
    const photo = self.querySelector("[data-about='photo']");

    if (frame) {
      gsap.fromTo(
        frame,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.05,
          ease: "power3.inOut",
          scrollTrigger: { trigger: frame, start: "top 82%" },
        },
      );

      if (photo) {
        gsap.fromTo(
          photo,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }
    }

    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={scope}
      id="nauczyciel"
      className="scroll-mt-20 py-20 md:py-24 lg:py-28"
    >
      <div className="mx-[var(--edge)] grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* ---------------- portret ---------------- */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[370px] lg:mx-0 lg:max-w-[420px]">
            <div
              aria-hidden="true"
              className="bg-signal absolute top-8 bottom-8 -left-2 z-[2] w-[8px] md:-left-4 md:w-[11px]"
            />
            <div
              aria-hidden="true"
              className="bg-ink absolute top-7 -right-5 bottom-[-20px] left-12 hidden md:block"
            />
            <div
              data-about="frame"
              className="relative z-[1] aspect-[3/4] overflow-hidden rounded-[3px] bg-[#EEF1F5]"
            >
              <Image
                data-about="photo"
                src="/img/marek-portret.png"
                alt={`${site.teacher}, nauczyciel angielskiego w Level Up`}
                fill
                quality={92}
                sizes="(max-width: 1023px) 370px, 420px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* ---------------- treść ---------------- */}
        <div className="lg:col-span-7 [container-type:inline-size]">
          <p className="t-label text-signal">Poznaj swojego nauczyciela</p>

          <h2 className="t-display mt-5 text-[clamp(1.85rem,8.4cqw,3.3rem)]">
            <span data-about="line" className="mask">
              <span>Angielski,</span>
            </span>
            <span data-about="line" className="mask">
              <span>który zrozumiesz.</span>
            </span>
          </h2>

          <p
            data-about="intro"
            className="text-ink mt-7 text-[clamp(1.05rem,3.2vw,1.25rem)] font-semibold tracking-[-0.015em]"
          >
            Poznaj Marka.
          </p>

          <p
            data-about="intro"
            className="t-body text-ink/70 mt-4 max-w-[46ch] text-[16px] md:text-[17.5px]"
          >
            Level Up to szkoła językowa z Częstochowy, w której{" "}
            {site.teacherFirstName} prowadzi lekcje angielskiego online:
            indywidualnie i w mini-grupach. Na zajęciach stawiamy na jasne
            wyjaśnienia, praktyczne ćwiczenia i swobodną rozmowę.
          </p>

          <div
            data-about="creds"
            className="border-ink/12 mt-9 grid grid-cols-1 border-t sm:grid-cols-2"
          >
            {credentials.map((c) => (
              <div
                key={c}
                data-about="cred"
                className="border-ink/12 flex items-start gap-3 border-b py-3.5 pr-6"
              >
                <span
                  aria-hidden="true"
                  className="bg-gold mt-[7px] h-[6px] w-[6px] shrink-0 rotate-45"
                />
                <span className="text-ink/75 text-[14.5px] leading-snug">
                  {c}
                </span>
              </div>
            ))}
          </div>

          <PullQuote id="monika-dzy" className="mt-8 max-w-[52ch]" />
        </div>
      </div>
    </section>
  );
}

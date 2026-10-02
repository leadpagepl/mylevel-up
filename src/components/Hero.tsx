"use client";

import Image from "next/image";
import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { onIntroReveal } from "@/lib/intro";
import { googleRating, site } from "@/lib/site";
import { Button, ButtonLink } from "./ui/Button";
import { GoogleG, Stars } from "./ui/Stars";
import { useBooking } from "./booking/BookingContext";

const HERO_IMG = "/img/levelup-hero-language.png";
const HERO_ALT =
  "Biurko do nauki angielskiego: otwarty notatnik, laptop, podręczniki i półka z globusem";

export function Hero() {
  const { openBooking } = useBooking();

  const scope = useGsap<HTMLElement>(() => {
    if (reducedMotion()) return;

    // Stany początkowe ustawiają się od razu (fromTo), a sama animacja
    // startuje dopiero, gdy intro rozsuwa kurtynę — albo od razu, jeśli
    // intro nie gra (kolejna wizyta w tej karcie, reduced motion).
    const tl = gsap.timeline({ defaults: { ease: EASE }, paused: true });

    tl.fromTo(
      "[data-hero='photo']",
      { clipPath: "inset(0% 0% 0% 22%)", scale: 1.06 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.25,
        ease: "power3.inOut",
      },
      0,
    )
      .fromTo(
        "[data-hero='eyebrow']",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7 },
        0.15,
      )
      .fromTo(
        "[data-hero='line'] > span",
        { yPercent: 108 },
        { yPercent: 0, duration: 0.95, stagger: 0.09 },
        0.3,
      )
      .fromTo(
        "[data-hero='rule']",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power4.out" },
        0.8,
      )
      .fromTo(
        "[data-hero='copy'], [data-hero='cta'], [data-hero='trust']",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 },
        0.85,
      );

    return onIntroReveal(() => tl.play());
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      className="relative isolate overflow-hidden lg:min-h-[max(660px,88svh)]"
    >
      {/* ---------- zdjęcie: tło na desktopie ---------- */}
      <div
        data-hero="photo"
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
      >
        <Image
          src={HERO_IMG}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[68%_50%]"
        />
        {/* rozjaśnienie lewej strony — tylko tyle, żeby tekst był czytelny */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(247,248,250,0.97)_0%,rgba(247,248,250,0.93)_30%,rgba(247,248,250,0.55)_48%,rgba(247,248,250,0.08)_62%,transparent_74%)]" />
      </div>

      {/* czerwony akcent brandowy */}
      <div
        aria-hidden="true"
        className="bg-signal absolute top-0 bottom-0 left-0 z-[2] hidden w-[6px] lg:block"
      />

      <div className="relative z-[3] mx-[var(--edge)] flex min-h-full flex-col justify-center pt-[104px] pb-10 md:pt-[132px] lg:py-[132px]">
        <div className="lg:max-w-[52%] [container-type:inline-size]">
          <p className="mask">
            <span data-hero="eyebrow" className="t-label text-signal">
              Angielski online · {site.city}
            </span>
          </p>

          <h1 className="t-display mt-5 text-[clamp(2.05rem,10.4cqw,5.2rem)] md:mt-7">
            <span data-hero="line" className="mask">
              <span>Zacznij</span>
            </span>
            <span data-hero="line" className="mask">
              <span>mówić</span>
            </span>
            <span data-hero="line" className="mask">
              <span className="text-signal">po angielsku.</span>
            </span>
          </h1>

          <div
            data-hero="rule"
            className="rule-red mt-7 w-[92px] md:mt-9 md:w-[128px]"
          />

          <p
            data-hero="copy"
            className="t-body text-ink/75 mt-7 max-w-[34ch] text-[17px] md:mt-9 md:text-[19px]"
          >
            Lekcje online dopasowane do Twojego poziomu. Indywidualnie lub
            w małej grupie.
          </p>

          <div
            data-hero="cta"
            className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10"
          >
            <Button onClick={() => openBooking()}>Umów pierwszą lekcję</Button>
            <ButtonLink
              href="#cennik"
              variant="outline"
              arrow={false}
              className="bg-white/70 backdrop-blur-sm"
            >
              Zobacz cennik
            </ButtonLink>
          </div>

          <a
            data-hero="trust"
            href={site.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="border-ink/12 hover:border-ink/35 mt-8 inline-flex items-center gap-3 rounded-[2px] border bg-white px-4 py-3 transition-colors duration-300 md:mt-10"
          >
            <GoogleG size={17} />
            <Stars size={13} />
            <span className="t-num text-ink text-[13px] font-semibold">
              {googleRating.value}
            </span>
            <span className="text-ink/50 text-[13px]">
              {googleRating.count} opinii w Google
            </span>
          </a>
        </div>
      </div>

      {/* ---------- zdjęcie: osobny kadr na mobile ---------- */}
      <div className="relative z-[1] mt-2 lg:hidden">
        <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[2/1]">
          <Image
            src={HERO_IMG}
            alt={HERO_ALT}
            fill
            priority
            // Ta sama jakość co w kadrze desktopowym: identyczny srcset, więc
            // przeglądarka pobiera zdjęcie hero raz, a nie dwa razy.
            quality={85}
            sizes="100vw"
            className="object-cover object-[58%_62%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="bg-signal absolute bottom-0 left-0 h-[6px] w-[38%]"
        />
      </div>
    </section>
  );
}

"use client";

import { EASE, gsap, reducedMotion, useGsap } from "@/lib/anim";
import { googleRating, site } from "@/lib/site";
import { GoogleG, Stars } from "./ui/Stars";
import { Button } from "./ui/Button";
import { useBooking } from "./booking/BookingContext";

/* ------------------------------------------------------------------ *
 *  Ikony — liniowe, w kolorze tekstu, spójne z resztą interfejsu
 * ------------------------------------------------------------------ */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.35" cy="6.65" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
      fill="currentColor"
    >
      <path d="M13.6 21.5v-7.7h2.6l.4-3.05h-3V8.8c0-.88.25-1.48 1.52-1.48h1.6V4.6a21.6 21.6 0 0 0-2.35-.12c-2.33 0-3.92 1.42-3.92 4.03v2.24H7.8v3.05h2.65v7.7h3.15Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[16px] w-[16px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@levelupszkolajezykowa",
    href: site.instagram,
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    handle: "Level Up Szkoła Językowa",
    href: site.facebook,
    Icon: FacebookIcon,
  },
];

export function FinalCta() {
  const { openBooking } = useBooking();

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    // fromTo z jawnym stanem końcowym: `from` odczytuje bieżącą wartość
    // jako cel, co przy podwójnym montażu w dev dawało elementy z opacity 0.
    gsap.fromTo(
      self.querySelectorAll("[data-cta='line'] > span"),
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 0.95,
        ease: EASE,
        stagger: 0.09,
        scrollTrigger: { trigger: self, start: "top 76%" },
      },
    );
    gsap.fromTo(
      self.querySelectorAll("[data-cta='item']"),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: { trigger: self, start: "top 62%" },
      },
    );
  }, []);

  const { address } = site;

  return (
    <section
      ref={scope}
      id="kontakt"
      className="on-ink bg-ink relative scroll-mt-20 overflow-hidden py-16 text-white md:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="bg-signal absolute top-0 right-0 hidden h-full w-[14px] md:block"
      />

      <div className="mx-[var(--edge)] grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        {/* ---------------- lewa kolumna: zaproszenie ---------------- */}
        <div className="lg:col-span-6 [container-type:inline-size]">
          <p className="t-label text-gold">Umów pierwszą lekcję</p>
          <h2 className="t-display mt-5 text-[clamp(2.15rem,11cqw,4.8rem)]">
            <span data-cta="line" className="mask">
              <span>Gotowy na</span>
            </span>
            <span data-cta="line" className="mask">
              <span className="text-signal">lepszy</span>
            </span>
            <span data-cta="line" className="mask">
              <span className="text-signal">angielski?</span>
            </span>
          </h2>
          <p
            data-cta="item"
            className="t-body mt-6 max-w-[34ch] text-[16.5px] text-white/70 md:mt-7 md:text-[19px]"
          >
            Napisz, czego potrzebujesz. Ustalimy, od czego zacząć.
          </p>
          <div data-cta="item" className="mt-8 md:mt-9">
            <Button
              onClick={() => openBooking()}
              className="w-full sm:w-auto"
            >
              Umów pierwszą lekcję
            </Button>
          </div>

          <a
            data-cta="item"
            href={site.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 block border-t border-white/15 pt-6 md:mt-9"
          >
            {/* hover na wewnętrznym elemencie — sam link animuje GSAP */}
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 transition-opacity duration-300 group-hover:opacity-80">
              <GoogleG size={17} />
              <Stars size={13} />
              <span className="t-num text-[13px] font-semibold text-white">
                {googleRating.value}
              </span>
              <span className="text-[13px] text-white/45">
                {googleRating.count} opinii w Google
              </span>
            </span>
          </a>
        </div>

        {/* ---------------- prawa kolumna: kontakt ---------------- */}
        <div className="flex flex-col lg:col-span-6">
          {/* telefon + e-mail */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            <div data-cta="item" className="border-t border-white/15 pt-5">
              <p className="t-label text-white/40">Telefon</p>
              <a
                href={site.phoneHref}
                className="t-head hover:text-gold mt-3 block text-[clamp(1.6rem,6.2vw,2.1rem)] whitespace-nowrap transition-colors duration-300"
              >
                {site.phone}
              </a>
            </div>
            <div data-cta="item" className="border-t border-white/15 pt-5">
              <p className="t-label text-white/40">E-mail</p>
              <a
                href={site.emailHref}
                className="hover:text-gold mt-3 block text-[16px] break-all transition-colors duration-300 sm:mt-[18px] md:text-[17px]"
              >
                {site.email}
              </a>
            </div>
          </div>

          {/* social media */}
          <div data-cta="item" className="mt-8">
            <p className="t-label text-white/40">Social media</p>
            <ul className="mt-3 grid grid-cols-2 gap-2.5">
              {SOCIALS.map(({ label, handle, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${handle} (otwiera się w nowej karcie)`}
                    className="group flex min-h-[52px] items-center gap-3 rounded-[2px] border border-white/18 px-4 py-3 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
                  >
                    <span className="text-gold group-hover:text-ink transition-colors duration-300">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="t-label block">{label}</span>
                      <span className="mt-1 hidden truncate text-[12px] text-white/50 transition-colors duration-300 group-hover:text-ink/60 sm:block">
                        {handle}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* mapa */}
          <div data-cta="item" className="mt-8">
            <div className="flex items-start gap-2.5">
              <span className="text-gold mt-[2px]">
                <PinIcon />
              </span>
              <address className="text-[14.5px] leading-snug text-white/85 not-italic">
                {address.street}
                <br className="sm:hidden" />
                <span className="hidden sm:inline">, </span>
                {address.postalCode} {address.city}
              </address>
            </div>

            <div className="mt-4 overflow-hidden rounded-[3px] border border-white/15 bg-[#e9ecf1]">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                <iframe
                  src={site.mapEmbed}
                  title={`Mapa: ${address.street}, ${address.postalCode} ${address.city}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] transition-[filter] duration-500 hover:grayscale-0"
                />
              </div>
            </div>

            <p className="mt-3 max-w-[52ch] text-[12.5px] leading-relaxed text-white/40">
              Zajęcia odbywają się online. Jeśli wolisz spotkania na miejscu
              w {site.cityIn}, zapytaj o to w zgłoszeniu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

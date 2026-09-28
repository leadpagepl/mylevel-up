import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink bg-ink-deep py-12 text-white md:py-16">
      <div className="mx-[var(--edge)]">
        <div className="flex flex-col gap-8 border-b border-white/12 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex rounded-[3px] bg-white px-4 py-3">
              <Image
                src="/img/logo-level-up.png"
                alt="Level Up Szkoła Językowa"
                width={590}
                height={675}
                className="h-[44px] w-auto"
              />
            </span>
            <p className="mt-5 max-w-[34ch] text-[13.5px] leading-relaxed text-white/45">
              {site.legalName}, {site.city}. Angielski online dla młodzieży
              i dorosłych.
            </p>
          </div>

          <nav
            aria-label="Stopka"
            className="grid grid-cols-2 gap-x-10 gap-y-3 sm:gap-x-16"
          >
            <a
              href="#nauczyciel"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              Nauczyciel
            </a>
            <a
              href="#cennik"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              Cennik
            </a>
            <a
              href="#opinie"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              Opinie
            </a>
            <a
              href="#faq"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              FAQ
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              Instagram
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label hover:text-gold text-white/55 transition-colors duration-200"
            >
              Facebook
            </a>
          </nav>

          <div className="text-[14px]">
            <a
              href={site.phoneHref}
              className="t-head hover:text-gold block text-[1.35rem] transition-colors duration-200"
            >
              {site.phone}
            </a>
            <a
              href={site.emailHref}
              className="hover:text-gold mt-2 block break-words text-white/55 transition-colors duration-200"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[12.5px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/polityka-prywatnosci"
              className="hover:text-white/70 transition-colors duration-200"
            >
              Polityka prywatności
            </Link>
            <p>
              Strona wykonana przez{" "}
              <a
                href={site.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 underline underline-offset-2 transition-colors duration-200 hover:text-white"
              >
                {site.author.name}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

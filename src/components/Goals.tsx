"use client";

import { useRef, useState } from "react";
import { EASE, gsap, reducedMotion, useGsap, useIsoLayoutEffect } from "@/lib/anim";
import { exams } from "@/lib/site";
import { Button } from "./ui/Button";
import { PullQuote } from "./ui/PullQuote";
import { useBooking } from "./booking/BookingContext";

type Goal = {
  id: string;
  label: string;
  lead: string;
  points: readonly string[];
  pointsLabel: string;
  reviewId: string;
  cta: string;
  note?: string;
};

const GOALS: Goal[] = [
  {
    id: "konwersacje",
    label: "Chcę swobodnie rozmawiać",
    lead: "Dużo rozmawiamy i ćwiczymy na przykładach z życia. Na bieżąco poprawiamy błędy i wyjaśniamy gramatykę.",
    pointsLabel: "Na czym pracujemy",
    points: [
      "Mówienie od pierwszej lekcji",
      "Gramatyka wytłumaczona po ludzku",
      "Słownictwo pod Twoje sytuacje",
      "Poziomy od A1 do C2",
    ],
    reviewId: "katarzyna-muchorska",
    cta: "Umów lekcję konwersacyjną",
  },
  {
    id: "egzamin",
    label: "Przygotowuję się do egzaminu",
    lead: "Ćwiczymy na zadaniach z Twojego egzaminu. Uczysz się, jak je rozwiązywać, powtarzasz to, czego brakuje, i regularnie sprawdzasz postępy.",
    pointsLabel: "Przygotowanie do egzaminów",
    points: exams,
    reviewId: "agata-grzesiak",
    cta: "Umów przygotowanie do egzaminu",
    note: "Opinie opisują doświadczenia konkretnych uczniów. Wynik egzaminu zależy też od Twojej pracy.",
  },
  {
    id: "biznes",
    label: "Potrzebuję angielskiego w pracy",
    lead: "Uczysz się angielskiego, którego używasz w pracy: na spotkaniach, w mailach, prezentacjach i rozmowach z klientem. Zajęcia prowadzi korporacyjny trener Business English z certyfikatem LCCI.",
    pointsLabel: "Typowe tematy",
    points: [
      "Spotkania i rozmowy online",
      "Maile i dokumenty",
      "Prezentacje",
      "Rozmowy z klientem",
    ],
    reviewId: "agnieszka-koczot",
    cta: "Umów Business English",
  },
];

export function Goals() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const scope = useGsap<HTMLElement>(({ self }) => {
    if (reducedMotion()) return;
    gsap.from(self.querySelectorAll("[data-goals='head'] > span"), {
      yPercent: 108,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: self, start: "top 74%" },
    });
    gsap.from(self.querySelectorAll("[data-goals='option']"), {
      x: -18,
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: self, start: "top 68%" },
    });
  }, []);

  useIsoLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!panelRef.current || reducedMotion()) return;
    const targets = panelRef.current.querySelectorAll("[data-panel-item]");
    const tween = gsap.fromTo(
      targets,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: EASE, stagger: 0.06 },
    );
    return () => {
      tween.kill();
    };
  }, [active]);

  const goal = GOALS[active];

  return (
    <section
      ref={scope}
      id="cele"
      className="on-ink bg-ink scroll-mt-20 py-20 text-white md:py-28 lg:py-32"
    >
      <div className="mx-[var(--edge)]">
        <div className="max-w-[34rem] [container-type:inline-size]">
          <p className="t-label text-gold">Wybierz swoją ścieżkę</p>
          <h2
            data-goals="head"
            className="t-display mt-5 text-[clamp(2.05rem,13.5cqw,4.4rem)]"
          >
            <span className="mask">
              <span>Po co Ci</span>
            </span>
            <span className="mask">
              <span>angielski?</span>
            </span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* wybór celu */}
          <div className="min-w-0 lg:col-span-5" role="tablist" aria-label="Cel nauki">
            {GOALS.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.id}
                  data-goals="option"
                  role="tab"
                  id={`goal-tab-${g.id}`}
                  aria-selected={on}
                  aria-controls="goal-panel"
                  onClick={() => setActive(i)}
                  // Dwie stałe kolumny: [numer + wskaźnik] | tytuł. Tytuł ma zawsze
                  // tę samą szerokość, więc łamanie linii nie zależy od zaznaczenia.
                  className={`group grid w-full grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3 border-b border-white/12 py-5 text-left transition-colors duration-300 md:grid-cols-[2.75rem_minmax(0,1fr)] md:gap-x-5 md:py-7 ${
                    on ? "text-white" : "text-white/55 hover:text-white/80"
                  }`}
                >
                  <span className="mt-[6px] flex flex-col items-start gap-2.5">
                    <span
                      className={`t-label transition-colors duration-300 ${
                        on ? "text-signal" : "text-white/25"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* wskaźnik mieści się w kolumnie numeru; animujemy tylko transform */}
                    <span
                      aria-hidden="true"
                      className={`bg-signal block h-[3px] w-full origin-left transition-[transform,opacity] duration-400 ease-out ${
                        on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                    />
                  </span>
                  <span className="t-head min-w-0 text-[clamp(1.15rem,4.2vw,1.85rem)] leading-[1.08] break-words">
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* panel */}
          <div
            ref={panelRef}
            id="goal-panel"
            role="tabpanel"
            aria-labelledby={`goal-tab-${goal.id}`}
            className="min-w-0 lg:col-span-7"
          >
            <p
              data-panel-item
              className="t-body max-w-[48ch] text-[17px] text-white/75 md:text-[19px]"
            >
              {goal.lead}
            </p>

            <div data-panel-item className="mt-8">
              <p className="t-label text-white/35">{goal.pointsLabel}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {goal.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-[2px] border border-white/18 px-3.5 py-2.5 text-[13.5px] text-white/80"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div data-panel-item className="mt-8">
              <PullQuote id={goal.reviewId} tone="ink" className="max-w-[52ch]" />
            </div>

            {goal.note ? (
              <p
                data-panel-item
                className="mt-4 max-w-[52ch] text-[12.5px] leading-relaxed text-white/35"
              >
                {goal.note}
              </p>
            ) : null}

            <div data-panel-item className="mt-8">
              <Button onClick={() => openBooking({ goal: goal.id })}>
                {goal.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

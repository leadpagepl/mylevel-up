"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, reducedMotion, useIsoLayoutEffect } from "@/lib/anim";
import { site } from "@/lib/site";
import { useBooking } from "./BookingContext";
import {
  GOALS,
  LESSON_TYPES,
  LEVELS,
  TIMES,
  labelOf,
  type Option,
} from "./options";

type Form = {
  goal: string;
  lessonType: string;
  level: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  website: string;
};

const EMPTY: Form = {
  goal: "",
  lessonType: "",
  level: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  website: "",
};

type Status = "idle" | "sending" | "done" | "error";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])';

function ChipGroup({
  legend,
  options,
  value,
  onChange,
  name,
  cols = "sm:grid-cols-2",
}: {
  legend: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  name: string;
  cols?: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="t-label text-ink/45 mb-3">{legend}</legend>
      <div className={`grid grid-cols-1 gap-2 ${cols}`}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-3 rounded-[2px] border px-4 py-3 text-[14px] leading-tight transition-colors duration-200 ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-ink hover:border-ink/45"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={active}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] shrink-0 rotate-45 transition-colors duration-200 ${
                  active ? "bg-gold" : "bg-ink/20"
                }`}
              />
              <span>{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="t-label text-ink/45 mb-2 block">
        {label}
      </label>
      {children}
      {error ? <p className="text-signal mt-2 text-[12.5px]">{error}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-[2px] border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-200 placeholder:text-ink/30 focus:border-ink";

export function BookingModal() {
  const { open, prefill, closeBooking } = useBooking();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const set = useCallback(<K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }, []);

  /* ---- otwarcie: prefill, blokada scrolla, focus ---- */
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    setStep(1);
    setStatus("idle");
    setErrors({});
    setForm({
      ...EMPTY,
      goal: prefill.goal ?? "",
      lessonType: prefill.lessonType ?? "",
    });

    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      lastFocused.current?.focus?.();
    };
  }, [open, prefill]);

  /* ---- Escape + pułapka na Tab ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeBooking();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const items = Array.from(nodes).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeBooking]);

  /* ---- wejście panelu ---- */
  useIsoLayoutEffect(() => {
    if (!open || !panelRef.current || !overlayRef.current) return;
    if (reducedMotion()) {
      gsap.set([overlayRef.current, panelRef.current], { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: 28, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      "-=0.16",
    );
    return () => {
      tl.kill();
    };
  }, [open]);

  /* ---- przejście między krokami ---- */
  useIsoLayoutEffect(() => {
    if (!open || !stepRef.current || reducedMotion()) return;
    const tween = gsap.fromTo(
      stepRef.current,
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.38, ease: "power3.out" },
    );
    return () => {
      tween.kill();
    };
  }, [step, status, open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [open, step]);

  if (!open) return null;

  const goNext = () => {
    const e: Record<string, string> = {};
    if (!form.goal) e.goal = "Wybierz, czego chcesz się uczyć.";
    if (!form.lessonType) e.lessonType = "Wybierz rodzaj zajęć.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(2);
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Podaj imię.";
    if (!/^[\d\s()+-]{9,20}$/.test(form.phone.trim()))
      e.phone = "Podaj numer telefonu.";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
      e.email = "Podaj poprawny adres e-mail.";
    if (!form.consent) e.consent = "Zaznacz zgodę, żebyśmy mogli się odezwać.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          consent: form.consent,
          website: form.website,
          goal: labelOf(GOALS, form.goal),
          lessonType: labelOf(LESSON_TYPES, form.lessonType),
          level: labelOf(LEVELS, form.level),
          time: labelOf(TIMES, form.time),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) {
          setErrors(data.errors as Record<string, string>);
          setStatus("idle");
          return;
        }
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Zamknij formularz"
        onClick={closeBooking}
        className="bg-ink/70 absolute inset-0 cursor-default backdrop-blur-[3px]"
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative flex max-h-[94svh] w-full flex-col overflow-hidden rounded-t-[10px] bg-white shadow-[0_30px_90px_-20px_rgba(16,36,63,0.55)] sm:max-h-[90svh] sm:max-w-[40rem] sm:rounded-[3px]"
      >
        <div className="bg-ink/10 absolute inset-x-0 top-0 h-[3px]">
          <div
            className="bg-signal h-full transition-[width] duration-500 ease-out"
            style={{
              width: status === "done" ? "100%" : step === 1 ? "50%" : "100%",
            }}
          />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pt-7 pb-4 sm:px-9 sm:pt-9">
          <div className="min-w-0">
            <p className="t-label text-signal">
              {status === "done"
                ? "Zgłoszenie wysłane"
                : `Krok ${step} z 2 · Umów pierwszą lekcję`}
            </p>
            <h2
              id="booking-title"
              className="t-head text-ink mt-3 text-[clamp(1.35rem,5vw,1.9rem)]"
            >
              {status === "done"
                ? "Dziękujemy za zgłoszenie."
                : step === 1
                  ? "Czego chcesz się nauczyć?"
                  : "Jak możemy się z Tobą skontaktować?"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Zamknij"
            className="text-ink/45 hover:border-ink hover:text-ink -mt-1 shrink-0 rounded-[2px] border border-transparent p-2 transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M1 1l16 16M17 1L1 17"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-9">
          <div ref={stepRef}>
            {status === "done" ? (
              <div className="py-2">
                <p className="t-body text-ink/70 max-w-md text-[16px]">
                  Skontaktujemy się z Tobą, aby ustalić szczegóły. Jeśli nie
                  chcesz czekać, zadzwoń albo napisz.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <a
                    href={site.phoneHref}
                    className="t-head hover:text-signal text-[clamp(1.4rem,6vw,1.9rem)] transition-colors duration-200"
                  >
                    {site.phone}
                  </a>
                  <a
                    href={site.emailHref}
                    className="text-ink/60 hover:text-signal text-[15px] transition-colors duration-200"
                  >
                    {site.email}
                  </a>
                </div>
              </div>
            ) : step === 1 ? (
              <div className="space-y-7">
                <div>
                  <ChipGroup
                    legend="Cel nauki"
                    name="goal"
                    options={GOALS}
                    value={form.goal}
                    onChange={(id) => set("goal", id)}
                  />
                  {errors.goal ? (
                    <p className="text-signal mt-2 text-[12.5px]">
                      {errors.goal}
                    </p>
                  ) : null}
                </div>
                <div>
                  <ChipGroup
                    legend="Rodzaj zajęć"
                    name="lessonType"
                    options={LESSON_TYPES}
                    value={form.lessonType}
                    onChange={(id) => set("lessonType", id)}
                    cols="sm:grid-cols-1"
                  />
                  {errors.lessonType ? (
                    <p className="text-signal mt-2 text-[12.5px]">
                      {errors.lessonType}
                    </p>
                  ) : null}
                </div>
                <ChipGroup
                  legend="Twój poziom teraz"
                  name="level"
                  options={LEVELS}
                  value={form.level}
                  onChange={(id) => set("level", id)}
                  cols="grid-cols-2 sm:grid-cols-3"
                />
                <ChipGroup
                  legend="Kiedy najchętniej się uczysz"
                  name="time"
                  options={TIMES}
                  value={form.time}
                  onChange={(id) => set("time", id)}
                  cols="grid-cols-2 sm:grid-cols-4"
                />
              </div>
            ) : (
              <form id="booking-form" onSubmit={submit} className="space-y-5">
                <div className="bg-paper text-ink/60 rounded-[2px] px-4 py-3 text-[13px]">
                  <span className="text-ink/40">Twój wybór: </span>
                  {[
                    labelOf(GOALS, form.goal),
                    labelOf(LESSON_TYPES, form.lessonType),
                    labelOf(LEVELS, form.level),
                    labelOf(TIMES, form.time),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>

                <Field id="name" label="Imię" error={errors.name}>
                  <input
                    id="name"
                    data-autofocus
                    className={inputCls}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="given-name"
                    placeholder="Jak się do Ciebie zwracać?"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="phone" label="Telefon" error={errors.phone}>
                    <input
                      id="phone"
                      className={inputCls}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="600 000 000"
                    />
                  </Field>
                  <Field id="email" label="E-mail" error={errors.email}>
                    <input
                      id="email"
                      className={inputCls}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      inputMode="email"
                      autoComplete="email"
                      placeholder="twoj@email.pl"
                    />
                  </Field>
                </div>

                <Field id="message" label="Wiadomość (opcjonalnie)">
                  <textarea
                    id="message"
                    rows={3}
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Np. termin egzaminu, dostępne godziny, czego potrzebujesz."
                  />
                </Field>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="accent-signal mt-[3px] h-4 w-4 shrink-0"
                  />
                  <span className="text-ink/60">
                    Zgadzam się na kontakt w sprawie tego zgłoszenia. Dane
                    wykorzystamy tylko do kontaktu z Tobą. Więcej w{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      className="text-ink underline underline-offset-2"
                      target="_blank"
                    >
                      polityce prywatności
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-signal text-[12.5px]">{errors.consent}</p>
                ) : null}

                {status === "error" ? (
                  <div className="border-signal/30 bg-signal/5 rounded-[2px] border px-4 py-3 text-[13.5px]">
                    <p className="text-ink font-semibold">
                      Nie udało się wysłać zgłoszenia.
                    </p>
                    <p className="text-ink/65 mt-1">
                      Zadzwoń pod{" "}
                      <a className="underline" href={site.phoneHref}>
                        {site.phone}
                      </a>{" "}
                      albo napisz na{" "}
                      <a className="underline" href={site.emailHref}>
                        {site.email}
                      </a>
                      .
                    </p>
                  </div>
                ) : null}
              </form>
            )}
          </div>
        </div>

        <div className="hairline flex items-center justify-between gap-3 border-t px-5 py-4 sm:px-9 sm:py-5">
          {status === "done" ? (
            <button
              type="button"
              onClick={closeBooking}
              className="bg-ink hover:bg-signal t-label ml-auto rounded-[2px] px-6 py-4 text-white transition-colors duration-300"
            >
              Zamknij
            </button>
          ) : step === 1 ? (
            <>
              <p className="text-ink/40 hidden text-[12.5px] sm:block">
                Zgłoszenie do niczego nie zobowiązuje. Szczegóły ustalimy w rozmowie.
              </p>
              <button
                type="button"
                onClick={goNext}
                className="bg-ink hover:bg-signal t-label ml-auto rounded-[2px] px-7 py-4 text-white transition-colors duration-300"
              >
                Dalej
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="t-label text-ink/50 hover:text-ink px-2 py-3 transition-colors duration-200"
              >
                ← Wstecz
              </button>
              <button
                type="submit"
                form="booking-form"
                disabled={status === "sending"}
                className="bg-signal hover:bg-signal-deep t-label rounded-[2px] px-7 py-4 text-white transition-colors duration-300 disabled:opacity-60"
              >
                {status === "sending" ? "Wysyłam…" : "Wyślij zgłoszenie"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

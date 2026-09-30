import { NextResponse, after } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  GOALS,
  LESSON_TYPES,
  LEVELS,
  TIMES,
  type Option,
} from "@/components/booking/options";
import { NOTIFY_SUBJECT, renderLeadEmail } from "./notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Zgłoszenie to kilkaset bajtów — większe body odrzucamy przed parsowaniem. */
const MAX_BODY_BYTES = 16 * 1024;
/** Apps Script bywa wolny przy zimnym starcie — dłużej nie trzymamy użytkownika. */
const GOOGLE_TIMEOUT_MS = 10_000;
const RESEND_TIMEOUT_MS = 6_000;
const TURNSTILE_TIMEOUT_MS = 5_000;

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Maksymalna długość tokenu wg dokumentacji Cloudflare. */
const TURNSTILE_TOKEN_MAX = 2048;
const TURNSTILE_ERROR = "Nie udało się potwierdzić formularza. Spróbuj ponownie.";

const LIMITS = { name: 120, phone: 30, email: 254, message: 2000 } as const;

// Znaki sterujące C0/C1, separatory wierszy Unicode i znaki zmiany kierunku tekstu.
const CONTROL_RE =
  /[\u0000-\u001F\u007F-\u009F\u2028\u2029\u202A-\u202E\u2066-\u2069]/g;
// To samo, ale z zachowaniem \t i \n — dla wiadomości wielowierszowej.
const CONTROL_MULTILINE_RE =
  /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u2028\u2029\u202A-\u202E\u2066-\u2069]/g;

// Bez znaków, które w adresach e-mail mają znaczenie specjalne (<>,;:" itd.).
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[\d\s()+-]+$/;

class RequestError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

/** Tekst jednowierszowy: NFC, bez znaków sterujących, pojedyncze spacje. */
const line = (v: unknown) =>
  typeof v === "string"
    ? v.normalize("NFC").replace(CONTROL_RE, " ").replace(/\s+/g, " ").trim()
    : "";

/** Tekst wielowierszowy: jak wyżej, ale z zachowaniem podziału na wiersze. */
const multiline = (v: unknown) =>
  typeof v === "string"
    ? v
        .normalize("NFC")
        .replace(/\r\n?/g, "\n")
        .replace(CONTROL_MULTILINE_RE, "")
        .trim()
    : "";

/**
 * Pole wyboru: klient wysyła id opcji (stabilne — etykiety zawierają ceny,
 * które mogą się zmienić), do arkusza trafia aktualna etykieta.
 * "" = nie wybrano, null = wartość spoza allowlisty.
 */
const choice = (v: unknown, options: Option[]): string | null => {
  const id = line(v);
  if (!id) return "";
  return options.find((o) => o.id === id)?.label ?? null;
};

/** Czyta body z limitem rozmiaru — Route Handlers nie mają własnego limitu. */
async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    throw new RequestError(413);
  }
  if (!request.body) throw new RequestError(400);

  // Content-Length może nie być podany (chunked) — liczymy bajty sami.
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RequestError(413);
    }
    chunks.push(value);
  }

  try {
    return JSON.parse(new TextDecoder().decode(Buffer.concat(chunks)));
  } catch {
    throw new RequestError(400);
  }
}

/**
 * Zapis do .data/ (poza public/, niedostępny z sieci) — wyłącznie pomoc przy
 * pracy lokalnej bez skonfigurowanego Google. W produkcji nie jest używany.
 */
async function persist(entry: string): Promise<boolean> {
  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true, mode: 0o700 });
    await appendFile(path.join(dir, "zgloszenia.jsonl"), entry + "\n", {
      encoding: "utf8",
      mode: 0o600,
    });
    return true;
  } catch {
    return false;
  }
}

type LeadSubmission = {
  name: string;
  phone: string;
  email: string;
  goal: string;
  lessonType: string;
  level: string;
  time: string;
  message: string;
  submittedAt: string;
};

type TurnstileResult = "passed" | "rejected" | "not-configured";

/** Kody błędów Cloudflare do logów — tylko proste identyfikatory, nic więcej. */
const safeCodes = (v: unknown) =>
  (Array.isArray(v) &&
    v
      .filter((c): c is string => typeof c === "string" && /^[a-z0-9-]{1,40}$/.test(c))
      .slice(0, 5)
      .join(",")) ||
  "brak kodów";

/**
 * Weryfikacja Cloudflare Turnstile po stronie serwera (Siteverify), zanim
 * cokolwiek trafi do Google czy Resend. Fail closed: przechodzi wyłącznie
 * odpowiedź-obiekt z success === true i hostname z allowlisty. Odpowiedź
 * Cloudflare jest niezaufana — nie trafia do klienta ani w całości do logów.
 */
async function verifyTurnstile(token: unknown): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Dokładne hostname'y (bez wildcardów) — zmiana domeny to tylko zmiana env.
  const allowedHosts = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  if (!secret || !allowedHosts.length) {
    console.error(
      "[booking] brak TURNSTILE_SECRET_KEY lub TURNSTILE_ALLOWED_HOSTNAMES",
    );
    return "not-configured";
  }
  if (typeof token !== "string" || !token || token.length > TURNSTILE_TOKEN_MAX) {
    console.info("[booking] Turnstile: brak lub niepoprawny token");
    return "rejected";
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[booking] Turnstile: Siteverify odpowiedział HTTP ${res.status}`);
      return "rejected";
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch (err) {
      // Timeout w trakcie czytania body też tu trafia.
      const name = err instanceof Error ? err.name : "błąd";
      console.error(`[booking] Turnstile: niepoprawny JSON z Siteverify (${name})`);
      return "rejected";
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      console.error("[booking] Turnstile: odpowiedź Siteverify nie jest obiektem");
      return "rejected";
    }
    const result = data as Record<string, unknown>;
    if (result.success !== true) {
      console.info(
        `[booking] Turnstile odrzucił token (${safeCodes(result["error-codes"])})`,
      );
      return "rejected";
    }
    const host =
      typeof result.hostname === "string" ? result.hostname.toLowerCase() : "";
    if (!allowedHosts.includes(host)) {
      const shown = /^[a-z0-9.-]{1,253}$/.test(host) ? host : "?";
      console.error(`[booking] Turnstile: hostname spoza allowlisty (${shown})`);
      return "rejected";
    }
    return "passed";
  } catch (err) {
    console.error(
      `[booking] Turnstile: brak odpowiedzi Siteverify (${err instanceof Error ? err.name : "błąd"})`,
    );
    return "rejected";
  }
}

type GoogleResult = "saved" | "failed" | "not-configured";

/**
 * Zapis leada w Google Sheets przez Apps Script Web App.
 * Sukces tylko gdy HTTP jest OK i odpowiedź to JSON z `ok: true` — Apps Script
 * potrafi zwrócić 200 ze stroną błędu w HTML. URL, sekret i treść odpowiedzi
 * Google nie trafiają ani do logów, ani do klienta.
 */
async function saveLeadToGoogle(lead: LeadSubmission): Promise<GoogleResult> {
  const url = process.env.GOOGLE_LEADS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_LEADS_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error(
      "[booking] brak GOOGLE_LEADS_WEBHOOK_URL lub GOOGLE_LEADS_WEBHOOK_SECRET",
    );
    return "not-configured";
  }
  // Sekret leci w body — nie wysyłamy go nieszyfrowanym połączeniem.
  if (!url.startsWith("https://")) {
    console.error("[booking] adres Apps Script musi zaczynać się od https://");
    return "not-configured";
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, lead }),
      // Apps Script odpowiada przekierowaniem 302 do strony z wynikiem.
      redirect: "follow",
      signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[booking] Apps Script odrzucił zapis (HTTP ${res.status})`);
      return "failed";
    }

    let result: unknown;
    try {
      result = await res.json();
    } catch (err) {
      // Timeout w trakcie czytania body też tu trafia.
      const name = err instanceof Error ? err.name : "błąd";
      console.error(`[booking] Apps Script zwrócił niepoprawny JSON (${name})`);
      return "failed";
    }
    if ((result as { ok?: unknown } | null)?.ok !== true) {
      console.error("[booking] Apps Script nie potwierdził zapisu (ok !== true)");
      return "failed";
    }
    return "saved";
  } catch (err) {
    console.error(
      `[booking] brak odpowiedzi z Apps Script (${err instanceof Error ? err.name : "błąd"})`,
    );
    return "failed";
  }
}

/**
 * Opcjonalne powiadomienie e-mail przez Resend — tylko informacja dla szkoły.
 * Wywoływane wyłącznie po zapisie w Google i nigdy nie zmienia odpowiedzi
 * formularza. HTML (z escapowanymi danymi) + tekst, temat bez danych użytkownika.
 */
async function sendLeadNotification(lead: LeadSubmission): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !to || !from) {
    console.info("[booking] email notification disabled");
    return;
  }

  const { text, html } = renderLeadEmail(lead);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // E-mail przeszedł walidację (bez <>,;:" itd.) — szkoła może odpisać wprost.
        reply_to: lead.email,
        subject: NOTIFY_SUBJECT,
        html,
        text,
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    // 2xx = Resend przyjął wiadomość; treść odpowiedzi nie jest potrzebna.
    if (res.ok) console.info("[booking] email notification sent");
    else console.error(`[booking] email notification failed (status: ${res.status})`);
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[booking] email notification timeout");
    } else {
      console.error(
        `[booking] email notification failed (${err instanceof Error ? err.name : "error"})`,
      );
    }
  }
}

const invalid = (status: number) =>
  NextResponse.json({ ok: false, error: "Nieprawidłowe dane." }, { status });

const unavailable = () =>
  NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

export async function POST(request: Request) {
  // Tylko JSON: wymusza preflight CORS, więc obca strona nie wyśle
  // zgłoszenia z przeglądarki odwiedzającego zwykłym <form>.
  if (!/^application\/json\b/i.test(request.headers.get("content-type") ?? "")) {
    return invalid(415);
  }

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (err) {
    return invalid(err instanceof RequestError ? err.status : 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return invalid(400);
  }
  const input = body as Record<string, unknown>;

  // Honeypot — boty wypełniają ukryte pole. Odpowiedź taka sama jak przy sukcesie.
  if (line(input.website)) {
    console.info("[booking] zgłoszenie odrzucone (honeypot)");
    return NextResponse.json({ ok: true });
  }

  // Turnstile przed walidacją pól i przed Google/Resend — bez potwierdzonego
  // tokenu zgłoszenie nie idzie dalej (fail closed). Brak konfiguracji to
  // awaria po naszej stronie, więc klient dostaje ten sam błąd co przy Google.
  const turnstile = await verifyTurnstile(input.turnstileToken);
  if (turnstile === "not-configured") return unavailable();
  if (turnstile !== "passed") {
    return NextResponse.json(
      { ok: false, errors: { turnstile: TURNSTILE_ERROR } },
      { status: 403 },
    );
  }

  const goal = choice(input.goal, GOALS);
  const lessonType = choice(input.lessonType, LESSON_TYPES);
  const level = choice(input.level, LEVELS);
  const time = choice(input.time, TIMES);

  const lead: LeadSubmission = {
    name: line(input.name),
    phone: line(input.phone),
    email: line(input.email),
    goal: goal ?? "",
    lessonType: lessonType ?? "",
    level: level ?? "",
    time: time ?? "",
    message: multiline(input.message),
    // Data zgłoszenia zawsze z serwera — nie z danych od klienta.
    submittedAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  // goal i lessonType są wymagane; level i time opcjonalne, ale jeśli
  // przyszły, muszą być z allowlisty.
  if (!goal) errors.goal = "Wybierz, czego chcesz się uczyć.";
  if (!lessonType) errors.lessonType = "Wybierz rodzaj zajęć.";
  if (level === null) errors.level = "Wybierz poziom z listy.";
  if (time === null) errors.time = "Wybierz porę dnia z listy.";
  if (lead.name.length < 2) errors.name = "Podaj imię.";
  else if (lead.name.length > LIMITS.name)
    errors.name = `Imię może mieć najwyżej ${LIMITS.name} znaków.`;
  const digits = lead.phone.replace(/\D/g, "").length;
  if (
    lead.phone.length > LIMITS.phone ||
    !PHONE_RE.test(lead.phone) ||
    digits < 9 ||
    digits > 15
  )
    errors.phone = "Podaj numer telefonu.";
  if (lead.email.length > LIMITS.email || !EMAIL_RE.test(lead.email))
    errors.email = "Podaj poprawny adres e-mail.";
  if (lead.message.length > LIMITS.message)
    errors.message = `Wiadomość może mieć najwyżej ${LIMITS.message} znaków.`;
  if (input.consent !== true) errors.consent = "Potrzebujemy tej zgody.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Google Sheets jest źródłem prawdy: sukces tylko po potwierdzeniu zapisu.
  // Plik .data/ liczy się wyłącznie lokalnie (npm run dev), gdy Google nie
  // jest skonfigurowany.
  const google = await saveLeadToGoogle(lead);
  const saved =
    google === "not-configured" &&
    process.env.NODE_ENV !== "production" &&
    (await persist(JSON.stringify(lead)));
  const delivered = google === "saved" || saved;

  // Logi bez danych osobowych — tylko stan kanałów dostarczenia.
  const channels = `google: ${google}, plik: ${saved ? "tak" : "nie"}`;
  if (!delivered) {
    console.error(`[booking] zgłoszenie NIE zostało dostarczone (${channels})`);
    return unavailable();
  }

  console.info(`[booking] zgłoszenie przyjęte (${channels})`);
  // Powiadomienie dopiero po zapisie w Google i już po wysłaniu odpowiedzi —
  // jego wynik (także timeout) nie opóźnia ani nie zmienia sukcesu formularza.
  if (google === "saved") after(() => sendLeadNotification(lead));
  return NextResponse.json({ ok: true });
}

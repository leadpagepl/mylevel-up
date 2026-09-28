import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  GOALS,
  LESSON_TYPES,
  LEVELS,
  TIMES,
  type Option,
} from "@/components/booking/options";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Zgłoszenie to kilkaset bajtów — większe body odrzucamy przed parsowaniem. */
const MAX_BODY_BYTES = 16 * 1024;
const RESEND_TIMEOUT_MS = 8000;

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

/** Pole wyboru: przyjmujemy tylko etykiety z formularza, resztę pomijamy. */
const choice = (v: unknown, options: Option[]) => {
  const s = line(v);
  return options.some((o) => o.label.normalize("NFC") === s) ? s : "";
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

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
 * Lokalna kopia zgłoszenia w .data/ (poza public/, niedostępna z sieci).
 * Na serverless (np. Vercel) katalog projektu jest tylko do odczytu, a /tmp
 * jest ulotny — tam ten zapis nie jest trwały i nie liczy się jako dostarczenie.
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

type EmailResult = "sent" | "failed" | "not-configured";

/** Wysyłka e-mailem przez Resend — aktywna tylko gdy ustawiono zmienne. */
async function sendEmail(data: Record<string, string>): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !to || !from) return "not-configured";

  // Dane z formularza escapujemy — inaczej można by wstrzyknąć do maila
  // szkoły własne linki, obrazki czy formularze.
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

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
        reply_to: data.email || undefined,
        subject: `Nowe zgłoszenie ze strony — ${data.imie || "bez imienia"}`,
        html: `<h2>Nowe zgłoszenie na lekcję</h2><table cellpadding="6">${rows}</table>`,
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    if (res.ok) return "sent";
    // Tylko status — treść odpowiedzi Resend nie trafia do logów ani do klienta.
    console.error(`[booking] Resend odrzucił wysyłkę (HTTP ${res.status})`);
    return "failed";
  } catch (err) {
    console.error(
      `[booking] brak odpowiedzi z Resend (${err instanceof Error ? err.name : "błąd"})`,
    );
    return "failed";
  }
}

const invalid = (status: number) =>
  NextResponse.json({ ok: false, error: "Nieprawidłowe dane." }, { status });

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

  const data = {
    imie: line(input.name),
    telefon: line(input.phone),
    email: line(input.email),
    cel: choice(input.goal, GOALS),
    rodzajZajec: choice(input.lessonType, LESSON_TYPES),
    poziom: choice(input.level, LEVELS),
    poraDnia: choice(input.time, TIMES),
    wiadomosc: multiline(input.message),
  };

  const errors: Record<string, string> = {};
  if (data.imie.length < 2) errors.name = "Podaj imię.";
  else if (data.imie.length > LIMITS.name)
    errors.name = `Imię może mieć najwyżej ${LIMITS.name} znaków.`;
  const digits = data.telefon.replace(/\D/g, "").length;
  if (
    data.telefon.length > LIMITS.phone ||
    !PHONE_RE.test(data.telefon) ||
    digits < 9 ||
    digits > 15
  )
    errors.phone = "Podaj numer telefonu.";
  if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email))
    errors.email = "Podaj poprawny adres e-mail.";
  if (data.wiadomosc.length > LIMITS.message)
    errors.message = `Wiadomość może mieć najwyżej ${LIMITS.message} znaków.`;
  if (input.consent !== true) errors.consent = "Potrzebujemy tej zgody.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const record = {
    ...data,
    data: new Date().toISOString(),
    zrodlo: "strona www",
  };

  const saved = await persist(JSON.stringify(record));
  const email = await sendEmail(data);

  // W produkcji jedynym trwałym kanałem jest e-mail: plik na serverless ginie,
  // więc sukces pokazujemy dopiero po potwierdzeniu wysyłki przez Resend.
  // Lokalnie (npm run dev) wystarcza zapis do .data/.
  const delivered =
    email === "sent" || (saved && process.env.NODE_ENV !== "production");

  // Logi bez danych osobowych — tylko stan kanałów dostarczenia.
  const channels = `e-mail: ${email}, plik: ${saved ? "tak" : "nie"}`;
  if (!delivered) {
    console.error(`[booking] zgłoszenie NIE zostało dostarczone (${channels})`);
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503 },
    );
  }

  console.info(`[booking] zgłoszenie przyjęte (${channels})`);
  return NextResponse.json({ ok: true });
}

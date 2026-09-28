import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = Record<string, unknown>;

const str = (v: unknown, max = 400) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[\d\s()+-]{9,20}$/;

/** Zapis zgłoszenia na dysk. Zwraca ścieżkę albo null. */
async function persist(line: string): Promise<string | null> {
  const targets = [
    path.join(process.cwd(), ".data"),
    path.join(tmpdir(), "level-up"),
  ];
  for (const dir of targets) {
    try {
      await mkdir(dir, { recursive: true });
      const file = path.join(dir, "zgloszenia.jsonl");
      await appendFile(file, line + "\n", "utf8");
      return file;
    } catch {
      /* spróbuj następnej lokalizacji */
    }
  }
  return null;
}

/** Wysyłka e-mailem przez Resend — aktywna tylko gdy ustawiono zmienne. */
async function sendEmail(data: Record<string, string>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !to || !from) return false;

  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
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
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Nieprawidłowe dane." },
      { status: 400 },
    );
  }

  // Honeypot — boty wypełniają ukryte pole.
  if (str(body.website)) {
    return NextResponse.json({ ok: true, delivery: "ignored" });
  }

  const data = {
    imie: str(body.name, 120),
    telefon: str(body.phone, 30),
    email: str(body.email, 160),
    cel: str(body.goal, 80),
    rodzajZajec: str(body.lessonType, 80),
    poziom: str(body.level, 80),
    poraDnia: str(body.time, 80),
    wiadomosc: str(body.message, 1500),
  };

  const errors: Record<string, string> = {};
  if (data.imie.length < 2) errors.name = "Podaj imię.";
  if (!PHONE_RE.test(data.telefon)) errors.phone = "Podaj numer telefonu.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Podaj poprawny adres e-mail.";
  if (body.consent !== true) errors.consent = "Potrzebujemy tej zgody.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const record = {
    ...data,
    data: new Date().toISOString(),
    zrodlo: "strona www",
  };

  const emailed = await sendEmail(data);
  const file = await persist(JSON.stringify(record));

  if (!emailed && !file) {
    // Nic nie zostało realnie zapisane — nie udajemy sukcesu.
    console.error("[booking] zgłoszenie nie zostało nigdzie zapisane", record);
    return NextResponse.json(
      { ok: false, error: "storage" },
      { status: 503 },
    );
  }

  console.info(
    `[booking] zgłoszenie przyjęte (e-mail: ${emailed ? "tak" : "nie"}, plik: ${file ?? "nie"})`,
  );

  return NextResponse.json({
    ok: true,
    delivery: emailed ? "email" : "file",
  });
}

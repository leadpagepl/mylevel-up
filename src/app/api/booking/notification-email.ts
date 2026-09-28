/**
 * Treść powiadomienia e-mail o nowym zgłoszeniu: HTML w stylistyce strony
 * + wersja tekstowa, obie z tej samej listy pól. Każda wartość z formularza
 * przechodzi przez escapeHtml, zanim trafi do HTML.
 */

type LeadEmail = Record<
  | "name"
  | "phone"
  | "email"
  | "goal"
  | "lessonType"
  | "level"
  | "time"
  | "message"
  | "submittedAt",
  string
>;

export const NOTIFY_SUBJECT = "Nowe zgłoszenie ze strony MY LEVEL-UP";

// Kolory z design systemu strony (src/app/globals.css). Klienty pocztowe nie
// znają color-mix(), więc odcienie z przezroczystością są przeliczone na bieli.
const INK = "#10243f";
const SIGNAL = "#c61030";
const GOLD = "#ecaa38";
const PAPER = "#f7f8fa";
const MUTED = "#647182"; // ink 65%
const LINE = "#dee0e4"; // .hairline — ink 14%
const FONT = "'Plus Jakarta Sans', Arial, Helvetica, sans-serif";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// mailto: tylko dla adresów bez znaków, które w URL coś znaczą (?, &, %, #…).
const SAFE_MAILTO_RE = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function renderLeadEmail(lead: LeadEmail) {
  const date = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(lead.submittedAt));
  // tel: wyłącznie z cyfr (i wiodącego +) — nie z surowego tekstu.
  const tel = (lead.phone.startsWith("+") ? "+" : "") + lead.phone.replace(/\D/g, "");

  const fields: { label: string; value: string; href?: string }[] = [
    { label: "Imię", value: lead.name },
    { label: "Telefon", value: lead.phone, href: `tel:${tel}` },
    {
      label: "E-mail",
      value: lead.email,
      href: SAFE_MAILTO_RE.test(lead.email) ? `mailto:${lead.email}` : undefined,
    },
    { label: "Cel", value: lead.goal },
    { label: "Rodzaj zajęć", value: lead.lessonType },
    { label: "Poziom", value: lead.level },
    { label: "Pora dnia", value: lead.time },
    { label: "Wiadomość", value: lead.message },
    { label: "Data zgłoszenia", value: date },
  ];

  const text = [
    NOTIFY_SUBJECT,
    "",
    // Wcięcie kolejnych wierszy — wiadomość nie „udaje” innych pól.
    ...fields.map(({ label, value }) => `${label}: ${value.replace(/\n/g, "\n  ") || "—"}`),
  ].join("\n");

  const label = `font-family:${FONT};font-size:11px;line-height:1.2;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:${MUTED};`;
  const val = `font-family:${FONT};font-size:17px;line-height:1.5;font-weight:600;color:${INK};padding-top:6px;word-break:break-word;`;

  const rows = fields
    .map(({ label: name, value, href }) => {
      // Najpierw escapowanie, dopiero potem <br> w miejsce nowych linii.
      const safe = value ? escapeHtml(value).replace(/\n/g, "<br>") : "—";
      const content =
        href && value
          ? `<a href="${escapeHtml(href)}" style="color:${SIGNAL};text-decoration:none;">${safe}</a>`
          : safe;
      return `<tr><td style="padding:16px 0;border-top:1px solid ${LINE};"><div style="${label}">${name}</div><div style="${val}">${content}</div></td></tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${NOTIFY_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background-color:#ffffff;border:1px solid ${LINE};border-collapse:collapse;">
<tr><td style="height:3px;line-height:3px;font-size:0;background-color:${SIGNAL};">&nbsp;</td></tr>
<tr><td style="background-color:${INK};padding:26px 28px 24px;">
<div style="font-family:${FONT};font-size:22px;line-height:1.1;font-weight:800;letter-spacing:-0.01em;text-transform:uppercase;color:#ffffff;">MY LEVEL-UP</div>
<div style="font-family:${FONT};font-size:11px;line-height:1.2;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:${GOLD};padding-top:8px;">Nowe zgłoszenie ze strony</div>
</td></tr>
<tr><td style="padding:30px 28px 6px;">
<h1 style="margin:0;font-family:${FONT};font-size:25px;line-height:1.15;font-weight:700;letter-spacing:-0.015em;text-transform:uppercase;color:${INK};">Nowe zgłoszenie na lekcję</h1>
<p style="margin:10px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${MUTED};">Nowy kontakt został zapisany w Google Sheets.</p>
</td></tr>
<tr><td style="padding:14px 28px 22px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>
</td></tr>
<tr><td style="background-color:${PAPER};border-top:1px solid ${LINE};padding:20px 28px 24px;">
<div style="font-family:${FONT};font-size:12px;line-height:1.2;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${INK};">MY LEVEL-UP</div>
<div style="font-family:${FONT};font-size:12.5px;line-height:1.5;color:${MUTED};padding-top:6px;">Automatyczne powiadomienie ze strony internetowej</div>
<div style="font-family:${FONT};font-size:12px;line-height:1.5;color:${MUTED};">Lead został zapisany w Google Sheets.</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { text, html };
}

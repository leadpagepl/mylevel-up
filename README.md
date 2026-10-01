# Level Up Szkoła Językowa — strona www

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build produkcyjny
```

## Struktura

| Ścieżka | Co tam jest |
| --- | --- |
| `src/lib/site.ts` | Dane firmowe, ceny, kwalifikacje, ocena Google. **Tu edytuje się treść.** |
| `src/lib/reviews.ts` | Opinie Google przepisane ze zrzutów ekranu klienta. |
| `src/lib/faq.ts` | FAQ + lista pytań czekających na odpowiedź szkoły. |
| `src/components/` | Sekcje strony. |
| `src/app/api/booking/route.ts` | Odbiór zgłoszeń z formularza. |
| `assets-zrodlowe/` | Materiały od klienta: `ang1.png`, `portret.png`, zrzuty opinii. |
| `public/img/` | Grafiki wycięte z materiałów źródłowych. |

## Formularz zgłoszeniowy

```
formularz + token Cloudflare Turnstile
  → POST /api/booking (Next.js): Siteverify → walidacja danych
  → Google Apps Script → Google Sheets
                       └→ (opcjonalnie) e-mail przez Resend
```

**Cloudflare Turnstile** chroni formularz przed botami (obok honeypota).
Serwer weryfikuje token w Cloudflare Siteverify, zanim cokolwiek trafi do
Google czy Resend, i odrzuca zgłoszenie przy każdym wyniku innym niż
potwierdzony sukces z hostname z allowlisty (fail closed, timeout 5 s).
Token jest jednorazowy: po każdej nieudanej próbie widget pobiera nowy.
Konfiguracja: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (publiczny, wbudowywany przy
buildzie), `TURNSTILE_SECRET_KEY` i `TURNSTILE_ALLOWED_HOSTNAMES` (tylko
serwer). Widget działa wyłącznie na hostname'ach dodanych w panelu Cloudflare
— lokalnie używamy kluczy testowych Cloudflare.

`POST /api/booking` waliduje i normalizuje dane, a potem wysyła zgłoszenie
(po stronie serwera, razem ze wspólnym sekretem) do Google Apps Script Web App,
który dopisuje wiersz do arkusza. Przeglądarka nie zna adresu Apps Script
ani sekretu.

Ekran „Dziękujemy za zgłoszenie” pojawia się **wyłącznie** wtedy, gdy Apps
Script potwierdzi zapis odpowiedzią JSON `{ "ok": true }` — sama odpowiedź
HTTP 200 nie wystarcza. Przy błędzie, przekroczeniu czasu (20 s) albo braku
konfiguracji użytkownik dostaje numer telefonu i adres e-mail szkoły.

**Idempotencja (`submissionId`).** Formularz przy otwarciu losuje UUID v4
i wysyła ten sam identyfikator przy każdym ponowieniu tego samego zgłoszenia
(błąd, timeout, nowy token Turnstile, powrót do kroku 1). Nowy identyfikator
powstaje dopiero przy kolejnym otwarciu formularza. API odrzuca zgłoszenie
bez poprawnego UUID v4. Apps Script — w jednej sekcji chronionej Script
Lockiem — sprawdza kolumnę **Submission ID** (K) i dopisuje wiersz tylko
wtedy, gdy takiego identyfikatora jeszcze nie ma; w przeciwnym razie zwraca
`{ "ok": true, "duplicate": true }`. Duplikat to dla użytkownika zwykły
sukces. Dzięki temu ponowienie po timeoucie (Apps Script zapisał wiersz, ale
odpowiedź nie zdążyła wrócić) nie tworzy drugiego wiersza.

Przed publikacją trzeba ustawić `GOOGLE_LEADS_WEBHOOK_URL`
i `GOOGLE_LEADS_WEBHOOK_SECRET` (patrz `.env.example`); bez nich formularz
w produkcji zwraca błąd. Lokalnie (`npm run dev`) bez tych zmiennych
zgłoszenia zapisują się do `.data/zgloszenia.jsonl`.

**Powiadomienie e-mail (Resend) jest opcjonalne.** Wysyłamy je dopiero po
potwierdzonym zapisie w Google Sheets, już po odpowiedzi dla użytkownika.
Google Sheets pozostaje jedynym źródłem prawdy: awaria, timeout (6 s) albo
brak konfiguracji Resend nie powoduje utraty zgłoszenia i nie zmienia ekranu
sukcesu. Mail ma wersję HTML w stylistyce strony (wszystkie dane z formularza
są escapowane) oraz wersję tekstową. Wysyłka używa nagłówka `Idempotency-Key`
opartego na `submissionId`, więc ponowione zgłoszenie nie wysyła drugiego
maila (okno Resend: 24 h). Konfiguracja: `RESEND_API_KEY`,
`BOOKING_NOTIFY_EMAIL`, `BOOKING_FROM_EMAIL` (patrz `.env.example`).

## Do potwierdzenia przez szkołę przed publikacją

1. **Ceny** (90 / 70 / 50 zł) i „materiały w cenie” — z grafiki `ang1.png`.
2. **Liczba i średnia opinii Google** — `googleRating` w `src/lib/site.ts`.
3. **Link do wizytówki Google** — teraz wyszukiwarka Map; warto podmienić na
   krótki link `g.page` z profilu firmy (`site.googleMaps`, `site.googleReviews`).
4. **Kwalifikacje** — lista w `credentials`, przepisana z `ang1.png`.
5. **Cytat Marka** w sekcji „Cześć, jestem Marek” — tekst przygotowany przez
   nas, wymaga akceptacji (`src/components/About.tsx`).
6. **Pytania z `faqDoPotwierdzenia`** (`src/lib/faq.ts`) — terminy, odwoływanie
   zajęć, częstotliwość, płatność za pierwszą lekcję, wolne miejsca w grupach.
   Nie publikujemy ich bez odpowiedzi.
7. **Domena** — `site.siteUrl` (teraz `https://mylevelup.pl`).
8. **Czasy przejścia poziomów** — pasek „Twoja droga z angielskim”
   (`src/lib/progress.ts`) celowo nie pokazuje czasów ani porównań z innymi
   szkołami. Można je dodać dopiero, gdy szkoła będzie miała rzetelne dane
   (porównanie z innymi szkołami to reklama porównawcza).

## Uwagi techniczne

- Hero używa zdjęcia `public/img/levelup-hero-language.png` (1671×941).
  Na desktopie jest tłem sekcji, na mobile osobnym kadrem — różne
  `object-position`, żeby biurko i półka nie traciły kontekstu.
- Portret `portret.png` ma 299×446 px. Kadr 3:4 (`public/img/marek-portret.png`)
  jest wyświetlany w rozmiarze dopasowanym do tej rozdzielczości i nie jest
  rozciągany. Wyższa rozdzielczość od klienta pozwoliłaby go powiększyć.
- Logo zostało wycięte z `ang1.png` (156×145 px źródłowo). Plik wektorowy
  poprawiłby ostrość na ekranach Retina.
- Dane strukturalne (`schema.org`) celowo **nie** zawierają `aggregateRating`
  ani opinii — dodamy po potwierdzeniu aktualnych danych z profilu Google.

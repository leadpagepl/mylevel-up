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

`POST /api/booking` waliduje dane, zapisuje kopię do `.data/zgloszenia.jsonl`
(jeśli katalog jest zapisywalny) i wysyła zgłoszenie mailem przez Resend.
Ekran „Dziękujemy za zgłoszenie” pojawia się **wyłącznie** po odpowiedzi 200.
Przy błędzie użytkownik dostaje numer telefonu i adres e-mail.

W produkcji odpowiedź 200 oznacza, że Resend przyjął wiadomość — plik nie
wystarcza, bo na hostingu serverless (np. Vercel) jest ulotny. Dlatego przed
publikacją trzeba ustawić `RESEND_API_KEY`, `BOOKING_TO_EMAIL`
i `BOOKING_FROM_EMAIL`; bez nich formularz zwraca błąd. Lokalnie
(`npm run dev`) wystarcza zapis do pliku.

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

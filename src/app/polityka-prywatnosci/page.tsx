import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const TITLE = "Polityka prywatności";
const DESCRIPTION =
  "Jak Level Up Szkoła Językowa przetwarza dane z formularza zgłoszeniowego na stronie.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Dokument pomocniczy — nie ma go w sitemap i nie trafia do indeksu.
  robots: { index: false, follow: true },
  alternates: { canonical: "/polityka-prywatnosci" },
  // Własny Open Graph, żeby udostępniony link nie przedstawiał się jak strona główna.
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/polityka-prywatnosci",
    siteName: site.name,
    title: `${TITLE} | ${site.name}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${TITLE} | ${site.name}`,
    description: DESCRIPTION,
  },
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="t-head text-ink mt-12 text-[clamp(1.15rem,3.6vw,1.5rem)]">
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="t-body text-ink/70 mt-4 max-w-[70ch] text-[15.5px]">{children}</p>
);

const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="t-body text-ink/70 mt-4 max-w-[70ch] list-disc space-y-2 pl-5 text-[15.5px]">
    {children}
  </ul>
);

const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-ink font-semibold">{children}</strong>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-ink/10 border-b bg-white">
        <div className="mx-[var(--edge)] flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Wróć na stronę główną">
            <Image
              src="/img/logo-level-up.png"
              alt="Level Up Szkoła Językowa"
              width={590}
              height={675}
              className="h-[38px] w-auto"
            />
          </Link>
          <Link
            href="/"
            className="t-label text-ink/55 hover:text-ink transition-colors duration-200"
          >
            ← Strona główna
          </Link>
        </div>
      </header>

      <main className="mx-[var(--edge)] py-16 md:py-24">
        <p className="t-label text-signal">Dokument</p>
        <h1 className="t-display mt-5 max-w-[16ch] text-[clamp(2rem,6vw,3.6rem)]">
          Polityka prywatności
        </h1>
        <div className="rule-red mt-7 w-[92px]" />

        <H2>Kto jest administratorem danych</H2>
        <P>
          Administratorem danych podanych w formularzu na tej stronie jest{" "}
          {site.legalName} z siedzibą w {site.cityIn}. Kontakt:{" "}
          <a className="text-ink underline underline-offset-4" href={site.emailHref}>
            {site.email}
          </a>
          , tel.{" "}
          <a className="text-ink underline underline-offset-4" href={site.phoneHref}>
            {site.phone}
          </a>
          .
        </P>

        <H2>Jakie dane zbieramy</H2>
        <P>
          Formularz „Umów pierwszą lekcję” zbiera: imię, numer telefonu, adres
          e-mail, opcjonalną wiadomość oraz wybrane przez Ciebie odpowiedzi
          dotyczące celu nauki, rodzaju zajęć, poziomu i preferowanej pory dnia.
          Do zgłoszenia dodajemy datę oraz losowy identyfikator techniczny.
          Służy on wyłącznie temu, żeby ponowne wysłanie tego samego
          formularza nie utworzyło duplikatu zgłoszenia. W formularzu nie
          prosimy o żadne inne dane — ani o dane płatnicze, ani o numer PESEL.
        </P>

        <H2>Po co ich używamy</H2>
        <P>
          Wyłącznie po to, żeby odpowiedzieć na Twoje zgłoszenie i ustalić
          szczegóły zajęć. Podstawą przetwarzania jest Twoja zgoda (art. 6 ust. 1
          lit. a RODO) oraz podjęcie działań przed zawarciem umowy na Twoje
          żądanie (art. 6 ust. 1 lit. b RODO).
        </P>
        <P>
          Dane techniczne potrzebne do ochrony formularza przed spamem
          i nadużyciami (opisane niżej) przetwarzamy na podstawie prawnie
          uzasadnionego interesu, jakim jest bezpieczeństwo strony (art. 6
          ust. 1 lit. f RODO).
        </P>

        <H2>Jak długo je przechowujemy</H2>
        <P>
          Do czasu zakończenia kontaktu w sprawie zgłoszenia. Jeśli zapiszesz się
          na zajęcia, przechowujemy je przez czas współpracy i tak długo, jak
          wymagają tego przepisy. Możesz w każdej chwili poprosić o usunięcie
          danych, pisząc na adres e-mail podany wyżej.
        </P>

        <H2>Komu przekazujemy dane</H2>
        <P>
          Nie sprzedajemy danych i nie udostępniamy ich w celach
          marketingowych. Przy prowadzeniu strony i obsłudze zgłoszeń
          korzystamy z usług następujących dostawców:
        </P>
        <UL>
          <li>
            <Strong>Łukasz Czuber, działający pod marką Leadpage</Strong> —
            wykonanie i techniczne utrzymanie strony, formularza oraz
            związanych z nim integracji (w tym arkusza Google i Google Apps
            Script), a także diagnostyka i bezpieczeństwo. W związku z tym
            może mieć techniczny dostęp do danych przekazywanych przez
            formularz — wyłącznie w zakresie niezbędnym do świadczenia tych
            usług na rzecz szkoły, która pozostaje administratorem danych.
          </li>
          <li>
            <Strong>Vercel</Strong> — hosting strony i jej części serwerowej.
            Każde zgłoszenie przechodzi przez serwery Vercel, które — jak
            każdy hosting — przetwarzają też dane techniczne połączenia
            (m.in. adres IP), również w ramach zabezpieczeń chroniących stronę
            i formularz przed spamem i nadużyciami.
          </li>
          <li>
            <Strong>Google</Strong> — zgłoszenia są zapisywane w arkuszu
            Google (Google Sheets) za pośrednictwem Google Apps Script. Arkusz
            jest technicznie utrzymywany przez Leadpage w ramach obsługi
            strony, a szkoła ma do niego dostęp. Od Google pochodzi też mapa
            osadzona w sekcji kontaktowej (opisana niżej).
          </li>
          <li>
            <Strong>Resend</Strong> — wysyłka powiadomień e-mail. Na skrzynkę
            e-mail szkoły trafia powiadomienie o nowym zgłoszeniu wraz z jego
            treścią.
          </li>
          <li>
            <Strong>Cloudflare</Strong> — usługa Turnstile, która chroni
            formularz przed botami i nadużyciami. Gdy przechodzisz do
            drugiego kroku formularza, Twoja przeglądarka łączy się
            z serwerami Cloudflare, które w tym celu przetwarzają dane
            techniczne (m.in. adres IP i informacje o przeglądarce).
          </li>
        </UL>
        <P>
          Część tych dostawców działa także poza Europejskim Obszarem
          Gospodarczym, m.in. w Stanach Zjednoczonych, dlatego dane mogą być
          przetwarzane również poza EOG — na zasadach opisanych
          w dokumentach i politykach prywatności tych dostawców.
        </P>

        <H2>Twoje prawa</H2>
        <P>
          Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia,
          ograniczenia przetwarzania, przeniesienia oraz wniesienia sprzeciwu.
          Zgodę możesz wycofać w dowolnym momencie. Nie wpływa to na zgodność
          z prawem przetwarzania, które odbyło się wcześniej. Przysługuje Ci też skarga do
          Prezesa Urzędu Ochrony Danych Osobowych.
        </P>

        <H2>Pliki cookie i statystyki</H2>
        <P>
          Ta strona nie używa własnych plików cookie do śledzenia ani narzędzi
          analitycznych. Nie osadzamy skryptów reklamowych. Kroje pisma są
          serwowane z własnego serwera strony, więc otwarcie strony nie wysyła
          Twoich danych do zewnętrznych dostawców czcionek. W pamięci
          przeglądarki zapisujemy jedynie informację, że animacja powitalna
          została już odtworzona — znika ona po zamknięciu karty.
        </P>
        <P>
          Zabezpieczenie formularza (Cloudflare Turnstile) wczytuje się
          dopiero po przejściu do drugiego kroku formularza. Dane techniczne,
          które wtedy trafiają do Cloudflare, są przetwarzane zgodnie
          z polityką prywatności Cloudflare.
        </P>
        <P>
          W sekcji kontaktowej osadzona jest mapa Google. Gdy mapa się
          wczytuje, Twoja przeglądarka łączy się z serwerami Google, które
          mogą zapisać własne pliki cookie zgodnie z polityką prywatności
          Google. Mapa ładuje się dopiero po przewinięciu strony do tej sekcji.
        </P>
        <P>
          Linki do profilu Google, Instagrama i Facebooka prowadzą do serwisów
          zewnętrznych, które mają własne polityki prywatności.
        </P>

        <H2>Zmiany</H2>
        <P>
          Jeżeli w przyszłości dodamy narzędzia analityczne lub inne usługi
          zewnętrzne, ten dokument zostanie zaktualizowany przed ich
          uruchomieniem. Ostatnia aktualizacja: październik 2026.
        </P>

        <div className="border-ink/12 mt-16 border-t pt-8">
          <Link
            href="/"
            className="t-label border-ink/25 text-ink hover:bg-ink inline-flex rounded-[2px] border px-6 py-4 transition-colors duration-300 hover:border-transparent hover:text-white"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </main>
    </div>
  );
}

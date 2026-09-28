import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Jak Level Up Szkoła Językowa przetwarza dane z formularza zgłoszeniowego na stronie.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/polityka-prywatnosci" },
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="t-head text-ink mt-12 text-[clamp(1.15rem,3.6vw,1.5rem)]">
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="t-body text-ink/70 mt-4 max-w-[70ch] text-[15.5px]">{children}</p>
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
          Nie zbieramy żadnych innych danych, nie prosimy o dane płatnicze ani o
          numer PESEL.
        </P>

        <H2>Po co ich używamy</H2>
        <P>
          Wyłącznie po to, żeby odpowiedzieć na Twoje zgłoszenie i ustalić
          szczegóły zajęć. Podstawą przetwarzania jest Twoja zgoda (art. 6 ust. 1
          lit. a RODO) oraz podjęcie działań przed zawarciem umowy na Twoje
          żądanie (art. 6 ust. 1 lit. b RODO).
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
          Dane ze zgłoszenia trafiają na serwer, na którym działa ta strona.
          Jeśli włączona jest wysyłka powiadomień, trafiają też na skrzynkę
          e-mail szkoły przez dostawcę usługi wysyłki wiadomości. Nie sprzedajemy i
          nie udostępniamy danych w celach marketingowych.
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
          Twoich danych do zewnętrznych dostawców czcionek.
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
          uruchomieniem.
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

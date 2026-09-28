/**
 * Intro z logo Level Up — wspólne stałe i helpery.
 *
 * Plik celowo NIE ma "use client": `introBootScript` jest importowany
 * w serwerowym layoucie. Funkcje korzystające z `window` wywołujemy
 * wyłącznie po stronie przeglądarki.
 *
 * Jak to działa:
 * 1. Skrypt w <head> (przed pierwszym malowaniem) ustawia
 *    <html data-intro="play">, jeśli intro ma się odtworzyć.
 * 2. CSS pokazuje nakładkę i odtwarza całą animację (keyframes) — działa
 *    na wątku kompozytora, także gdy JS jeszcze się ładuje, i sama się
 *    chowa, nawet gdyby JS w ogóle nie zadziałał.
 * 3. Komponent BrandIntro po zamontowaniu zapisuje flagę w sessionStorage,
 *    wysyła sygnał do hero w chwili otwarcia kurtyny i usuwa nakładkę.
 */

export const INTRO_STORAGE_KEY = "levelup:intro";
export const INTRO_REVEAL_EVENT = "levelup:intro-reveal";

/** Maksymalny czas oczekiwania hero na sygnał z intro. */
const REVEAL_FALLBACK_MS = 2600;

export const introBootScript = `(function(){try{
if(location.pathname!=="/"||location.hash)return;
if(sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)}))return;
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
document.documentElement.setAttribute("data-intro","play");
}catch(e){}})();`;

type IntroWindow = Window & { __levelupIntroRevealed?: boolean };

/** Czy intro jest właśnie odtwarzane (i jeszcze nie odsłoniło strony). */
export function introPlaying(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.dataset.intro === "play" &&
    !(window as IntroWindow).__levelupIntroRevealed
  );
}

/** Wywoływane przez BrandIntro w chwili, gdy kurtyna zaczyna się rozsuwać. */
export function revealIntro() {
  (window as IntroWindow).__levelupIntroRevealed = true;
  window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
}

/**
 * Uruchamia `cb` od razu, jeśli intro nie gra — albo w momencie otwarcia
 * kurtyny. Zawsze z zabezpieczeniem czasowym, żeby hero nigdy nie zostało
 * ukryte. Zwraca funkcję sprzątającą.
 */
export function onIntroReveal(cb: () => void): () => void {
  if (!introPlaying()) {
    cb();
    return () => {};
  }
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.removeEventListener(INTRO_REVEAL_EVENT, run);
    window.clearTimeout(timer);
    cb();
  };
  window.addEventListener(INTRO_REVEAL_EVENT, run);
  const timer = window.setTimeout(run, REVEAL_FALLBACK_MS);
  return () => {
    done = true;
    window.removeEventListener(INTRO_REVEAL_EVENT, run);
    window.clearTimeout(timer);
  };
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { INTRO_STORAGE_KEY, revealIntro } from "@/lib/intro";

/**
 * Nakładka z logo przy pierwszym wejściu na stronę (raz na kartę).
 *
 * Całą animację robi CSS (patrz `.intro` w globals.css) — ten komponent
 * tylko: zapisuje flagę sesji, mówi hero, kiedy startować, i sprząta.
 * Na serwerze i przy pierwszym renderze klienta markup jest identyczny,
 * więc nie ma rozjazdu hydracji; o widoczności decyduje atrybut na <html>.
 */
export function BrandIntro() {
  const [present, setPresent] = useState(true);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.intro !== "play") {
      setPresent(false);
      return;
    }

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* tryb prywatny / zablokowany storage — intro po prostu zagra ponownie */
    }

    let cancelled = false;
    const timers: number[] = [];

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      root.dataset.intro = "done";
      setPresent(false);
    };

    // Czytamy prawdziwy stan animacji CSS — działa niezależnie od tego,
    // ile trwała hydracja.
    const curtain = curtainRef.current
      ?.getAnimations?.()
      .find(
        (a) => (a as CSSAnimation).animationName === "intro-curtain-up",
      ) as CSSAnimation | undefined;

    if (!curtain) {
      revealIntro();
      finish();
      return;
    }

    const delay = Number(curtain.effect?.getComputedTiming().delay ?? 0);
    const elapsed = Number(curtain.currentTime ?? 0);
    const untilReveal = Math.max(0, delay - elapsed);

    timers.push(window.setTimeout(revealIntro, untilReveal));
    curtain.finished.then(finish, finish);
    // Bezpiecznik: nakładka znika najpóźniej 1,5 s po otwarciu kurtyny.
    timers.push(window.setTimeout(finish, untilReveal + 1500));

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  if (!present) return null;

  return (
    <div className="intro" aria-hidden="true">
      <div ref={curtainRef} className="intro-panel intro-panel--top" />
      <div className="intro-panel intro-panel--bottom" />

      <div className="intro-logo">
        <Image
          src="/img/logo-level-up.png"
          alt=""
          width={590}
          height={675}
          priority
          sizes="120px"
        />
      </div>

      <span className="intro-line intro-line--short" />
      <span className="intro-line intro-line--full" />
    </div>
  );
}

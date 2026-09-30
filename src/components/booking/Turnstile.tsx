"use client";

import { useEffect, useImperativeHandle, useRef } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Dokładny adres z dokumentacji — Cloudflare zabrania proxowania i cache'owania api.js.
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("turnstile"));
    script.onerror = () => {
      // Kolejne otwarcie formularza spróbuje załadować skrypt ponownie.
      scriptPromise = null;
      script.remove();
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type TurnstileHandle = { reset: () => void };

/**
 * Widget Cloudflare Turnstile (renderowanie jawne). Token trafia wyłącznie
 * do rodzica przez onToken — nie do DOM (response-field: false) ani storage.
 * Po odmontowaniu widget jest usuwany, więc każde otwarcie ma świeży stan.
 */
export function Turnstile({
  siteKey,
  onToken,
  onUnavailable,
  ref,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
  onUnavailable: () => void;
  ref?: React.Ref<TurnstileHandle>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const handlers = useRef({ onToken, onUnavailable });

  useEffect(() => {
    handlers.current = { onToken, onUnavailable };
  });

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        handlers.current.onToken(null);
        if (widgetId.current) window.turnstile?.reset(widgetId.current);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        const box = boxRef.current;
        if (cancelled || !box) return;
        widgetId.current =
          turnstile.render(box, {
            sitekey: siteKey,
            theme: "light",
            language: "pl",
            size: box.clientWidth < 300 ? "compact" : "flexible",
            "response-field": false,
            callback: (token: string) => handlers.current.onToken(token),
            "expired-callback": () => handlers.current.onToken(null),
            "timeout-callback": () => handlers.current.onToken(null),
            "error-callback": (code: string) => {
              handlers.current.onToken(null);
              // 110xxx to błąd konfiguracji (np. niedozwolony hostname) —
              // ponawianie nic nie da, formularz pokaże telefon i e-mail.
              if (String(code).startsWith("110")) handlers.current.onUnavailable();
              return true; // obsłużone — Turnstile nie loguje kodu w konsoli
            },
          }) ?? null;
      })
      .catch(() => {
        if (!cancelled) handlers.current.onUnavailable();
      });
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
      handlers.current.onToken(null);
    };
  }, [siteKey]);

  return <div ref={boxRef} className="min-h-[65px]" />;
}

/**
 * FAQ — wyłącznie informacje potwierdzone w materiałach szkoły (ang1.png)
 * i w briefie klienta.
 *
 * Pytania operacyjne, na które NIE mamy odpowiedzi (terminy, odwoływanie
 * zajęć, częstotliwość, płatność za pierwszą lekcję, wolne miejsca w grupach)
 * są w `faqDoPotwierdzenia` i celowo NIE są renderowane na stronie.
 * Po uzupełnieniu odpowiedzi wystarczy przenieść je do tablicy `faq`.
 */

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "Ile kosztują zajęcia?",
    a: "Lekcja indywidualna kosztuje 90 zł za 60 minut. W mini-grupie dla 2 osób płacisz 70 zł od osoby, a w grupie 3–4 osób 50 zł od osoby. Materiały do nauki są w cenie.",
  },
  {
    q: "Czy lekcje odbywają się online?",
    a: "Tak. Uczysz się z domu i nie tracisz czasu na dojazdy. Godziny ustalamy indywidualnie.",
  },
  {
    q: "Czy mogę zacząć od zera?",
    a: "Tak. Marek uczy na wszystkich poziomach, od A1 do C2. Na początku ustalamy, co już umiesz, i dobieramy materiał tak, żeby nie był ani za łatwy, ani za trudny.",
  },
  {
    q: "Czy przygotowujesz do matury i egzaminu ósmoklasisty?",
    a: "Tak. Przygotowujemy do matury i do egzaminu ósmoklasisty. Ćwiczymy na zadaniach egzaminacyjnych i skupiamy się na tym, co sprawia Ci najwięcej trudności.",
  },
  {
    q: "Czy przygotowujesz do FCE i CAE?",
    a: "Tak. Przygotowujemy do egzaminów Cambridge FCE i CAE. Marek sam ma certyfikaty CAE i CPE na poziomie C2.",
  },
  {
    q: "Czy mogę uczyć się w parze albo w małej grupie?",
    a: "Tak. Oprócz lekcji indywidualnych są mini-grupy dla 2 osób i dla 3–4 osób. To tańsza opcja, a grupa jest na tyle mała, że każdy mówi na każdych zajęciach.",
  },
  {
    q: "Czy materiały są w cenie?",
    a: "Tak. Materiały do nauki są w cenie zajęć, więc nie musisz kupować podręcznika.",
  },
  {
    q: "Kto prowadzi zajęcia?",
    a: "Wszystkie lekcje prowadzi Marek. Jest absolwentem filologii angielskiej i korporacyjnym trenerem Business English. Ma certyfikat LCCI oraz certyfikaty CAE i CPE (C2).",
  },
];

/**
 * DO UZUPEŁNIENIA PRZEZ SZKOŁĘ — nie publikujemy pytań bez odpowiedzi.
 */
export const faqDoPotwierdzenia: string[] = [
  "Jakie terminy zajęć są obecnie dostępne?",
  "Co się dzieje, jeśli muszę odwołać zajęcia?",
  "Jak często odbywają się zajęcia?",
  "Czy pierwsza lekcja jest płatna?",
  "Czy są wolne miejsca w mini-grupach?",
];

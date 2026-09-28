/**
 * PRAWDZIWE opinie Google przepisane ze zrzutów ekranu dostarczonych przez
 * klienta (assets-zrodlowe/opinie-1..6.png). Wszystkie mają 5 gwiazdek.
 *
 * ZASADA: nie dopisujemy ani jednego słowa. Jeżeli Google skrócił opinię
 * wielokropkiem, zostawiamy ją dokładnie tak, jak widać na zrzucie
 * (pole `truncated`).
 */

export type Review = {
  id: string;
  name: string;
  /** Pełny tekst widoczny na zrzucie ekranu. */
  text: string;
  /** Google ucina dłuższy tekst — na zrzucie widać "…". */
  truncated?: boolean;
  /** Krótki, dosłowny fragment używany w kontekstowych cytatach. */
  pull?: string;
  /** Do czego odnosi się opinia — steruje cytatami w sekcjach. */
  topic:
    | "matura"
    | "egzamin"
    | "rozmowa"
    | "biznes"
    | "podejscie"
    | "cae"
    | "ogolne";
  meta?: string;
};

export const reviews: Review[] = [
  {
    id: "agata-grzesiak",
    name: "Agata Grzesiak",
    topic: "matura",
    meta: "2 opinie",
    pull:
      "Dzięki Markowi zdałam maturę poprawkową z angielskiego i stwierdziłam że angielski nie jest taki zły",
    text:
      "Dzięki Markowi zdałam maturę poprawkową z angielskiego i stwierdziłam że angielski nie jest taki zły tylko trzeba trafić na super nauczyciela który znajdzie taką metodę którą nauczy każdego kto chce się nauczyć angielskiego. I przed maturą poprawkową trafiłam na Level Up Szkołę Językową i na Marka który przygotował mnie do egzaminu maturalnego i zdałam. Dlatego z całego serca bardzo ale to bardzo polecam Level Up .",
  },
  {
    id: "katarzyna-muchorska",
    name: "Katarzyna Muchorska",
    topic: "rozmowa",
    meta: "10 opinii · 1 zdjęcie",
    pull:
      "Dopiero Marek potrafił wytłumaczyć mi zasady gramatyki w sposób jasny i zrozumiały",
    text:
      "Nie zliczę ile razy zaczynałam naukę angielskiego. Zawsze kończyło się tym samym - zniechęceniem i frustracją. Dopiero Marek potrafił wytłumaczyć mi zasady gramatyki w sposób jasny i zrozumiały bazując na przykładach z życia. Bardzo mobilizuje do mówienia po angielsku i stale podnosi poprzeczkę. Żałuję, że tak późno trafiłam do Marka, bo okazuje się, że nauka angielskiego nie musi być tramatycznym przeżyciem 😄 Zapisałam też na lekcje syna, który w tym roku zdaje egzamin ósmoklasisty. Polecam serdecznie Level UP!",
  },
  {
    id: "monika-dzy",
    name: "Monika Dzy",
    topic: "podejscie",
    meta: "10 opinii · 1 zdjęcie",
    pull: "To nauczyciel z prawdziwego powołania",
    text:
      "Z pełnym przekonaniem polecam szkołę językową oraz prowadzącego zajęcia Marka. To nauczyciel z prawdziwego powołania, który nie tylko doskonale zna swój fach, ale też potrafi zarazić pasją do nauki języka. Marek ma wyjątkowe podejście do uczniów, potrafi tłumaczyć w prosty i zrozumiały sposób, a przy tym tworzy atmosferę sprzyjającą nauce. Widać, że jest na właściwym miejscu – robi to, co naprawdę kocha, i dzięki temu nauka staje się przyjemnością.",
  },
  {
    id: "agnieszka-koczot",
    name: "Agnieszka Koczot",
    topic: "biznes",
    meta: "4 opinie · 3 zdjęcia",
    pull:
      "kurs biznesowy był bardzo praktyczny i idealnie skrojony na moje potrzeby",
    text:
      "Z całego serca polecam 💗 zawsze nauka kojarzyła mi się ze stresem i zakuwaniem słówek, a tu miłe zaskoczenie ponieważ kurs biznesowy był bardzo praktyczny i idealnie skrojony na moje potrzeby. W końcu polubiłam ten język dzięki Markowi.",
  },
  {
    id: "jacek-dudek",
    name: "Jacek Dudek",
    topic: "egzamin",
    meta: "Lokalny przewodnik · 2 opinie · 1 zdjęcie",
    pull: "Lekcje są ciekawe, nigdy nudne, a do tego motywują do nauki",
    text:
      "Świetna szkoła języka angielskiego! Marek to bardzo pozytywna i kompetentna osoba z doskonałym przygotowaniem merytorycznym (certyfikaty, codzienna praktyka w pracy). Lekcje są ciekawe, nigdy nudne, a do tego motywują do nauki. Marek przygotowuje i sprawdza zadania domowe oraz skutecznie przygotowuje do zdawania egzaminów. Serdecznie polecam każdemu, kto chce naprawdę skutecznie uczyć się angielskiego!",
  },
  {
    id: "justyna-wilk",
    name: "JUSTYNA WILK",
    topic: "egzamin",
    meta: "2 opinie",
    pull:
      "Córka po 2 latach nauki u pana Marka zdała egzamin na poziomie C1.",
    text:
      "Szczerze polecam!  Córka po 2 latach nauki u pana Marka zdała egzamin na poziomie C1.",
  },
  {
    id: "zuzu",
    name: "zuzu",
    topic: "cae",
    meta: "Lokalny przewodnik · 17 opinii · 4 zdjęcia",
    pull: "Przygotowałam się tutaj do CAE, super atmosfera",
    text: "Przygotowałam się tutaj do CAE, super atmosfera",
  },
  {
    id: "piotr-domanski",
    name: "Piotr Domański",
    topic: "ogolne",
    meta: "8 opinii",
    text:
      'Level up to fantastyczna szkola językowa, a Marek to prawdziwy "artysta" angielskiego. Gorąco polecam wszystkim, szybko zauważycie poprawę!',
  },
  {
    id: "kamil-jura",
    name: "Kamil Jura",
    topic: "rozmowa",
    meta: "7 opinii",
    pull: "Dzięki nim szybko zrobiłem postępy w mówieniu po angielsku",
    text:
      "Świetna szkoła językowa! Zajęcia są prowadzone w ciekawy i angażujący sposób. Dzięki nim szybko zrobiłem postępy w mówieniu po angielsku. Zdecydowanie polecam!",
  },
  {
    id: "kamila-kli",
    name: "kamila kli",
    topic: "egzamin",
    meta: "7 opinii · 2 zdjęcia",
    text:
      "Bardzo polecam tą szkołę, świetne podejście do nauczania przez pana marka dzięki któremu zdałam egzamin językowy",
  },
  {
    id: "kamil-klimaszewski",
    name: "Kamil Klimaszewski",
    topic: "podejscie",
    meta: "3 opinie",
    truncated: true,
    text:
      "Najlepszy z najlepszych nauczyciel języka angielskiego pełen pasji do tego co robi! Gorąco polecam 👍 👍 👍 …",
  },
  {
    id: "filip-roman",
    name: "Filip Roman",
    topic: "podejscie",
    meta: "2 opinie",
    text: "Świetna atmosfera na zajęciach i rzeczowe podejście. Polecam!",
  },
  {
    id: "adam-koronski",
    name: "Adam Koroński",
    topic: "ogolne",
    meta: "2 opinie",
    text: "Dobry nauczyciel, polecam",
  },
  {
    id: "zuzanna-jakubik",
    name: "Zuzanna Jakubik",
    topic: "ogolne",
    meta: "Lokalny przewodnik · 14 opinii",
    truncated: true,
    text: "Sto procent polecam 🙂 …",
  },
  {
    id: "jakub",
    name: "Jakub",
    topic: "rozmowa",
    meta: "2 opinie",
    pull: "Honestly, the best teacher you could ask for!",
    text:
      "Honestly, the best teacher you could ask for! If you want to learn real, everyday English, this is perfect. The lessons are fun, clear, and super practical. I always felt like I was just chatting with a good friend. Totally recommend!",
  },
];

export const byId = (id: string): Review => {
  const found = reviews.find((r) => r.id === id);
  if (!found) throw new Error(`Brak opinii o id "${id}"`);
  return found;
};

/**
 * Fragment pokazywany na karcie w przewijanym pasku opinii.
 * Zawsze dosłowny wycinek prawdziwej opinii — nigdy parafraza.
 */
export const excerptOf = (r: Review) => r.pull ?? r.text;

/** Czy pod kartą ma się pojawić „Czytaj całość". */
export const hasFullText = (r: Review) => excerptOf(r) !== r.text;

/**
 * Wybiera opinie po id. W odróżnieniu od `byId` nie rzuca wyjątkiem —
 * literówka w id pomija jedną kartę zamiast wywracać całą sekcję.
 */
export const pickReviews = (ids: readonly string[]): Review[] =>
  ids.reduce<Review[]>((acc, id) => {
    const found = reviews.find((r) => r.id === id);
    if (found) acc.push(found);
    else if (process.env.NODE_ENV !== "production")
      console.warn(`[opinie] pominięto nieznane id: "${id}"`);
    return acc;
  }, []);

/** Dwa rzędy przewijanych opinii — dobrane tak, żeby mieszały tematy. */
export const marqueeRowA: Review[] = pickReviews([
  "agata-grzesiak",
  "katarzyna-muchorska",
  "agnieszka-koczot",
  "justyna-wilk",
  "jacek-dudek",
  "zuzu",
  "piotr-domanski",
  "filip-roman",
]);

export const marqueeRowB: Review[] = pickReviews([
  "monika-dzy",
  "kamil-jura",
  "jakub",
  "kamila-kli",
  "kamil-klimaszewski",
  "adam-koronski",
  "zuzanna-jakubik",
]);

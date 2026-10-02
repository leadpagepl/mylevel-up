/**
 * Dane firmowe Level Up Szkoła Językowa.
 * Wszystko, co klient może chcieć poprawić, jest w tym jednym pliku.
 */

export const site = {
  name: "Level Up Szkoła Językowa",
  legalName: "Level Up Szkoła Językowa Marek Pydziński",
  teacher: "Marek Pydziński",
  teacherFirstName: "Marek",
  city: "Częstochowa",
  /** Miejscownik — do zdań typu „w Częstochowie”. */
  cityIn: "Częstochowie",
  phone: "695 438 993",
  phoneHref: "tel:+48695438993",
  email: "mylevelup01@gmail.com",
  emailHref: "mailto:mylevelup01@gmail.com",
  instagram: "https://www.instagram.com/levelupszkolajezykowa/",
  facebook:
    "https://www.facebook.com/p/Level-Up-Szko%C5%82a-J%C4%99zykowa-100075838835493/",
  /**
   * DO POTWIERDZENIA: docelowo warto podmienić na krótki link z profilu firmy
   * (Google Business Profile → Udostępnij → https://g.page/...), żeby prowadził
   * prosto do karty, a nie do wyników wyszukiwania.
   */
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=Level%20Up%20Szko%C5%82a%20J%C4%99zykowa%20Cz%C4%99stochowa",
  googleReviews:
    "https://www.google.com/maps/search/?api=1&query=Level%20Up%20Szko%C5%82a%20J%C4%99zykowa%20Cz%C4%99stochowa",
  /** Adres szkoły — podany przez klienta. */
  address: {
    street: "Poleska 74B/M.19",
    postalCode: "42-218",
    city: "Częstochowa",
  },
  /**
   * Mapa osadzona w sekcji kontaktu (bez klucza API). Pinezka wskazuje
   * budynek — numer lokalu Google pokazywał jako nazwę miejsca („M.19”),
   * więc pełny adres z lokalem jest wyświetlany tekstem nad mapą.
   */
  mapEmbed:
    "https://www.google.com/maps?q=Poleska%2074B%2C%2042-218%20Cz%C4%99stochowa&hl=pl&z=16&output=embed",
  siteUrl: "https://mylevelup.pl",
  /** Zdjęcie do podglądu linku (Open Graph), 1200×630 — kadr ze zdjęcia hero. */
  ogImage: "/img/og-level-up.jpg",
  author: { name: "Leadpage", url: "https://leadpage.pl" },
} as const;

/**
 * DO POTWIERDZENIA ze szkołą przed publikacją.
 * Na materiałach dostarczonych przez klienta znajduje się 15 opinii — wszystkie
 * na 5 gwiazdek. Liczba opinii w Google zmienia się w czasie, więc przed
 * publikacją należy sprawdzić aktualny stan profilu i poprawić te dwie wartości.
 */
export const googleRating = {
  value: "5,0",
  count: 15,
  confirmed: false,
} as const;

/** Ceny z grafiki promocyjnej ang1.png — DO POTWIERDZENIA aktualności. */
export const pricing = [
  {
    id: "indywidualnie",
    label: "Indywidualnie",
    kicker: "Zajęcia 1 na 1",
    price: "90",
    unit: "zł",
    per: "za 60 minut",
    blurb:
      "Cała lekcja jest tylko dla Ciebie. Tempo i tematy dopasowujemy do tego, czego potrzebujesz.",
    points: ["Pełna uwaga nauczyciela", "Materiały w cenie zajęć"],
    accent: true,
  },
  {
    id: "para",
    label: "Mini-grupa · 2 osoby",
    kicker: "W parze",
    price: "70",
    unit: "zł",
    per: "od osoby",
    blurb:
      "Uczysz się razem z partnerem, znajomym albo kolegą z pracy. Więcej rozmowy, niższa cena.",
    points: ["Dwie osoby na zajęciach", "Materiały w cenie zajęć"],
    accent: false,
  },
  {
    id: "grupa",
    label: "Mini-grupa · 3–4 osoby",
    kicker: "Mała grupa",
    price: "50",
    unit: "zł",
    per: "od osoby",
    blurb:
      "Grupa jest mała, więc każdy mówi na każdej lekcji. Dużo praktyki i dobra atmosfera.",
    points: ["Od 3 do 4 osób", "Materiały w cenie zajęć"],
    accent: false,
  },
] as const;

/** Kwalifikacje wypisane na grafice promocyjnej szkoły (ang1.png). */
export const credentials = [
  "Absolwent filologii angielskiej",
  "Korporacyjny trener Business English",
  "Certyfikat LCCI",
  "Certyfikaty CAE i CPE (C2)",
  "Wieloletnie doświadczenie w nauczaniu",
  "Praca na wszystkich poziomach: A1–C2",
] as const;

export const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

/** Egzaminy potwierdzone w materiałach szkoły. */
export const exams = ["Matura", "Egzamin ósmoklasisty", "FCE", "CAE"] as const;

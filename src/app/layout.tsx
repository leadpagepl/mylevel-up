import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { introBootScript } from "@/lib/intro";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
  // Krój cytatów — pojawia się dopiero poniżej pierwszego ekranu, więc nie
  // konkuruje o łącze ze zdjęciem hero (LCP).
  preload: false,
});

const OG_TITLE = "Zacznij mówić po angielsku | Level Up";
const OG_DESCRIPTION =
  "Lekcje angielskiego online dopasowane do Twojego poziomu. Indywidualnie lub w małej grupie. Matura, egzamin ósmoklasisty, FCE, CAE, Business English.";
const OG_IMAGE = {
  url: site.ogImage,
  width: 1200,
  height: 630,
  alt: "Biurko do nauki angielskiego: książki, notatnik i laptop. Level Up Szkoła Językowa",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    // Do ok. 60 znaków — dłuższy tytuł wyszukiwarki ucinają.
    default: "Angielski online | Level Up Szkoła Językowa Częstochowa",
    template: "%s | Level Up Szkoła Językowa",
  },
  // Do ok. 160 znaków; nazwa szkoły i miasto na początku, żeby nie zostały ucięte.
  description:
    "Level Up Szkoła Językowa z Częstochowy: angielski online indywidualnie i w mini-grupach, od A1 do C2. Matura, egzamin ósmoklasisty, FCE, CAE, Business English.",
  keywords: [
    "angielski online",
    "szkoła językowa Częstochowa",
    "korepetycje z angielskiego",
    "przygotowanie do matury z angielskiego",
    "egzamin ósmoklasisty angielski",
    "przygotowanie do FCE",
    "przygotowanie do CAE",
    "Business English",
    "Level Up Szkoła Językowa",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: site.siteUrl,
    siteName: site.name,
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  // max-image-preview: zgoda na duży podgląd zdjęcia w wynikach wyszukiwania.
  robots: { index: true, follow: true, "max-image-preview": "large" },
  // Ikony: src/app/icon.png i apple-icon.png (kwadratowe — konwencja plików Next.js).
};

export const viewport: Viewport = {
  themeColor: "#10243F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: skrypt intro ustawia data-intro na <html>
    // przed hydracją — to jedyna zamierzona różnica względem HTML z serwera.
    <html
      lang="pl"
      className={`${jakarta.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

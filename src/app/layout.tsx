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
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default:
      "Angielski online | Level Up Szkoła Językowa Częstochowa, Marek Pydziński",
    template: "%s | Level Up Szkoła Językowa",
  },
  description:
    "Angielski online z Markiem: lekcje indywidualne i mini-grupy, od A1 do C2. Przygotowanie do matury, egzaminu ósmoklasisty, FCE i CAE oraz Business English. Szkoła językowa Level Up z Częstochowy.",
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
    title: "Zacznij mówić po angielsku | Level Up",
    description:
      "Lekcje angielskiego online dopasowane do Twojego poziomu. Indywidualnie lub w małej grupie. Matura, egzamin ósmoklasisty, FCE, CAE, Business English.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/img/mark-level-up.png", type: "image/png" }],
    apple: [{ url: "/img/mark-level-up.png" }],
  },
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

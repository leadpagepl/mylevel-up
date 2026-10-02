import { Site } from "@/components/Site";
import { faq } from "@/lib/faq";
import { exams, levels, site } from "@/lib/site";

// Stałe identyfikatory węzłów — pozwalają powiązać je ze sobą (i z profilem
// firmy), niezależnie od tego, w ilu miejscach się pojawią.
const ORGANIZATION_ID = `${site.siteUrl}/#organization`;
const WEBSITE_ID = `${site.siteUrl}/#website`;

/**
 * Dane strukturalne — wyłącznie informacje potwierdzone przez klienta.
 * Świadomie NIE dodajemy aggregateRating ani opinii do schema.org,
 * dopóki nie potwierdzimy aktualnych danych z profilu Google.
 */
const organizationLd = {
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  name: site.name,
  legalName: site.legalName,
  url: site.siteUrl,
  logo: `${site.siteUrl}/img/logo-level-up.png`,
  image: `${site.siteUrl}${site.ogImage}`,
  email: site.email,
  telephone: site.phoneHref.replace("tel:", ""),
  areaServed: [
    { "@type": "City", name: site.city },
    { "@type": "Country", name: "Polska" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: "PL",
  },
  // Tylko profile szkoły. site.googleMaps to na razie link do wyszukiwania
  // w Mapach (DO POTWIERDZENIA) — dodamy go po podmianie na adres wizytówki.
  sameAs: [site.instagram, site.facebook],
  founder: {
    "@type": "Person",
    name: site.teacher,
    jobTitle: "Lektor języka angielskiego, trener Business English",
  },
  knowsLanguage: ["pl", "en"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Kursy języka angielskiego online",
    itemListElement: [
      "Angielski konwersacyjny online",
      "Business English",
      ...exams.map((e) => `Przygotowanie: ${e}`),
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, serviceType: "Nauka języka angielskiego" },
    })),
  },
  description: `Angielski online na poziomach ${levels[0]}–${levels[levels.length - 1]}: zajęcia indywidualne i mini-grupy, przygotowanie do matury, egzaminu ósmoklasisty, FCE i CAE oraz Business English.`,
};

// Bez SearchAction — strona nie ma wyszukiwarki.
const websiteLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: site.siteUrl,
  name: site.name,
  inLanguage: "pl-PL",
  publisher: { "@id": ORGANIZATION_ID },
};

const faqLd = {
  "@type": "FAQPage",
  "@id": `${site.siteUrl}/#faq`,
  inLanguage: "pl-PL",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [websiteLd, organizationLd, faqLd],
};

/** JSON-LD do <script>: znak „<” jako sekwencja ucieczki, żeby żadna treść nie zamknęła znacznika. */
const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <Site />
    </>
  );
}

import { Site } from "@/components/Site";
import { faq } from "@/lib/faq";
import { exams, levels, site } from "@/lib/site";

/**
 * Dane strukturalne — wyłącznie informacje potwierdzone przez klienta.
 * Świadomie NIE dodajemy aggregateRating ani opinii do schema.org,
 * dopóki nie potwierdzimy aktualnych danych z profilu Google.
 */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  legalName: site.legalName,
  url: site.siteUrl,
  email: site.email,
  telephone: "+48695438993",
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
  sameAs: [site.instagram, site.facebook, site.googleMaps],
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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Site />
    </>
  );
}

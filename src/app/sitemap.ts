import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Data ostatniej istotnej zmiany treści strony głównej. Zmieniaj ją ręcznie
 * przy realnej zmianie treści — data ustawiana przy każdym buildzie byłaby
 * dla wyszukiwarek fałszywym sygnałem „strona się zmieniła”.
 */
const HOME_LAST_MODIFIED = "2026-10-02";

/**
 * Tylko strony przeznaczone do indeksowania. Polityka prywatności ma noindex,
 * więc jej tu nie ma; /api/* nie jest stroną.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.siteUrl}/`,
      lastModified: HOME_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

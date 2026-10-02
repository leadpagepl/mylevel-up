import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Cała strona jest dostępna dla robotów; wyłączony jest tylko techniczny
 * /api/. Polityka prywatności celowo NIE jest tu blokowana — robot musi ją
 * pobrać, żeby zobaczyć jej noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}

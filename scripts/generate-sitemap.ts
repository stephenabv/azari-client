/**
 * Build-time sitemap generator.
 * Run via: npx tsx scripts/generate-sitemap.ts
 * Invoked automatically from the build:ssg npm script.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = process.env.VITE_SITE_URL ?? "https://azarisolar.com";
const OUT_PATH = resolve(process.cwd(), "public", "sitemap.xml");
const LASTMOD = new Date().toISOString().split("T")[0];

interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

const INDEXABLE_ROUTES: SitemapEntry[] = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0" },
  { path: "/projects",          changefreq: "weekly",  priority: "0.9" },
  { path: "/packages",          changefreq: "monthly", priority: "0.8" },
  { path: "/quotation-engine",  changefreq: "monthly", priority: "0.8" },
  { path: "/client-journey",    changefreq: "monthly", priority: "0.7" },
];

function buildSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      ({ path, changefreq, priority }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

const xml = buildSitemap(INDEXABLE_ROUTES);
writeFileSync(OUT_PATH, xml, "utf-8");
console.log(`sitemap.xml written to ${OUT_PATH} (${INDEXABLE_ROUTES.length} URLs)`);

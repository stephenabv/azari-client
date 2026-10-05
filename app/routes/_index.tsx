import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { SiteContentProvider } from "../../src/context/SiteContentContext";
import type { SiteContentSnapshot } from "../../src/context/siteContent";
import ASDashboard from "../../src/pages/ASDashboard";
import { apiGet } from "../lib/api.server";
import { FAQ_SCHEMA } from "../lib/faq-schema";

export const meta: MetaFunction = () => [
  {
    title: "Azari Solar — Solar Panel Installer in Bohol, Philippines",
  },
  {
    name: "description",
    content:
      "Affordable solar packages and professional installation for homes & businesses in Tagbilaran, Bohol. Hybrid, grid-tie, and off-grid systems. Get a free quote.",
  },
  { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/" },
  { property: "og:title", content: "Azari Solar — Solar Panel Installer in Bohol, Philippines" },
  {
    property: "og:description",
    content:
      "Affordable solar packages and professional installation for homes and businesses in Bohol. Hybrid, grid-tie, and off-grid systems.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  {
    property: "og:image:alt",
    content: "Azari Solar — Solar Panel Installation in Bohol, Philippines",
  },
  { property: "og:locale", content: "en_PH" },
  { property: "og:site_name", content: "Azari Solar" },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Azari Solar — Solar Panel Installer in Bohol, Philippines",
  },
  {
    name: "twitter:description",
    content:
      "Affordable solar packages and professional installation for homes and businesses in Bohol, Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
  // FAQ structured data belongs on this page only, not the whole site.
  { "script:ld+json": FAQ_SCHEMA },
];

/**
 * The home page renders CMS content (stat counters, section visibility, copy)
 * on the server so the HTML carries the real figures. If the API is down the
 * page still renders with the built-in defaults and the browser fetches the
 * content itself, as before.
 */
export async function loader(): Promise<SiteContentSnapshot> {
  const result = await apiGet<SiteContentSnapshot>("/api/content");
  return result.status === "ok" ? result.data : {};
}

export default function Index() {
  const content = useLoaderData<typeof loader>();
  return (
    <SiteContentProvider content={content}>
      <ASDashboard />
    </SiteContentProvider>
  );
}

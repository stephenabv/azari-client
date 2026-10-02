import { localizedMeta } from "../lib/i18n-meta";
import type { LinksFunction } from "react-router";
import ASDashboard from "../../src/pages/ASDashboard";
import { FAQ_SCHEMA } from "../lib/faq-schema";

// Preload the hero video poster so the browser's preload scanner can fetch it
// immediately from the initial HTML, before JS hydrates and the <video> renders.
export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/preview.jpg",
    as: "image",
    fetchPriority: "high",
  } as ReturnType<LinksFunction>[number],
];

export const meta = localizedMeta((_args, t) => [
  { title: t("meta.home.title") },
  { name: "description", content: t("meta.home.description") },
  { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/" },
  { property: "og:title", content: t("meta.home.title") },
  { property: "og:description", content: t("meta.home.shareDescription") },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: t("meta.home.imageAlt") },
  { property: "og:locale", content: "en_PH" },
  { property: "og:site_name", content: "Azari Solar" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: t("meta.home.title") },
  { name: "twitter:description", content: t("meta.home.twitterDescription") },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
  // FAQ structured data belongs on this page only, not the whole site.
  { "script:ld+json": FAQ_SCHEMA },
]);

export default function Index() {
  return <ASDashboard />;
}

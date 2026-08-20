import type { LinksFunction, MetaFunction } from "react-router";
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

export default function Index() {
  return <ASDashboard />;
}

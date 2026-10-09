import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import type { SiteContentSnapshot } from "../../src/context/siteContent";
import type { MainLayoutLoaderData } from "../layouts/main-layout";
import ASDashboard from "../../src/pages/ASDashboard";
import type { FaqItem } from "../../src/models/faq";
import { apiGet } from "../lib/api.server";
import { JsonLdGraph } from "../lib/schema/json-ld";
import { FaqPageSchema } from "../lib/schema/page-schemas";

type HomeLoaderData = {
  /** Published FAQ entries; null when the API could not be reached. */
  faqs: FaqItem[] | null;
};

const MAIN_LAYOUT_ID = "layouts/main-layout";

/** The admin can hide the FAQ section; its structured data must go with it. */
function isFaqHidden(content: SiteContentSnapshot | undefined): boolean {
  const visibility = content?.["section-visibility"];
  return typeof visibility === "object" && visibility !== null && "faq" in visibility && visibility.faq === false;
}

/** FAQPage structured data, only when the page actually shows FAQ entries. */
function faqJsonLd(data: HomeLoaderData | undefined, content: SiteContentSnapshot | undefined) {
  if (!data?.faqs?.length || isFaqHidden(content)) return [];
  return [{ "script:ld+json": new JsonLdGraph([new FaqPageSchema(data.faqs)]).toObject() }];
}

export const meta: MetaFunction<typeof loader> = ({ loaderData, matches }) => [
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
  // The FAQ is shown on this page only, so its structured data lives here too.
  ...faqJsonLd(
    loaderData,
    (matches.find((match) => match?.id === MAIN_LAYOUT_ID)?.loaderData as MainLayoutLoaderData | undefined)?.content,
  ),
];

/**
 * The home page renders the published FAQ on the server so the HTML carries
 * the real content. CMS content (stat counters, section visibility, copy)
 * comes from the main layout's loader, which every page shares.
 */
export async function loader(): Promise<HomeLoaderData> {
  const faqs = await apiGet<FaqItem[]>("/api/faqs");
  return { faqs: faqs.status === "ok" && Array.isArray(faqs.data) ? faqs.data : null };
}

export default function Index() {
  const { faqs } = useLoaderData<typeof loader>();
  return <ASDashboard faqs={faqs} />;
}

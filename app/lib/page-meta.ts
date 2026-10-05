import type { MetaDescriptor } from "react-router";
import { SITE_PREVIEW_IMAGE, socialImageUrl } from "./seo";

export const SITE_ORIGIN = "https://azari.solar";

export type PageMetaInput = {
  title: string;
  description: string;
  /** Site-relative path, without a trailing slash (except "/"). */
  path: string;
  image?: unknown;
  ogType?: "website" | "article";
  robots?: string;
};

/**
 * The title, description, canonical, Open Graph and Twitter tags every
 * indexable page needs, built from one input so they cannot disagree.
 * The canonical is always the slash-free absolute URL nginx serves with 200.
 */
export class PageMeta {
  static canonicalUrl(path: string): string {
    const clean = path === "/" ? "/" : path.replace(/\/+$/, "");
    return `${SITE_ORIGIN}${clean}`;
  }

  static build({
    title,
    description,
    path,
    image,
    ogType = "website",
    robots = "index, follow",
  }: PageMetaInput): MetaDescriptor[] {
    const url = PageMeta.canonicalUrl(path);
    const imageUrl = image === undefined ? SITE_PREVIEW_IMAGE : socialImageUrl(image);
    return [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { tagName: "link", rel: "canonical", href: url },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: imageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ];
  }
}

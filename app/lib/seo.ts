/**
 * SEO helpers shared by route `meta` exports. This module must stay free of
 * server-only imports: `meta` runs on the client too, so React Router bundles
 * it for the browser.
 */

export const SITE_PREVIEW_IMAGE = "https://azari.solar/preview.jpg";

/**
 * Open Graph and Twitter image URLs have to be fetchable by a crawler.
 * Project images are stored as `data:image/webp;base64,...`, which no crawler
 * can resolve and which would inline the whole image into the document head,
 * so anything that is not an absolute http(s) URL falls back to the site
 * preview image.
 */
export function socialImageUrl(url: unknown): string {
  return typeof url === "string" && /^https?:\/\//i.test(url)
    ? url
    : SITE_PREVIEW_IMAGE;
}

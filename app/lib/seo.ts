/**
 * SEO helpers shared by route `meta` exports. This module must stay free of
 * server-only imports: `meta` runs on the client too, so React Router bundles
 * it for the browser.
 */

export const SITE_PREVIEW_IMAGE = "https://azari.solar/preview.jpg";

const SITE_ORIGIN = "https://azari.solar";

/** Server-relative image paths served by the API (see azari-service /api/media). */
const MEDIA_PATH = /^\/api\/media\/[A-Za-z0-9/_.-]+$/;

/**
 * Open Graph and Twitter image URLs have to be absolute and fetchable by a
 * crawler. Absolute http(s) URLs are used as is, and `/api/media/...` paths
 * are made absolute against the site. Anything else (a `data:` URL, which
 * would inline the whole image into the document head) falls back to the site
 * preview image.
 */
export function socialImageUrl(url: unknown): string {
  if (typeof url !== "string") return SITE_PREVIEW_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  if (MEDIA_PATH.test(url)) return `${SITE_ORIGIN}${url}`;
  return SITE_PREVIEW_IMAGE;
}

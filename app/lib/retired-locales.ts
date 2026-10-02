/**
 * URL prefixes of language versions the site no longer serves. Links to them
 * (bookmarks, search results, shared links) are permanently redirected to the
 * same page in English. Retiring or restoring a prefix is one entry here.
 */
export const RETIRED_LOCALE_PREFIXES = ["fil", "ceb", "ko", "ja", "ru", "zh"] as const;

/**
 * The English path for a request under a retired prefix: "/ko/packages?x=1"
 * becomes "/packages?x=1" and "/fil" becomes "/". Leading slashes are
 * collapsed so "/ko//evil.example" can never become a protocol-relative URL
 * pointing at another site.
 */
export function englishPathFor(url: URL): string {
  const [, , ...rest] = url.pathname.split("/");
  const path = `/${rest.join("/")}`.replace(/^\/+/, "/");
  return `${path}${url.search}`;
}

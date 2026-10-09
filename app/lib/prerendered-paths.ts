/**
 * Routes prerendered at build time. Only routes whose content does not come
 * from the database belong here: a prerendered route's loaders run once during
 * the build, so database-backed routes would serve whatever the admin console
 * had published at build time until the next deploy.
 */
export const PRERENDERED_PATHS: readonly string[] = [
  "/solar-calculator",
  "/privacy-policy",
  "/terms-and-conditions",
];

const prerendered = new Set(PRERENDERED_PATHS);

export function isPrerenderedPath(pathname: string): boolean {
  return prerendered.has(pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname);
}

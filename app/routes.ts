import {
  type RouteConfig,
  type RouteConfigEntry,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";
import { PREFIXED_LOCALES } from "../src/i18n/locales";

const ADMIN_PATH =
  (process.env["VITE_ADMIN_ROUTE"] ?? "").replace(/^\//, "") ||
  "ops-console-a9f4c31e";

/**
 * Public pages. English is served at the root (existing URLs unchanged);
 * every other locale in src/i18n/locales.ts gets the same pages under its
 * prefix, e.g. /fil/packages. Route ids must be unique, so localized copies
 * are namespaced by locale code.
 */
function sitePages(localeCode?: string): RouteConfigEntry[] {
  const id = (name: string): { id?: string } => (localeCode ? { id: `${localeCode}:${name}` } : {});
  return [
    index("routes/_index.tsx", id("index")),
    route("projects", "routes/projects._index.tsx", id("projects")),
    route("projects/:id", "routes/projects.$id.tsx", id("project")),
    route("packages", "routes/packages.tsx", id("packages")),
    route("solar-calculator", "routes/solar-calculator.tsx", id("solar-calculator")),
    route("client-journey", "routes/client-journey.tsx", id("client-journey")),
    route("privacy-policy", "routes/privacy-policy.tsx", id("privacy-policy")),
    route("terms-and-conditions", "routes/terms-and-conditions.tsx", id("terms-and-conditions")),
    route("*", "routes/$.tsx", id("not-found")),
  ];
}

export default [
  layout("layouts/main-layout.tsx", [
    route("sitemap.xml", "routes/sitemap-xml.tsx"),
    ...sitePages(),
    ...PREFIXED_LOCALES.flatMap((locale) => prefix(locale.code, sitePages(locale.code))),
  ]),
  route(ADMIN_PATH, "routes/admin.tsx"),
] satisfies RouteConfig;

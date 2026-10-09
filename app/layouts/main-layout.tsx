import { useLoaderData, type LoaderFunctionArgs, type ShouldRevalidateFunction } from "react-router";
import ASMainLayout from "../../src/layout/ASMainLayout";
import { SiteContentProvider } from "../../src/context/SiteContentContext";
import type { SiteContentSnapshot } from "../../src/context/siteContent";
import type { ContentKey } from "../../src/services/ASContent";
import { apiGet } from "../lib/api.server";
import { isPrerenderedPath } from "../lib/prerendered-paths";

export type MainLayoutLoaderData = { content: SiteContentSnapshot };

/**
 * Long documents only read when a visitor opens them (the legal modal fetches
 * them on demand), so they stay out of every page's HTML.
 */
const ON_DEMAND_CONTENT_KEYS: ReadonlySet<ContentKey> = new Set(["privacyPolicy", "termsConditions"]);

/**
 * CMS content for every page under the main layout, fetched once on the
 * server. Navbar, footer and page sections read it through useContent, so a
 * page view no longer costs the visitor's browser one API call per section
 * (each of which counts against the service's per-visitor rate limit). If the
 * API is down the snapshot is empty and components fetch for themselves.
 *
 * Prerendered pages get an empty snapshot: their loaders run once at build
 * time, and baking CMS content into them would serve it stale until the next
 * deploy.
 */
export async function loader({ request }: LoaderFunctionArgs): Promise<MainLayoutLoaderData> {
  if (isPrerenderedPath(new URL(request.url).pathname)) return { content: {} };
  const result = await apiGet<SiteContentSnapshot>("/api/content");
  if (result.status !== "ok") return { content: {} };
  const content = Object.fromEntries(
    Object.entries(result.data).filter(([key]) => !ON_DEMAND_CONTENT_KEYS.has(key as ContentKey)),
  ) as SiteContentSnapshot;
  return { content };
}

/**
 * Content is read once per visit and reused across client-side navigation,
 * except when leaving a prerendered page, whose snapshot is empty.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl }) =>
  isPrerenderedPath(currentUrl.pathname) && !isPrerenderedPath(nextUrl.pathname);

export default function MainLayoutRoute() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <SiteContentProvider content={content}>
      <ASMainLayout />
    </SiteContentProvider>
  );
}

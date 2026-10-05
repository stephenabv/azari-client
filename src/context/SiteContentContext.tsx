import type { ReactNode } from "react";
import { SiteContentContext, type SiteContentSnapshot } from "./siteContent";

/**
 * Seeds `useContent` with content the server already fetched, so the first
 * render (on the server and at hydration) shows the real CMS values instead
 * of the built-in defaults.
 */
export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContentSnapshot;
  children: ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

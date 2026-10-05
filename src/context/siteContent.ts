import { createContext, useContext } from "react";
import type { ContentKey } from "../services/ASContent";

/** CMS content resolved by a route loader, keyed like the /api/content map. */
export type SiteContentSnapshot = Partial<Record<ContentKey, unknown>>;

export const SiteContentContext = createContext<SiteContentSnapshot>({});

export function useSiteContentSnapshot(): SiteContentSnapshot {
  return useContext(SiteContentContext);
}

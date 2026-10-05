import { useEffect, useState } from "react";
import { useSiteContentSnapshot } from "../context/siteContent";
import { fetchContent, type ContentKey } from "../services/ASContent";

/**
 * CMS content for `key`. When a route loader already supplied it through
 * SiteContentProvider, that value is used from the first render and no
 * request is made; otherwise the default renders until the fetch resolves.
 */
export function useContent<T>(key: ContentKey, defaultValue: T): T {
  const prefetched = useSiteContentSnapshot()[key] as T | undefined;
  // Pinned so callers passing an inline default still get a stable reference.
  const [fallback] = useState<T>(defaultValue);
  const [fetched, setFetched] = useState<T | null>(null);

  useEffect(() => {
    if (prefetched != null) return;

    let cancelled = false;

    fetchContent<T>(key).then((data) => {
      if (!cancelled && data != null) {
        setFetched(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [key, prefetched]);

  return prefetched ?? fetched ?? fallback;
}

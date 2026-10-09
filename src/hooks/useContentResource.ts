import { useCallback, useEffect, useState } from "react";
import { useSiteContentSnapshot } from "../context/siteContent";
import { fetchContent, type ContentKey } from "../services/ASContent";

type ContentState<T> =
  | { status: "loading"; data: null }
  | { status: "ready"; data: T }
  | { status: "error"; data: null };

export type ContentResource<T> = ContentState<T> & {
  /** Discards a failed or stale result and requests the content again. */
  reload: () => void;
};

/**
 * CMS content for `key` with its load state, for views that must tell
 * "not loaded yet" apart from "failed" (useContent renders a default for
 * both). A value a route loader already supplied is used without a request.
 * Pass `enabled: false` to defer the request until the content is needed.
 */
export function useContentResource<T>(
  key: ContentKey,
  { enabled = true }: { enabled?: boolean } = {},
): ContentResource<T> {
  const prefetched = useSiteContentSnapshot()[key] as T | undefined;
  const [fetched, setFetched] = useState<{ key: ContentKey; resource: ContentState<T> } | null>(null);
  const reload = useCallback(() => setFetched(null), []);

  useEffect(() => {
    if (!enabled || prefetched != null) return;
    // One request per key: a failure is shown rather than retried in a loop.
    if (fetched?.key === key) return;

    let cancelled = false;

    fetchContent<T>(key).then((data) => {
      if (cancelled) return;
      setFetched({
        key,
        resource: data != null ? { status: "ready", data } : { status: "error", data: null },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, key, prefetched, fetched]);

  if (prefetched != null) return { status: "ready", data: prefetched, reload };
  if (fetched?.key === key) return { ...fetched.resource, reload };
  return { status: "loading", data: null, reload };
}

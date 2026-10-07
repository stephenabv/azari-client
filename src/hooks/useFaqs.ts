import { useEffect, useState } from "react";
import type { FaqItem } from "../models/faq";
import { PublicFaqClient } from "../services/faq/FaqClients";

const client = new PublicFaqClient();

/**
 * Published FAQ entries. When the route loader already fetched them they are
 * used from the first render; when the loader could not reach the API
 * (`initial` is null) the browser fetches them itself, like useContent does.
 */
export function useFaqs(initial: readonly FaqItem[] | null): readonly FaqItem[] {
  const [fetched, setFetched] = useState<readonly FaqItem[] | null>(null);

  useEffect(() => {
    if (initial !== null) return;
    let cancelled = false;
    void client.listPublished().then((faqs) => {
      if (!cancelled && faqs) setFetched(faqs);
    });
    return () => {
      cancelled = true;
    };
  }, [initial]);

  return initial ?? fetched ?? [];
}

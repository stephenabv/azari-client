import { useEffect, useState } from "react";
import { fetchContent, type ContentKey } from "../services/ASContent";

/**
 * Fetches a single site-content key from the backend.
 * Falls back to the provided `defaultValue` if the request fails or the key
 * is not yet set in the CMS.
 */
export function useContent<T>(key: ContentKey, defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let cancelled = false;

    fetchContent<T>(key).then((data) => {
      if (!cancelled && data != null) {
        setValue(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return value;
}

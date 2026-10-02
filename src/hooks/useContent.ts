import { useEffect, useState } from "react";
import { useLocale } from "../i18n/hooks";
import { fetchContent, LOCALIZABLE_CONTENT_KEYS, type ContentKey } from "../services/ASContent";


export function useContent<T>(key: ContentKey, defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);
  const localeTag = useLocale().tag;
  const requestLocale = LOCALIZABLE_CONTENT_KEYS.has(key) ? localeTag : undefined;

  useEffect(() => {
    let cancelled = false;

    fetchContent<T>(key, requestLocale).then((data) => {
      if (!cancelled && data != null) {
        setValue(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [key, requestLocale]);

  return value;
}

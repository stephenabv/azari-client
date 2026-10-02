import { useEffect, useState } from "react";
import { fetchContent, type ContentKey } from "../services/ASContent";


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

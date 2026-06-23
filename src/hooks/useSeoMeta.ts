import { useEffect } from "react";

const BASE_TITLE = "Azari Solar";
const BASE_URL   = "https://azari.solar";

interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
}

export function useSeoMeta({ title, description, canonical }: SeoMeta) {
  useEffect(() => {
    const fullTitle = title === BASE_TITLE ? title : `${title} | ${BASE_TITLE}`;
    document.title = fullTitle;

    if (description) {
      let el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.name = "description";
        document.head.appendChild(el);
      }
      el.content = description;
    }

    const canon = canonical ?? `${BASE_URL}${window.location.pathname}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canon;

    return () => {
      document.title = `${BASE_TITLE} | Clean & Renewable Energy Solutions`;
    };
  }, [title, description, canonical]);
}

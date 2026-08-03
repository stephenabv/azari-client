import { useEffect } from "react";

const BRAND     = "Azari Solar";
const BASE_URL  = "https://azari.solar";

interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [attrName, attrValue] = attr.split("=");
    (el as HTMLMetaElement)[attrName as "name"] = attrValue;
    document.head.appendChild(el);
  }
  el.content = value;
}

export function useSeoMeta({ title, description, canonical }: SeoMeta) {
  useEffect(() => {
    const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
    const canon     = canonical ?? `${BASE_URL}${window.location.pathname}`;

    document.title = fullTitle;

    if (description) {
      setMeta('meta[name="description"]',          'name=description',       description);
      setMeta('meta[property="og:description"]',   'property=og:description', description);
      setMeta('meta[name="twitter:description"]',  'name=twitter:description', description);
    }

    setMeta('meta[property="og:title"]',  'property=og:title',  fullTitle);
    setMeta('meta[property="og:url"]',    'property=og:url',    canon);
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', fullTitle);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canon;

    return () => {
      document.title = `${BRAND} — Solar Panel Installer in Bohol, Philippines`;
    };
  }, [title, description, canonical]);
}

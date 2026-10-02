/**
 * Locale-aware route `meta`. Runs on server and client, so it must stay free
 * of server-only imports.
 *
 * Every public route wraps its meta with `localizedMeta`, which:
 * - points canonical / og:url at the current locale's URL (a translated page
 *   is its own canonical, not the English one),
 * - sets og:locale,
 * - adds hreflang alternates for every locale plus x-default.
 */
import type { MetaArgs, MetaDescriptor, MetaFunction } from "react-router";
import { DEFAULT_LOCALE, LOCALES, LocalePath, translatorFor, type LocaleDefinition } from "../../src/i18n";
import type { TranslationService } from "../../src/i18n/TranslationService";

const SITE_ORIGIN = "https://azari.solar";

type Translate = TranslationService["t"];

function localizeUrl(href: string, locale: LocaleDefinition): string {
  if (!href.startsWith(SITE_ORIGIN)) return href;
  const url = new URL(href);
  return `${SITE_ORIGIN}${LocalePath.of(url.pathname, locale).toString()}${url.search}`;
}

function alternates(path: string): MetaDescriptor[] {
  const href = (locale: LocaleDefinition) => `${SITE_ORIGIN}${LocalePath.of(path, locale).toString()}`;
  return [
    ...LOCALES.map((locale) => ({ tagName: "link", rel: "alternate", hrefLang: locale.tag, href: href(locale) })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: href(DEFAULT_LOCALE) },
  ];
}

export function localizedMeta<Loader = unknown>(
  build: (args: MetaArgs<Loader>, t: Translate) => MetaDescriptor[],
): MetaFunction<Loader> {
  return (args) => {
    const { locale, path } = LocalePath.parse(args.location.pathname);
    const translator = translatorFor(locale.code);
    const t: Translate = (key, params) => translator.t(key, params);
    const entries = build(args as MetaArgs<Loader>, t);

    const isIndexable = entries.some((e) => "rel" in e && e.rel === "canonical");
    const localized = entries.map((entry): MetaDescriptor => {
      if ("rel" in entry && entry.rel === "canonical" && typeof entry.href === "string") {
        return { ...entry, href: localizeUrl(entry.href, locale) };
      }
      if ("property" in entry && entry.property === "og:url" && typeof entry.content === "string") {
        return { ...entry, content: localizeUrl(entry.content, locale) };
      }
      if ("property" in entry && entry.property === "og:locale") {
        return { ...entry, content: locale.ogLocale };
      }
      return entry;
    });

    const hasOgLocale = localized.some((e) => "property" in e && e.property === "og:locale");
    return [
      ...localized,
      ...(isIndexable && !hasOgLocale ? [{ property: "og:locale", content: locale.ogLocale }] : []),
      ...(isIndexable ? alternates(path) : []),
    ];
  };
}

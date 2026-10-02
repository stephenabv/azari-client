import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, findLocale, type LocaleDefinition } from "../../i18n/locales";
import { LOCALIZABLE_CONTENT_KEYS } from "../../services/ASContent";

/** The language the admin content editors read and write. English by default. */
export const AdminContentLocaleContext = createContext<LocaleDefinition>(DEFAULT_LOCALE);

export function useAdminContentLocale(): LocaleDefinition {
  return useContext(AdminContentLocaleContext);
}

/**
 * The locale tag to send for a content key, or undefined for English and for
 * keys that are not per-language (visibility flags, brand logos), so those
 * requests stay exactly as before.
 */
export function useContentLocaleTag(contentKey: string): string | undefined {
  const locale = useAdminContentLocale();
  if (locale === DEFAULT_LOCALE || !LOCALIZABLE_CONTENT_KEYS.has(contentKey)) return undefined;
  return locale.tag;
}

export function parseAdminLocale(code: string | null): LocaleDefinition {
  return findLocale(code) ?? DEFAULT_LOCALE;
}

import { DEFAULT_LOCALE, findLocale, type LocaleDefinition } from "./locales";

const COOKIE = "locale";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * The visitor's explicit language choice, kept in a first-party cookie so a
 * returning visitor who lands on an English URL is sent to their language.
 * Only set when they pick a language; never inferred from headers, so
 * crawlers always see the URL's own language.
 */
export const LocalePreference = {
  read(): LocaleDefinition | undefined {
    if (typeof document === "undefined") return undefined;
    const match = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(document.cookie);
    return findLocale(match ? decodeURIComponent(match[1]!) : undefined);
  },

  save(locale: LocaleDefinition): void {
    if (typeof document === "undefined") return;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(locale.code)}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
  },

  isDefault(locale: LocaleDefinition | undefined): boolean {
    return !locale || locale === DEFAULT_LOCALE;
  },
};

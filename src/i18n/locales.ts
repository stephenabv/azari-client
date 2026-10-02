/**
 * Supported site languages. This registry drives routing (URL prefixes),
 * the footer language switcher, <html lang>, hreflang links and content
 * requests. To add a language: add a messages file and one entry here.
 *
 * Kept free of React and browser APIs: app/routes.ts imports it at build time.
 */
export interface LocaleDefinition {
  /** URL prefix and messages key, e.g. "fil" -> /fil/packages. */
  readonly code: string;
  /** BCP 47 tag for <html lang>, hreflang and the content API. */
  readonly tag: string;
  /** Open Graph locale. */
  readonly ogLocale: string;
  /** Name shown in the switcher, in the language itself. */
  readonly nativeName: string;
  /** Number/currency formatting locale. */
  readonly numberFormat: string;
}

export const DEFAULT_LOCALE_CODE = "en";

export const LOCALES: readonly LocaleDefinition[] = [
  { code: "en", tag: "en-PH", ogLocale: "en_PH", nativeName: "English", numberFormat: "en-PH" },
  { code: "fil", tag: "fil", ogLocale: "fil_PH", nativeName: "Filipino", numberFormat: "fil-PH" },
  { code: "ceb", tag: "ceb", ogLocale: "ceb_PH", nativeName: "Cebuano", numberFormat: "en-PH" },
  { code: "ko", tag: "ko", ogLocale: "ko_KR", nativeName: "한국어", numberFormat: "en-PH" },
  { code: "ja", tag: "ja", ogLocale: "ja_JP", nativeName: "日本語", numberFormat: "en-PH" },
  { code: "ru", tag: "ru", ogLocale: "ru_RU", nativeName: "Русский", numberFormat: "en-PH" },
  { code: "zh", tag: "zh-Hans", ogLocale: "zh_CN", nativeName: "简体中文", numberFormat: "en-PH" },
];

const BY_CODE = new Map(LOCALES.map((l) => [l.code, l]));

export const DEFAULT_LOCALE: LocaleDefinition = BY_CODE.get(DEFAULT_LOCALE_CODE)!;

/** Locales served under a URL prefix (every locale except the default). */
export const PREFIXED_LOCALES: readonly LocaleDefinition[] = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE_CODE);

export function findLocale(code: string | null | undefined): LocaleDefinition | undefined {
  return code ? BY_CODE.get(code) : undefined;
}

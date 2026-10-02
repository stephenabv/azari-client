import { DEFAULT_LOCALE, findLocale, type LocaleDefinition } from "./locales";

/**
 * Converts between locale-prefixed URLs (/fil/packages) and the
 * locale-neutral paths the app's routes and links are written against
 * (/packages). The default locale is never prefixed, so existing English
 * URLs are unchanged.
 */
export class LocalePath {
  private constructor(
    readonly locale: LocaleDefinition,
    /** Path without the locale prefix; always starts with "/". */
    readonly path: string,
  ) {}

  static parse(pathname: string): LocalePath {
    const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
    const locale = findLocale(match?.[1]);
    if (match && locale && locale !== DEFAULT_LOCALE) {
      return new LocalePath(locale, match[2] || "/");
    }
    return new LocalePath(DEFAULT_LOCALE, pathname || "/");
  }

  static of(path: string, locale: LocaleDefinition): LocalePath {
    return new LocalePath(locale, path.startsWith("/") ? path : `/${path}`);
  }

  withLocale(locale: LocaleDefinition): LocalePath {
    return new LocalePath(locale, this.path);
  }

  /** The URL path to link to, e.g. "/fil/packages" or "/packages". */
  toString(): string {
    if (this.locale === DEFAULT_LOCALE) return this.path;
    return this.path === "/" ? `/${this.locale.code}` : `/${this.locale.code}${this.path}`;
  }
}

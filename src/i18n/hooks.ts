import { useContext, useMemo } from "react";
import { useNavigate, type NavigateOptions } from "react-router";
import { LocaleContext } from "./LocaleContext";
import { LocalePath } from "./LocalePath";
import { DEFAULT_LOCALE, type LocaleDefinition } from "./locales";
import type { TranslationService } from "./TranslationService";

export function useLocale(): LocaleDefinition {
  return useContext(LocaleContext).locale;
}

/** The current path with the locale prefix removed, e.g. "/packages" for "/fil/packages". */
export function useNeutralPath(): string {
  return useContext(LocaleContext).path;
}

export function useT(): TranslationService["t"] {
  const { translator } = useContext(LocaleContext);
  return useMemo(() => translator.t.bind(translator), [translator]);
}

/**
 * Maps a locale-neutral app path ("/packages") to the active locale's URL
 * ("/fil/packages"). Anything that is not a same-site absolute path (external
 * URLs, "#anchors", "//host") or that already carries a prefix is returned as is.
 */
export function useLocalizedPath(): (path: string) => string {
  const locale = useLocale();
  return useMemo(() => (path: string) => {
    if (!path.startsWith("/") || path.startsWith("//")) return path;
    if (LocalePath.parse(path).locale !== DEFAULT_LOCALE) return path;
    return LocalePath.of(path, locale).toString();
  }, [locale]);
}

/** `useNavigate` for app paths: string targets are localized, history steps (-1) pass through. */
export function useLocalizedNavigate(): (to: string | number, options?: NavigateOptions) => void {
  const navigate = useNavigate();
  const localize = useLocalizedPath();
  return useMemo(() => (to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") void navigate(to);
    else void navigate(localize(to), options);
  }, [navigate, localize]);
}

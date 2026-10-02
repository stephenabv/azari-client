import { useMemo, type ReactNode } from "react";
import { useLocation } from "react-router";
import { LocaleContext, type LocaleContextValue } from "./LocaleContext";
import { LocalePath } from "./LocalePath";
import { translatorFor } from "./translator";

/** Derives the active locale from the URL prefix; the URL is the single source of truth. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const parsed = LocalePath.parse(pathname);
  const code = parsed.locale.code;

  const value = useMemo<LocaleContextValue>(
    () => ({ locale: parsed.locale, path: parsed.path, translator: translatorFor(code) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code, parsed.path],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

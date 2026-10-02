import { createContext } from "react";
import { DEFAULT_LOCALE, type LocaleDefinition } from "./locales";
import { translatorFor } from "./translator";
import type { TranslationService } from "./TranslationService";

export interface LocaleContextValue {
  locale: LocaleDefinition;
  /** Current path without the locale prefix. */
  path: string;
  translator: TranslationService;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  path: "/",
  translator: translatorFor(DEFAULT_LOCALE.code),
});

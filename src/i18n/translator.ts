import { DEFAULT_LOCALE_CODE } from "./locales";
import { en, MESSAGES } from "./messages";
import { TranslationService } from "./TranslationService";

const cache = new Map<string, TranslationService>();

/** Shared, immutable translator per locale; usable outside React (route meta). */
export function translatorFor(code: string): TranslationService {
  let service = cache.get(code);
  if (!service) {
    service = new TranslationService(MESSAGES[code] ?? MESSAGES[DEFAULT_LOCALE_CODE] ?? en, en);
    cache.set(code, service);
  }
  return service;
}

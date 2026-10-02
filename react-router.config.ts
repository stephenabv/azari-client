import type { Config } from "@react-router/dev/config";
import { LOCALES, LocalePath } from "./src/i18n/routing";

/** Pages whose content does not come from the database (see note below). */
const STATIC_PAGES = ["/", "/solar-calculator", "/privacy-policy", "/terms-and-conditions"];

export default {
  ssr: true,
  // Prerendered at build time. Only routes whose content does not come from the
  // database belong here — a prerendered route's loader runs once during the
  // build, so /projects, /packages and /client-journey are server-rendered per
  // request instead. They would otherwise serve whatever the admin console had
  // published at build time until the next deploy.
  // Every locale's copy of these pages is prerendered too.
  async prerender() {
    return LOCALES.flatMap((locale) =>
      STATIC_PAGES.map((path) => LocalePath.of(path, locale).toString()),
    );
  },
} satisfies Config;

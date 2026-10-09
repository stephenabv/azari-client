import type { Config } from "@react-router/dev/config";
import { PRERENDERED_PATHS } from "./app/lib/prerendered-paths";

export default {
  ssr: true,
  // Prerendered at build time; see app/lib/prerendered-paths.ts for which
  // routes qualify. The home page's stat counters once rendered as 0 because a
  // database-backed route was prerendered while the API was unreachable from
  // the CI build.
  async prerender() {
    return [...PRERENDERED_PATHS];
  },
} satisfies Config;

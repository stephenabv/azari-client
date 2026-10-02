import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Prerendered at build time. Only routes whose content does not come from the
  // database belong here — a prerendered route's loader runs once during the
  // build, so /projects, /packages and /client-journey are server-rendered per
  // request instead. They would otherwise serve whatever the admin console had
  // published at build time until the next deploy.
  async prerender() {
    return [
      "/",
      "/solar-calculator",
      "/privacy-policy",
      "/terms-and-conditions",
    ];
  },
} satisfies Config;

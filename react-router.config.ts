import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return [
      "/",
      "/packages",
      "/projects",
      "/solar-calculator",
      "/client-journey",
      "/privacy-policy",
      "/terms-and-conditions",
    ];
  },
} satisfies Config;

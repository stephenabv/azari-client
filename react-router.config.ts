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
    ];
  },
} satisfies Config;

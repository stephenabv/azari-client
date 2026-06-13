export type RobotsDirective = "index,follow" | "noindex,nofollow" | "noindex,follow" | "index,nofollow";

export interface OpenGraphMeta {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  url?: string;
}

export interface TwitterCardMeta {
  card?: "summary" | "summary_large_image";
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  robots: RobotsDirective;
  og?: OpenGraphMeta;
  twitter?: TwitterCardMeta;
  jsonLd?: Record<string, unknown>[];
}

export const DEFAULT_SITE_META: Omit<PageMeta, "title" | "description"> = {
  robots: "noindex,nofollow",
};

export const SITE_NAME = "Azari Solar";
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://azarisolar.com";

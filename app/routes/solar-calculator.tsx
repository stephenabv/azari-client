import { localizedMeta } from "../lib/i18n-meta";
import "../../src/assets/styles/contents/as_quotation.less";
import ASQuotationEngine from "../../src/components/ASQuotationEngine";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.solarCalculator.title") },
  {
    name: "description",
    content: t("system.meta.solarCalculator.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/solar-calculator" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/solar-calculator" },
  { property: "og:title", content: t("system.meta.solarCalculator.title") },
  {
    property: "og:description",
    content: t("system.meta.solarCalculator.description"),
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: t("system.meta.solarCalculator.title") },
  {
    name: "twitter:description",
    content: t("system.meta.solarCalculator.description"),
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
]);

export default function SolarCalculator() {
  return <ASQuotationEngine />;
}

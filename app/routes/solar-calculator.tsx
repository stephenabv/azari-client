import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_quotation.less";
import ASQuotationEngine from "../../src/components/ASQuotationEngine";

export const meta: MetaFunction = () => [
  { title: "Free Solar Savings Calculator — Bohol, Philippines | Azari Solar" },
  {
    name: "description",
    content:
      "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/solar-calculator" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/solar-calculator" },
  { property: "og:title", content: "Free Solar Savings Calculator — Bohol, Philippines | Azari Solar" },
  {
    property: "og:description",
    content:
      "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Free Solar Savings Calculator — Bohol, Philippines | Azari Solar" },
  {
    name: "twitter:description",
    content:
      "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export default function SolarCalculator() {
  return <ASQuotationEngine />;
}

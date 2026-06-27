import type { MetaFunction } from "react-router";
import ASQuotationEngine from "../../src/components/ASQuotationEngine";

export const meta: MetaFunction = () => [
  { title: "Solar Savings Calculator — Azari Solar" },
  {
    name: "description",
    content:
      "Use our free solar savings calculator to estimate how much you can save on electricity bills with a solar system. Get a personalized quote for your home or business.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/solar-calculator" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/solar-calculator" },
  { property: "og:title", content: "Solar Savings Calculator — Azari Solar" },
  {
    property: "og:description",
    content:
      "Estimate your solar savings and get a personalized quote for your home or business in Bohol, Philippines.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Solar Savings Calculator — Azari Solar" },
  {
    name: "twitter:description",
    content:
      "Estimate your solar savings and get a personalized quote for your home or business in Bohol, Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export default function SolarCalculator() {
  return <ASQuotationEngine />;
}

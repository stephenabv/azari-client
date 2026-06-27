import type { MetaFunction } from "react-router";
import ASClientJourneyPage from "../../src/pages/ASClientJourneyPage";

export const meta: MetaFunction = () => [
  { title: "Your Solar Journey — Azari Solar" },
  {
    name: "description",
    content:
      "Learn how Azari Solar guides you through every step of your solar journey — from consultation and design to installation and commissioning.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/client-journey" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/client-journey" },
  { property: "og:title", content: "Your Solar Journey — Azari Solar" },
  {
    property: "og:description",
    content:
      "Learn how Azari Solar guides you from consultation to installation.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Your Solar Journey — Azari Solar" },
  {
    name: "twitter:description",
    content: "Learn how Azari Solar guides you from consultation to installation.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export default function ClientJourney() {
  return <ASClientJourneyPage />;
}

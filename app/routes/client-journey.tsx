import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import type { ApiJourneyStep } from "../../src/services/ASContent";
import { apiGetList } from "../lib/api.server";
import "../../src/assets/styles/contents/as_client_journey_page.less";
import ASClientJourneyPage from "../../src/pages/ASClientJourneyPage";

export const meta: MetaFunction = () => [
  { title: "Solar Installation Process in Bohol | Azari Solar" },
  {
    name: "description",
    content:
      "Learn how Azari Solar guides you from consultation to installation in Bohol. Transparent process, quality components, and full after-sales support across the Philippines.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/client-journey" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/client-journey" },
  { property: "og:title", content: "Solar Installation Process in Bohol | Azari Solar" },
  {
    property: "og:description",
    content:
      "Learn how Azari Solar guides you from consultation to installation in Bohol. Transparent process, quality components, and full after-sales support across the Philippines.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Solar Installation Process in Bohol | Azari Solar" },
  {
    name: "twitter:description",
    content: "Learn how Azari Solar guides you from consultation to installation in Bohol. Transparent process, quality components, and full after-sales support across the Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export async function loader() {
  return apiGetList<ApiJourneyStep>("/api/client-journey");
}

export default function ClientJourney() {
  const steps = useLoaderData<typeof loader>();
  return <ASClientJourneyPage initialSteps={steps} />;
}

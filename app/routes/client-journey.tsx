import { localizedMeta } from "../lib/i18n-meta";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { ApiJourneyStep } from "../../src/services/ASContent";
import { apiGetList, localizedApiPath } from "../lib/api.server";
import "../../src/assets/styles/contents/as_client_journey_page.less";
import ASClientJourneyPage from "../../src/pages/ASClientJourneyPage";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.clientJourney.title") },
  {
    name: "description",
    content: t("system.meta.clientJourney.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/client-journey" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/client-journey" },
  { property: "og:title", content: t("system.meta.clientJourney.title") },
  {
    property: "og:description",
    content: t("system.meta.clientJourney.description"),
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: t("system.meta.clientJourney.title") },
  {
    name: "twitter:description",
    content: t("system.meta.clientJourney.description"),
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
]);

export async function loader({ request }: LoaderFunctionArgs) {
  return apiGetList<ApiJourneyStep>(localizedApiPath("/api/client-journey", request));
}

export default function ClientJourney() {
  const steps = useLoaderData<typeof loader>();
  return <ASClientJourneyPage initialSteps={steps} />;
}

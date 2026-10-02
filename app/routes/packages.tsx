import { localizedMeta } from "../lib/i18n-meta";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { ApiSolarPackage } from "../../src/services/ASContent";
import { apiGetList, localizedApiPath } from "../lib/api.server";
import "../../src/assets/styles/contents/as_packages.less";
import "../../src/assets/styles/contents/as_package_inquiry.less";
import "../../src/assets/styles/contents/as_quotation.less";
import ASPackages from "../../src/pages/ASPackages";

export const meta = localizedMeta((_args, t) => [
  { title: t("meta.packages.title") },
  {
    name: "description",
    content: t("meta.packages.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/packages" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/packages" },
  { property: "og:title", content: t("meta.packages.title") },
  {
    property: "og:description",
    content: t("meta.packages.description"),
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: t("meta.packages.title") },
  {
    name: "twitter:description",
    content: t("meta.packages.description"),
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
]);

export async function loader({ request }: LoaderFunctionArgs) {
  return apiGetList<ApiSolarPackage>(localizedApiPath("/api/packages", request));
}

export default function Packages() {
  const packages = useLoaderData<typeof loader>();
  return <ASPackages initialPackages={packages} />;
}

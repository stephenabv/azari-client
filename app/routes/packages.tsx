import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import type { ApiSolarPackage } from "../../src/services/ASContent";
import { apiGetList } from "../lib/api.server";
import "../../src/assets/styles/contents/as_packages.less";
import "../../src/assets/styles/contents/as_package_inquiry.less";
import "../../src/assets/styles/contents/as_quotation.less";
import ASPackages from "../../src/pages/ASPackages";

export const meta: MetaFunction = () => [
  { title: "Affordable Solar Packages in Bohol, Philippines | Azari Solar" },
  {
    name: "description",
    content:
      "Browse affordable residential & commercial solar packages in Bohol. Hybrid, grid-tie & off-grid systems with full installation — single & three phase available.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/packages" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/packages" },
  { property: "og:title", content: "Affordable Solar Packages in Bohol, Philippines | Azari Solar" },
  {
    property: "og:description",
    content:
      "Browse affordable residential & commercial solar packages in Bohol. Hybrid, grid-tie & off-grid systems with full installation — single & three phase available.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Affordable Solar Packages in Bohol, Philippines | Azari Solar" },
  {
    name: "twitter:description",
    content:
      "Browse affordable residential & commercial solar packages in Bohol. Hybrid, grid-tie & off-grid systems with full installation — single & three phase available.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export async function loader() {
  return apiGetList<ApiSolarPackage>("/api/packages");
}

export default function Packages() {
  const packages = useLoaderData<typeof loader>();
  return <ASPackages initialPackages={packages} />;
}

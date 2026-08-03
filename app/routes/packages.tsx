import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_packages.less";
import "../../src/assets/styles/contents/as_package_inquiry.less";
import "../../src/assets/styles/contents/as_quotation.less";
import ASPackages from "../../src/pages/ASPackages";

export const meta: MetaFunction = () => [
  { title: "Solar Packages — Azari Solar" },
  {
    name: "description",
    content:
      "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines. Professional supply-and-install at competitive prices.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/packages" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/packages" },
  { property: "og:title", content: "Solar Packages — Azari Solar" },
  {
    property: "og:description",
    content:
      "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Solar Packages — Azari Solar" },
  {
    name: "twitter:description",
    content:
      "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export default function Packages() {
  return <ASPackages />;
}

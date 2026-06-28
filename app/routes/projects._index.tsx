import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_projects.less";
import ASProjects from "../../src/components/ASProjects";

export const meta: MetaFunction = () => [
  { title: "Solar Installation Projects — Azari Solar" },
  {
    name: "description",
    content:
      "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines. See real projects with system specs and performance data.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/projects" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/projects" },
  { property: "og:title", content: "Solar Installation Projects — Azari Solar" },
  {
    property: "og:description",
    content:
      "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Solar Installation Projects — Azari Solar" },
  {
    name: "twitter:description",
    content:
      "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

export default function Projects() {
  return <ASProjects />;
}

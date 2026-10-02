import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import type { ApiProject } from "../../src/services/ASContent";
import { apiGetList } from "../lib/api.server";
import "../../src/assets/styles/contents/as_projects.less";
import ASProjects from "../../src/components/ASProjects";

export const meta: MetaFunction = () => [
  { title: "Solar Projects in Bohol, Philippines | Azari Solar" },
  {
    name: "description",
    content:
      "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/projects" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/projects" },
  { property: "og:title", content: "Solar Projects in Bohol, Philippines | Azari Solar" },
  {
    property: "og:description",
    content:
      "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Solar Projects in Bohol, Philippines | Azari Solar" },
  {
    name: "twitter:description",
    content:
      "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
];

// Rendered on the server so the project grid is present in the HTML rather
// than a skeleton. Falls back to an empty list if the API is unreachable,
// exactly as the client-side fetch already did.
export async function loader() {
  return apiGetList<ApiProject>("/api/projects");
}

export default function Projects() {
  const projects = useLoaderData<typeof loader>();
  return <ASProjects initialProjects={projects} />;
}

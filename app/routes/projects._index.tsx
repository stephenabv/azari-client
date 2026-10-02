import { localizedMeta } from "../lib/i18n-meta";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { ApiProject } from "../../src/services/ASContent";
import { apiGetList, localizedApiPath } from "../lib/api.server";
import "../../src/assets/styles/contents/as_projects.less";
import ASProjects from "../../src/components/ASProjects";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.projects.title") },
  {
    name: "description",
    content: t("system.meta.projects.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/projects" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/projects" },
  { property: "og:title", content: t("system.meta.projects.title") },
  {
    property: "og:description",
    content: t("system.meta.projects.description"),
  },
  { property: "og:image", content: "https://azari.solar/preview.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: t("system.meta.projects.title") },
  {
    name: "twitter:description",
    content: t("system.meta.projects.description"),
  },
  { name: "twitter:image", content: "https://azari.solar/preview.jpg" },
]);

// Rendered on the server so the project grid is present in the HTML rather
// than a skeleton. Falls back to an empty list if the API is unreachable,
// exactly as the client-side fetch already did.
export async function loader({ request }: LoaderFunctionArgs) {
  return apiGetList<ApiProject>(localizedApiPath("/api/projects", request));
}

export default function Projects() {
  const projects = useLoaderData<typeof loader>();
  return <ASProjects initialProjects={projects} />;
}

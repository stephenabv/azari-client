import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import "../../src/assets/styles/contents/as_project_detail.less";
import ASProjectDetails from "../../src/pages/ASProjectDetail";
import type { ASProjectDetailsModel } from "../../src/services/ASContent";
import { apiGet } from "../lib/api.server";
import { socialImageUrl } from "../lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params["id"] ?? "";
  const result = await apiGet<ASProjectDetailsModel>(`/api/projects/${id}`);

  // A project that does not exist — or is unpublished, which the public API
  // reports the same way — is genuinely absent, so answer with a real 404
  // instead of a 200 shell. The root ErrorBoundary renders the 404 page.
  if (result.status === "not-found") {
    throw new Response("Project not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  // The API being unreachable is a server problem, not a missing project.
  // Reporting it as 404 would invite Google to drop a live URL.
  if (result.status === "unavailable") {
    throw new Response("Project temporarily unavailable", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }

  return result.data;
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const project = data as
    | { title?: string; subtitle?: string; imageUrl?: string }
    | undefined;

  const url = `https://azari.solar/projects/${params["id"] ?? ""}`;

  // The loader throws for a missing project, so meta only runs with real data.
  // The canonical is always this project's own URL — never /projects, which
  // would tell Google the page is a duplicate of the index.
  const title = `${project?.title ?? "Solar Project"} — Azari Solar`;
  const description =
    project?.subtitle ??
    `${project?.title ?? "Solar project"} by Azari Solar in Bohol, Philippines.`;
  const image = socialImageUrl(project?.imageUrl);

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};

export default function ProjectDetail() {
  const project = useLoaderData<typeof loader>();
  return <ASProjectDetails initialProject={project} />;
}

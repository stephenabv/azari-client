import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, useLoaderData } from "react-router";
import "../../src/assets/styles/contents/as_project_detail.less";
import ASProjectDetails from "../../src/pages/ASProjectDetail";
import { projectPath } from "../../src/lib/projectPaths";
import type { ASProjectDetailsModel } from "../../src/services/ASContent";
import { apiGet } from "../lib/api.server";
import { PageMeta } from "../lib/page-meta";
import { ProjectSeo } from "../lib/project-seo";
import { JsonLdGraph } from "../lib/schema/json-ld";
import { BreadcrumbListSchema, ProjectSchema } from "../lib/schema/page-schemas";

/** A slug or a legacy cuid; anything else cannot name a project. */
const PROJECT_KEY = /^[A-Za-z0-9-]{1,100}$/;

function notFound(): Response {
  return new Response("Project not found", { status: 404, statusText: "Not Found" });
}

export async function loader({ params }: LoaderFunctionArgs) {
  const key = params["id"] ?? "";
  if (!PROJECT_KEY.test(key)) throw notFound();

  const result = await apiGet<ASProjectDetailsModel>(`/api/projects/${encodeURIComponent(key)}`);

  // A project that does not exist — or is unpublished, which the public API
  // reports the same way — is genuinely absent, so answer with a real 404
  // instead of a 200 shell. The root ErrorBoundary renders the 404 page.
  if (result.status === "not-found") throw notFound();

  // The API being unreachable is a server problem, not a missing project.
  // Reporting it as 404 would invite Google to drop a live URL.
  if (result.status === "unavailable") {
    throw new Response("Project temporarily unavailable", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }

  // Old /projects/<id> links (and any non-canonical spelling) move
  // permanently to the slug URL.
  const project = result.data;
  if (project.slug && key !== project.slug) {
    throw redirect(projectPath(project), 301);
  }

  return project;
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  // The loader throws for a missing project, so meta only runs with real data.
  // The canonical is always this project's own slug URL — never /projects,
  // which would tell Google the page is a duplicate of the index.
  if (!loaderData) return [];
  const seo = new ProjectSeo(loaderData);
  const project = new ProjectSchema(loaderData);
  return [
    ...PageMeta.build({
      title: seo.title(),
      description: seo.description(),
      path: projectPath(loaderData),
      image: loaderData.imageUrl,
      ogType: "article",
    }),
    {
      "script:ld+json": new JsonLdGraph([project, new BreadcrumbListSchema(project.breadcrumbTrail)]).toObject(),
    },
  ];
};

export default function ProjectDetail() {
  const project = useLoaderData<typeof loader>();
  return <ASProjectDetails initialProject={project} />;
}
